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
}
