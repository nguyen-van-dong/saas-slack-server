import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserService } from "../services/user.service";
import { GetUserInfoQuery } from "../query/get-user-info.command";

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoHandler implements IQueryHandler<GetUserInfoQuery> {
  constructor(
    private readonly userService: UserService,
) {}

  async execute(command: GetUserInfoQuery): Promise<any> {
    return this.userService.getUserInfo(command.userId);
  }
}
