export class UserInvitedToWorkspaceEvent {
  constructor(public readonly workspaceUserId: string, public readonly userId: string) {}
}
