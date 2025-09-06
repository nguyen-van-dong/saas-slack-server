import { InviteStatus } from '../../domain/workspace.entity';

export class ResponseInviteToWorkspaceCommand {
  constructor(public readonly workspaceId: string, public readonly userId: string, public readonly status: InviteStatus, public readonly message: string) {}
}
