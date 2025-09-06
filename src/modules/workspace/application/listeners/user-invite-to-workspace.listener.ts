import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailJob } from 'src/infrastructure/queue/jobs/email.job';
import { UserInvitedToWorkspaceEvent } from '../events/user-invite-to-workspace.event';

@EventsHandler(UserInvitedToWorkspaceEvent)
export class UserInviteToWorkspaceListener implements IEventHandler<UserInvitedToWorkspaceEvent> {
  constructor(private readonly emailJob: EmailJob) {}

  async handle(event: UserInvitedToWorkspaceEvent) {
    try {
        await this.emailJob.sendInviteEmail(event.workspaceUserId, event.userId);
    } catch (error) {
      console.error('UserInviteToWorkspaceListener: Error sending invite email:', error);
      throw error;
    }
  }
}
