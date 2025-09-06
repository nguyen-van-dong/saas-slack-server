import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { EmailJob } from 'src/infrastructure/queue/jobs/email.job';

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredListener implements IEventHandler<UserRegisteredEvent> {
  constructor(private readonly emailJob: EmailJob) {}

  async handle(event: UserRegisteredEvent) {
    try {
      await this.emailJob.sendActivationEmail(event.email, event.userId);
    } catch (error) {
      console.error('UserRegisteredListener: Error sending activation email:', error);
      throw error;
    }
  }
}
