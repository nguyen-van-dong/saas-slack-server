import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';
import { Queues } from './queues';
import { MailService } from 'src/modules/auth/application/services/mail.service';

@Module({
    imports: [
        BullModule.registerQueue(
            {
                name: Queues.EMAIL,
                connection: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
                },
            },
            {
                name: Queues.REPORT,
                connection: {
                    host: process.env.REDIS_HOST,
                    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
                },
            }
        ),
    ],
    providers: [EmailProcessor, MailService],
    exports: [],
})
export class QueueModule { }
