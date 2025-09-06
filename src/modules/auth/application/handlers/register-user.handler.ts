import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { pick } from 'lodash';
import { RegisterUserCommand } from '../commands/register-user.command';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { successResponse } from 'src/common/utils/response.util';
import { AuthService } from '../services/auth.service';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private eventBus: EventBus,
    private authService: AuthService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<any> {
    const user = await this.authService.createUser(command.email, command.password, command.fullName);

    // Emit event
    this.eventBus.publish(new UserRegisteredEvent(user.id, command.email));

    // Return only specific fields (id, email, fullName) using lodash pick
    const userResponse = pick(user, ['id', 'email', 'fullName']);
    return successResponse({ user: userResponse }, 'User registered successfully');
  }
}
