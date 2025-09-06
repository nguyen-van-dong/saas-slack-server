import { Module } from '@nestjs/common';
import { WorkspaceService } from './application/services/workspace.service';
import { WorkspaceRepository } from './infrastructure/workspace.repository';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Module({
  providers: [
    WorkspaceService,
    {
      provide: WorkspaceRepository,
      useClass: WorkspaceRepository,
    },
    PrismaService,
  ],
  exports: [WorkspaceService, WorkspaceRepository],
})
export class WorkspaceModule {}
