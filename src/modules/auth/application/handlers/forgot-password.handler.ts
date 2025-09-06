import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForgotPasswordCommand } from '../commands/forgot-password.command';
import { successResponse } from 'src/common/utils/response.util';
import { AuthService } from '../services/auth.service';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: ForgotPasswordCommand): Promise<any> {
    const { email } = command;
    await this.authService.forgotPassword(email);
    return successResponse(null, 'Password reset email sent successfully');
  }
}
