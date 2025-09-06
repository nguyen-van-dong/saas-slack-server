import { Module } from '@nestjs/common';
import { WorkspaceService } from './application/services/workspace.service';
import { WorkspaceRepository } from './infrastructure/workspace.repository';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { commandHandlers } from './application/handlers/index';
import { WorkspaceController } from './application/controllers/workspace.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UserRepository } from '../user/infrastructure/user.repository';
import { EmailJob } from 'src/infrastructure/queue/jobs/email.job';
import { UserInviteToWorkspaceListener } from './application/listeners/user-invite-to-workspace.listener';
import { QueueModule } from 'src/infrastructure/queue/queue.module';

@Module({
  imports: [CqrsModule, QueueModule],
  providers: [
    WorkspaceService,
    {
      provide: WorkspaceRepository,
      useClass: WorkspaceRepository,
    },
    PrismaService,
    ...commandHandlers,
    UserRepository,
    UserInviteToWorkspaceListener,
    EmailJob,
  ],
  controllers: [WorkspaceController],
  exports: [WorkspaceService, WorkspaceRepository],
})
export class WorkspaceModule {}
