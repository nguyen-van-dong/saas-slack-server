
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LogoutUserCommand } from "../commands/logout-user.command";
import { RedisService } from "src/infrastructure/cache/redis.service";
import { successResponse } from "src/common/utils/response.util";
import { UnauthorizedException } from "@nestjs/common";

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
  constructor(private readonly redisService: RedisService) {}

  async execute(command: LogoutUserCommand): Promise<any> {
    const user = await this.redisService.get(`refresh:${command.token}`);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    await this.redisService.delete(`refresh:${command.token}`);
    return successResponse(null, 'User logged out successfully');
  }
}
