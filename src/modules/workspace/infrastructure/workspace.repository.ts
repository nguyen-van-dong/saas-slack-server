import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { BaseRepository } from 'src/infrastructure/database/base-repository';
import { WorkspaceRepositoryInterface } from '../domain/workspace.repository.interface';
import { Workspace } from '../domain/workspace.entity';
import { WorkspaceUser } from '@prisma/client';

@Injectable()
export class WorkspaceRepository extends BaseRepository<
  Workspace,
  Partial<Workspace>,
  Partial<Workspace>,
  Partial<Workspace>,
  any
> implements WorkspaceRepositoryInterface {
  
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.workspace);
  }

  // Implement the abstract method from BaseRepository
  protected toDomain(prismaModel: any): Workspace {
    return new Workspace(
      prismaModel.id,
      prismaModel.name,
      prismaModel.slug,
      prismaModel.createdAt,
      prismaModel.updatedAt
    );
  }

  // Custom methods specific to Workspace
  async findBySlug(slug: string): Promise<Workspace | null> {
    return this.findUnique({ slug });
  }

  async findByName(name: string): Promise<Workspace[]> {
    return this.findMany({ name });
  }

  async assignUserToWorkspace(workspaceId: string, userId: string): Promise<WorkspaceUser> {
    return this.prisma.workspaceUser.create({
      data: {
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        role: 'USER',
      },
      include: {
        user: true,
        workspace: true,
      },
    });
  }
}
