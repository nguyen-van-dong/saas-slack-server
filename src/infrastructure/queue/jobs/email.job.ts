import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Queues } from '../queues';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailJob {
  constructor(@InjectQueue(Queues.EMAIL) private queue: Queue) {}

  async sendActivationEmail(email: string, token: string) {
    await this.queue.add('send-activation-email', { email, token });
  }

  async sendResetPasswordEmail(email: string, token: string) {
    await this.queue.add('send-reset-password-email', { email, token });
  }
}
