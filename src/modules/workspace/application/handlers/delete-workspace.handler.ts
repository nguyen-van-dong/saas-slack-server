import { DeleteWorkspaceCommand } from "../commands/delete-workspace.command";
import { WorkspaceService } from "../services/workspace.service";
import { successResponse } from "src/common/utils/response.util";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteWorkspaceCommand)
export class DeleteWorkspaceHandler implements ICommandHandler<DeleteWorkspaceCommand> {
  constructor(private readonly workspaceService: WorkspaceService) {}

  async execute(command: DeleteWorkspaceCommand): Promise<any> {
    await this.workspaceService.deleteWorkspace(command.id);
    return successResponse(null, 'Workspace deleted successfully');
  }
}
