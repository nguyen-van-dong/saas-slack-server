import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GetUserInfoCommand } from "../commands/get-user-info.command";
import { UserService } from "../services/user.service";

@CommandHandler(GetUserInfoCommand)
export class GetUserInfoHandler implements ICommandHandler<GetUserInfoCommand> {
  constructor(
    private readonly userService: UserService,
) {}

  async execute(command: GetUserInfoCommand): Promise<any> {
    return this.userService.getUserInfo(command.userId);
  }
}
