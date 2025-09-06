import { Workspace } from './workspace.entity';
import { BaseRepositoryInterface } from 'src/infrastructure/database/base-repository.interface';

export interface WorkspaceRepositoryInterface extends BaseRepositoryInterface<
  Workspace,
  Partial<Workspace>,
  Partial<Workspace>,
  Partial<Workspace>
> {
  // Add custom methods specific to Workspace
  findBySlug(slug: string): Promise<Workspace | null>;
  findByName(name: string): Promise<Workspace[]>;
}
