import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResetPasswordCommand } from '../commands/reset-password.command';
import { successResponse } from 'src/common/utils/response.util';
import { AuthService } from '../services/auth.service';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: ResetPasswordCommand): Promise<any> {
    const { token, password } = command;
    await this.authService.resetPassword(token, password);
    return successResponse(null, 'Password reset successfully');
  }
}
