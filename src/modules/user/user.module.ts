import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { LogoutUserHandler } from './application/handlers/logout.handler';
import { UserController } from './application/controllers/user.controller';
import { GetUserInfoHandler } from './application/handlers/get-user-info.handler';
import { UserService } from './application/services/user.service';
import { UserRepository } from './infrastructure/user.repository';
import { RefreshTokenHandler } from './application/handlers/refresh-token.handler';

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [
    PrismaService,
    LogoutUserHandler,
    GetUserInfoHandler,
    UserService,
    UserRepository,
    RefreshTokenHandler,
  ],
})
export class UserModule {}
