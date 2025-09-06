import { CreateWorkspaceCommand } from "../commands/create-workspace.command";
import { WorkspaceService } from "../services/workspace.service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Workspace } from "../../domain/workspace.entity";
import { successResponse } from "src/common/utils/response.util";
import { pick } from "lodash";

@CommandHandler(CreateWorkspaceCommand)
export class CreateWorkspaceHandler implements ICommandHandler<CreateWorkspaceCommand> {
  constructor(private readonly workspaceService: WorkspaceService) {}

  async execute(command: CreateWorkspaceCommand): Promise<any> {
    const workspace = await this.workspaceService.createWorkspace(command.name);
    const workspaceResponse = pick(workspace, ['id', 'name', 'slug']);
    return successResponse({ workspace: workspaceResponse }, 'Workspace created successfully');
  }
}