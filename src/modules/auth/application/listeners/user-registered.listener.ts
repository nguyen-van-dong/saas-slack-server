import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Queues } from 'src/infrastructure/queue/queues';

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredListener implements IEventHandler<UserRegisteredEvent> {
  constructor(
    @InjectQueue(Queues.EMAIL)
    private readonly emailQueue: Queue,
  ) {}

  async handle(event: UserRegisteredEvent) {
    await this.emailQueue.add('send-activation-email', {
      email: event.email,
    //   token: event.token,
    });
  }
}