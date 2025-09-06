import { Controller, Req, Get, Post, UseGuards, Body } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { LogoutUserCommand } from "../commands/logout-user.command";
import { JwtAuthGuard } from "src/modules/auth/application/infrastructure/guards/jwt.guard";
import { GetUserInfoQuery } from "../query/get-user-info.command";
import { UpdateProfileCommand } from "../commands/update-profile.command";
import { RefreshTokenDto } from "../../dto/refresh-token.dto";
import { RefreshTokenCommand } from "../commands/refresh-token.command";

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

  @Post('refresh-token')
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.commandBus.execute(new RefreshTokenCommand(dto.token));
  }

  @Post('update-profile')
  async updateProfile(@Req() req: any, @Body() profile: any) {
    return this.commandBus.execute(new UpdateProfileCommand(req.user.userId, profile));
  }
}
