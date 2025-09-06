import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from '../commands/login-user.command';
import { successResponse } from 'src/common/utils/response.util';
import { AuthService } from '../services/auth.service';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    private authService: AuthService
  ) { }

  async execute(command: LoginUserCommand): Promise<any> {
    const userResponse = await this.authService.login(command.email, command.password);
    return successResponse({ user: userResponse }, 'User logged in successfully');
  }
}
