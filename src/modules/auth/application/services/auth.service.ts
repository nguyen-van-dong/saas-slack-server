import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/modules/user/infrastructure/user.repository';
import { Injectable } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { JwtService } from "./jwt.service";
import { RedisService } from "src/infrastructure/cache/redis.service";
import { UserLoginEvent } from "../events/user-login.event";
import { pick } from "lodash";
import { successResponse } from "src/common/utils/response.util";
import { randomBytes } from "crypto";
import { ForgotPasswordEvent } from "../events/forgot-password.event";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) { }

  /**
   * Create user
   * @param {string} email
   * @param {string} password
   * @param {string} fullName
   * @returns {Promise<any>}
   */
  async createUser(email: string, password: string, fullName: string): Promise<any> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.userRepository.create({
      email,
      password: hashedPassword,
      fullName,
    });
  }

  /**
   * Login
   * @param {string} email
   * @param {string} password
   * @returns {Promise<any>}
   */
  async login(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User not activated');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Emit event
    this.eventBus.publish(new UserLoginEvent(user.id, email));

    // include accessToken and refreshToken
    const accessToken = await this.jwtService.sign({ userId: user.id, role: 'USER' }, '10m');
    const refreshToken = await this.jwtService.sign({ userId: user.id, role: 'USER' }, '7d');
    // save refreshToken to redis
    await this.redisService.set(`refresh:${user.id}`, refreshToken, 7 * 24 * 60 * 60);
    const userResponse = pick(user, ['id', 'email', 'fullName']);
    userResponse['accessToken'] = accessToken;
    userResponse['refreshToken'] = refreshToken;
    return userResponse;
  }

  /**
   * Verify account
   * @param {string} token
   * @returns {Promise<any>}
   */
  async verifyAccount(token: string): Promise<any> {
    const user = await this.userRepository.findById(token);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.isActive) {
      throw new BadRequestException('User already verified');
    }
    await this.userRepository.update(user.id, {
      isActive: true,
    });
    return successResponse(null, 'User verified successfully');
  }

  /**
   * Forgot password
   * @param {string} email
   * @returns {Promise<any>}
   */
  async forgotPassword(email: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const token = randomBytes(32).toString('hex');
    await this.userRepository.update(user.id, {
      resetPasswordToken: token,
      resetPasswordExpires: new Date(Date.now() + 3600 * 1000),
    });
    this.eventBus.publish(new ForgotPasswordEvent(token, email));
    return successResponse(null, 'Reset password email sent successfully');
  }

  /**
   * Reset password
   * @param {string} token
   * @param {string} password
   * @returns {Promise<any>}
   */
  async resetPassword(token: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ resetPasswordToken: token });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token expired');
    }
    
    await this.userRepository.update(user.id, {
      password: await bcrypt.hash(password.toString(), 10),
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
    return successResponse(null, 'Password reset successfully');
  }

  /**
   * Refresh token
   * @param {string} token
   * @returns {Promise<any>}
   */
  async refreshToken(token: string): Promise<any> {
    try {
      // Verify the refresh token
      const decoded = this.jwtService.verify(token);
      
      if (!decoded.userId) {
        throw new UnauthorizedException('Invalid token');
      }

      // Check if refresh token exists in Redis
      const storedRefreshToken = await this.redisService.get(`refresh:${decoded.userId}`);
      if (!storedRefreshToken || storedRefreshToken !== token) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      // Get user information
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      if (!user.isActive) {
        throw new UnauthorizedException('User account is not active');
      }

      // Generate new tokens
      const newAccessToken = await this.jwtService.sign({ userId: user.id, role: 'USER' }, '10m');
      const newRefreshToken = await this.jwtService.sign({ userId: user.id, role: 'USER' }, '7d');

      // Update refresh token in Redis
      await this.redisService.set(`refresh:${user.id}`, newRefreshToken, 7 * 24 * 60 * 60);

      return successResponse({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        }
      }, 'Token refreshed successfully');
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      // Handle JWT verification errors
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      throw new BadRequestException('Token refresh failed');
    }
  }
}
