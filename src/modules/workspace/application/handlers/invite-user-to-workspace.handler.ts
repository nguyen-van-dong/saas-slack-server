import { InviteUserToWorkspaceCommand } from "../commands/invite-user-to-workspace.command";
import { UserInvitedToWorkspaceEvent } from "../events/user-invite-to-workspace.event";
import { WorkspaceService } from "../services/workspace.service";
import { EventBus, ICommandHandler } from "@nestjs/cqrs";
import { successResponse } from "src/common/utils/response.util";

export class InviteUserToWorkspaceHandler implements ICommandHandler<InviteUserToWorkspaceCommand> {
  constructor(private readonly workspaceService: WorkspaceService, private readonly eventBus: EventBus) {}

  async execute(command: InviteUserToWorkspaceCommand): Promise<any> {
    const workspaceUser = await this.workspaceService.inviteUserToWorkspace(command.workspaceId, command.userId);

    this.eventBus.publish(new UserInvitedToWorkspaceEvent(workspaceUser.id.toString(), workspaceUser.userId));
    return successResponse(workspaceUser, 'User invited to workspace successfully');
  }
}