import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserDto } from '../dto/register-user.dto';
import { RegisterUserCommand } from '../application/commands/register-user.command';
import { LoginUserDto } from '../dto/login-user.dto';
import { LoginUserCommand } from '../application/commands/login-user.command';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { VerifyEmailCommand } from '../application/commands/verify-email.command';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ForgotPasswordCommand } from '../application/commands/forgot-password.command';
import { ResetPasswordDto } from '../dto/reset-pasword.dto';
import { ResetPasswordCommand } from '../application/commands/reset-password.command';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ChangePasswordCommand } from '../application/commands/change-password.command';
import { RefreshTokenCommand } from '../application/commands/refresh-token.command';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.commandBus.execute(new RegisterUserCommand(dto.email, dto.password, dto.fullName));
  }

  @Post('verify-account')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.commandBus.execute(new VerifyEmailCommand(dto.token));
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return this.commandBus.execute(new LoginUserCommand(dto.email, dto.password));
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.commandBus.execute(new ForgotPasswordCommand(dto.email));
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.commandBus.execute(new ResetPasswordCommand(dto.token, dto.password));
  }

  @Post('refresh-token')
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.commandBus.execute(new RefreshTokenCommand(dto.token));
  }

  @Post('change-password')
  async changePassword(@Body() dto: ChangePasswordDto) {
    return this.commandBus.execute(new ChangePasswordCommand(dto.token, dto.password));
  }
}
