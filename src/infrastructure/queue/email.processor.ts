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
    console.log(`[EmailProcessor] Processing job: ${job.name}`, job.data);
    
    try {
      switch (job.name) {
        case 'send-activation-email':
          return await this.mailService.sendActivationEmail(job.data.email, job.data.token);

        case 'send-reset-password-email':
          return await this.mailService.sendResetPasswordEmail(job.data.email, job.data.token);

        default:
          console.warn(`[EmailProcessor] Unknown job name: ${job.name}`);
          throw new Error(`Unknown job name: ${job.name}`);
      }
    } catch (error) {
      console.error(`[EmailProcessor] Error processing job ${job.name}:`, error);
      throw error;
    }
  }
}