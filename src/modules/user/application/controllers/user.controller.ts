import { Controller, Req, Get, Post, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { GetUserInfoCommand } from "../commands/get-user-info.command";
import { LogoutUserCommand } from "../commands/logout-user.command";
import { JwtAuthGuard } from "src/modules/auth/application/infrastructure/guards/jwt.guard";

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get('info')
  async getUserInfo(@Req() req: any) {
    return this.commandBus.execute(new GetUserInfoCommand(req.user.userId));
  }

  @Post('logout')
  async logout(@Req() req: any) {
    return this.commandBus.execute(new LogoutUserCommand(req.user.userId));
  }
}
