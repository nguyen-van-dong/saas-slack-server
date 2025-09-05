import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { pick } from 'lodash';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { LoginUserCommand } from '../commands/login-user.command';
import { UserLoginEvent } from '../events/user-login.event';
import { UnauthorizedException } from '@nestjs/common';
import { successResponse } from 'src/common/utils/response.util';
import { JwtService } from '../services/jwt.service';
import { RedisService } from 'src/infrastructure/cache/redis.service';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
    constructor(
        private prisma: PrismaService,
        private eventBus: EventBus,
        private jwtService: JwtService,
        private redisService: RedisService,
    ) { }

    async execute(command: LoginUserCommand): Promise<any> {
        const { email, password } = command;

        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
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

        // Return only specific fields (id, email, fullName) using lodash pick
        // include accessToken and refreshToken
        const accessToken = await this.jwtService.sign({ userId: user.id, role: 'USER' }, '10m');
        const refreshToken = await this.jwtService.sign({ userId: user.id, role: 'USER' }, '7d');
        // save refreshToken to redis
        await this.redisService.set(`refresh:${user.id}`, refreshToken, 7 * 24 * 60 * 60);
        const userResponse = pick(user, ['id', 'email', 'fullName']);
        userResponse['accessToken'] = accessToken;
        userResponse['refreshToken'] = refreshToken;
        return successResponse({ user: userResponse }, 'User logged in successfully');
    }
}
