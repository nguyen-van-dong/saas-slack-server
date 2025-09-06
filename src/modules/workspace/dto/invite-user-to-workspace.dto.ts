import { IsString } from "class-validator";

export class InviteUserToWorkspaceDto {
  @IsString()
  workspaceId: string;

  @IsString()
  userId: string;
}
