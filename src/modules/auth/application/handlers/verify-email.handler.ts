import { VerifyEmailCommand } from "../commands/verify-email.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { successResponse } from "src/common/utils/response.util";
import { AuthService } from "../services/auth.service";

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(private readonly authService: AuthService) { }

  async execute(command: VerifyEmailCommand): Promise<any> {
    const { token } = command;
    await this.authService.verifyAccount(token);
    return successResponse(null, 'User verified successfully');
  }
}
