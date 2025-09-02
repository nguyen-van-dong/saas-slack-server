import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Queues } from './queues';

@Processor(Queues.REPORT)
export class ReportProcessor {
  async process(job: Job<{ userId: string }>) {
    switch (job.name) {
      case 'export-user-activity':
        // TODO: Implement report export
        return null;
      default:
        console.warn(`[EmailProcessor] Unknown job name: ${job.name}`);
        return null;
    }
  }
}
