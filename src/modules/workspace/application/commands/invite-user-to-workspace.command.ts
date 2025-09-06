export class InviteUserToWorkspaceCommand {
  constructor(public readonly workspaceId: string, public readonly userId: string) {}
}
