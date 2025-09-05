import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { ResetPasswordCommand } from '../commands/reset-password.command';
import { successResponse } from 'src/common/utils/response.util';
import * as bcrypt from 'bcrypt';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: ResetPasswordCommand): Promise<any> {
    const { token, password } = command;

    // TODO: Implement token validation logic here
    // For now, just return success
    return successResponse(null, 'Password reset successfully');
  }
}
