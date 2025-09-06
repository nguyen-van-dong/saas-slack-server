import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { RefreshTokenCommand } from '../commands/refresh-token.command';
import { successResponse } from 'src/common/utils/response.util';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: RefreshTokenCommand): Promise<any> {
    const { token } = command;

    // TODO: Implement token refresh logic here
    // For now, just return success
    return successResponse(null, 'Token refreshed successfully');
  }
}
