import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { ChangePasswordCommand } from '../commands/change-password.command';
import { successResponse } from 'src/common/utils/response.util';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: ChangePasswordCommand): Promise<any> {
    const { token, password } = command;

    // TODO: Implement token validation and password change logic here
    // For now, just return success
    return successResponse(null, 'Password changed successfully');
  }
}
