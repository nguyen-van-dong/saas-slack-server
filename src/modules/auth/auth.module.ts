import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controller/auth.controller';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { RegisterUserHandler } from './application/handlers/register-user.handler';
import { LoginUserHandler } from './application/handlers/login-user.handler';
import { JwtService } from './application/services/jwt.service';
import { VerifyEmailHandler } from './application/handlers/verify-email.handler';
import { ForgotPasswordHandler } from './application/handlers/forgot-password.handler';
import { ResetPasswordHandler } from './application/handlers/reset-password.handler';
import { ChangePasswordHandler } from './application/handlers/change-password.handler';
import { RefreshTokenHandler } from './application/handlers/refresh-token.handler';
import { JwtStrategy } from './application/infrastructure/strategies/jwt.strategy';
import { RedisModule } from 'src/infrastructure/cache/redis.module';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    RegisterUserHandler,
    LoginUserHandler,
    JwtService,
    VerifyEmailHandler,
    ForgotPasswordHandler,
    ResetPasswordHandler,
    ChangePasswordHandler,
    RefreshTokenHandler,
    JwtStrategy,
  ],
  exports: [JwtModule],
})
export class AuthModule { }
