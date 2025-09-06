import { Injectable } from '@nestjs/common';
import { Workspace } from '../../domain/workspace.entity';
import { WorkspaceRepository } from '../../infrastructure/workspace.repository';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository
  ) {}

  async createWorkspace(name: string, slug: string) {
    return this.workspaceRepository.create({ name, slug });
  }

  async getAllWorkspaces() {
    return this.workspaceRepository.findMany();
  }

  async getWorkspaceById(id: string) {
    return this.workspaceRepository.findById(id);
  }

  async getWorkspaceBySlug(slug: string) {
    return this.workspaceRepository.findBySlug(slug);
  }

  async updateWorkspace(id: string, data: Partial<Workspace>) {
    return this.workspaceRepository.update(id, data);
  }

  async deleteWorkspace(id: string) {
    return this.workspaceRepository.delete(id);
  }

  async getWorkspacesWithPagination(page: number, limit: number) {
    return this.workspaceRepository.findManyWithPagination(page, limit);
  }

  async searchWorkspacesByName(name: string) {
    return this.workspaceRepository.findByName(name);
  }
}
