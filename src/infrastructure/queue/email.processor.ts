import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Queues } from './queues';
import { MailService } from 'src/modules/auth/application/services/mail.service';

@Processor(Queues.EMAIL)
export class EmailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'send-activation-email':
        return this.mailService.sendActivationEmail(job.data.email, job.data.token);

      case 'send-reset-password-email':
        return this.mailService.sendResetPasswordEmail(job.data.email, job.data.token);

      default:
        console.warn(`[EmailProcessor] Unknown job name: ${job.name}`);
    }
  }
}