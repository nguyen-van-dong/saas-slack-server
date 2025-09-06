import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ForgotPasswordEvent } from '../events/forgot-password.event';
import { EmailJob } from 'src/infrastructure/queue/jobs/email.job';

@EventsHandler(ForgotPasswordEvent)
export class ForgotPasswordListener implements IEventHandler<ForgotPasswordEvent> {
  constructor(private readonly emailJob: EmailJob) {}

  async handle(event: ForgotPasswordEvent) {
    try {
      await this.emailJob.sendResetPasswordEmail(event.email, event.userId);
    } catch (error) {
      console.error('ForgotPasswordListener: Error sending reset password email:', error);
      throw error;
    }
  }
}
