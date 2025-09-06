import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResponseInviteToWorkspaceCommand } from '../commands/response-invite-to-workspace.command';
import { WorkspaceService } from '../services/workspace.service';
import { successResponse } from 'src/common/utils/response.util';

@CommandHandler(ResponseInviteToWorkspaceCommand)
export class ResponseInviteToWorkspaceHandler implements ICommandHandler<ResponseInviteToWorkspaceCommand> {
  constructor(private readonly workspaceService: WorkspaceService) {}

  async execute(command: ResponseInviteToWorkspaceCommand): Promise<any> {
    const { workspaceId, userId, status, message } = command;

    const result = await this.workspaceService.responseInviteToWorkspace(
      workspaceId,
      userId,
      status,
      message
    );

    return successResponse(result, 'Invite response processed successfully');
  }
}
