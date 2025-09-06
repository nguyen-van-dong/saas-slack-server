import { IsString } from "class-validator";

export class AssignWorkspaceDto {
  @IsString()
  workspaceId: string;
}
