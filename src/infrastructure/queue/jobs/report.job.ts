import { InjectQueue } from "@nestjs/bullmq";
import { Queues } from "../queues";
import { Queue } from "bullmq";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ReportJob {
  constructor(@InjectQueue(Queues.REPORT) private queue: Queue) {}

  async exportUserActivity(userId: string) {
    await this.queue.add('export-user-activity', { userId });
  }
}
