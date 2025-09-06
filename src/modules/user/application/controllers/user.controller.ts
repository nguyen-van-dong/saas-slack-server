import { Controller, Req, Get, Post, UseGuards, Body } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { LogoutUserCommand } from "../commands/logout-user.command";
import { JwtAuthGuard } from "src/modules/auth/application/infrastructure/guards/jwt.guard";
import { GetUserInfoQuery } from "../query/get-user-info.command";
import { UpdateProfileCommand } from "../commands/update-profile.command";

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get('info')
  async getUserInfo(@Req() req: any) {
    return this.queryBus.execute(new GetUserInfoQuery(req.user.userId));
  }

  @Post('logout')
  async logout(@Req() req: any) {
    return this.commandBus.execute(new LogoutUserCommand(req.user.userId));
  }

  @Post('update-profile')
  async updateProfile(@Req() req: any, @Body() profile: any) {
    return this.commandBus.execute(new UpdateProfileCommand(req.user.userId, profile));
  }
}
