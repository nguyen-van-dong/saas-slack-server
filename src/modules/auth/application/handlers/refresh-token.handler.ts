import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from '../commands/refresh-token.command';
import { AuthService } from '../services/auth.service';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    private readonly authService: AuthService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<any> {
    const { token } = command;
    return this.authService.refreshToken(token);
  }
}
