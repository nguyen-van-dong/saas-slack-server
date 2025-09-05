import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { ForgotPasswordCommand } from '../commands/forgot-password.command';
import { successResponse } from 'src/common/utils/response.util';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: ForgotPasswordCommand): Promise<any> {
    const { email } = command;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // TODO: Implement email sending logic here
    // For now, just return success
    return successResponse(null, 'Password reset email sent successfully');
  }
}
