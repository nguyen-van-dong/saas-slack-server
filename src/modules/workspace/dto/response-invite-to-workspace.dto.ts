import { IsEnum, IsString } from "class-validator";
import { InviteStatus } from "../domain/workspace.entity";

export class ResponseInviteToWorkspaceDto {
  @IsString()
  workspaceId: string;

  @IsString()
  userId: string;

  @IsString()
  message: string;

  @IsEnum(InviteStatus)
  status: InviteStatus;
}
