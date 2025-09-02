import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './controller/auth.controller';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { RegisterUserHandler } from './application/handlers/register-user.handler';

@Module({
  imports: [CqrsModule],
  controllers: [AuthController],
  providers: [PrismaService, RegisterUserHandler],
})
export class AuthModule {}
