import { UpdateWorkspaceCommand } from "../commands/update-workspace.command";
import { WorkspaceService } from "../services/workspace.service";
import { successResponse } from "src/common/utils/response.util";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { pick } from "lodash";

@CommandHandler(UpdateWorkspaceCommand)
export class UpdateWorkspaceHandler implements ICommandHandler<UpdateWorkspaceCommand> {
  constructor(private readonly workspaceService: WorkspaceService) {}

  async execute(command: UpdateWorkspaceCommand): Promise<any> {
    const workspace = await this.workspaceService.updateWorkspace(command.id, { name: command.name });
    const workspaceResponse = pick(workspace, ['id', 'name', 'slug']);
    return successResponse({ workspace: workspaceResponse }, 'Workspace updated successfully');
  }
}
