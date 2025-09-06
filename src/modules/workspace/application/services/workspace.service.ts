import { Injectable, NotFoundException } from '@nestjs/common';
import { Workspace, InviteStatus } from '../../domain/workspace.entity';
import { WorkspaceRepository } from '../../infrastructure/workspace.repository';
import { slugify } from '../../../../shared/utils/slugify';
import { UserRepository } from 'src/modules/user/infrastructure/user.repository';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly userRepository: UserRepository
  ) {}

  async createWorkspace(name: string) {
    return this.workspaceRepository.create({ name, slug: slugify(name) });
  }

  async getAllWorkspaces() {
    return await this.workspaceRepository.findMany();
  }

  async getWorkspaceById(id: string) {
    const workspace = await this.workspaceRepository.findById(id);
    return workspace;
  }

  async getWorkspaceBySlug(slug: string) {
    const workspace = await this.workspaceRepository.findBySlug(slug);
    return workspace;
  }

  async updateWorkspace(id: string, data: Partial<Workspace>) {
    const workspace = await this.workspaceRepository.update(id, data);
    return workspace;
  }

  async deleteWorkspace(id: string) {
    await this.workspaceRepository.delete(id);
    return {
      message: 'Workspace deleted successfully'
    };
  }

  async getWorkspacesWithPagination(page: number, limit: number) {
    const workspaces = await this.workspaceRepository.findManyWithPagination(page, limit);
    return workspaces;
  }

  async searchWorkspacesByName(name: string) {
    const workspaces = await this.workspaceRepository.findByName(name);
    return workspaces;
  }

  async getCurrentWorkspace() {
    // TODO: Implement this
    // const workspace = await this.workspaceRepository.findCurrentWorkspace();
    // return workspace;
  }

  async inviteUserToWorkspace(workspaceId: string, userId: string) {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) throw new NotFoundException('Workspace not found');
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    
    // Use Prisma's connect operation to add user to workspace
    const workspaceUser = await this.workspaceRepository.assignUserToWorkspace(workspaceId, userId);
    return workspaceUser;
  }

  async responseInviteToWorkspace(workspaceId: string, userId: string, status: InviteStatus, message: string) {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) throw new NotFoundException('Workspace not found');
    
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (status === InviteStatus.ACCEPTED) {
      // Add user to workspace using the repository method
      const workspaceUser = await this.workspaceRepository.assignUserToWorkspace(workspaceId, userId);
      return {
        workspaceUser,
        status,
        message: message || 'Invite accepted successfully'
      };
    } else if (status === InviteStatus.DECLINED) {
      // Just log the decline, no database changes needed
      return {
        status,
        message: message || 'Invite declined'
      };
    }

    throw new Error('Invalid invite status');
  }
}
