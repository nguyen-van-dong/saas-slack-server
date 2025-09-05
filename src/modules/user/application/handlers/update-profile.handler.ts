import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { UpdateProfileCommand } from "../commands/update-profile.command";
import { UserService } from "../services/user.service";

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(private readonly userService: UserService) {}

  async execute(command: UpdateProfileCommand): Promise<any> {
    return this.userService.updateUser(command.userId, command.profile);
  }
}
