import { GetCurrentWorkspaceQuery } from "../query/get-current-workspace.query";
import { WorkspaceService } from "../services/workspace.service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetCurrentWorkspaceQuery)
export class GetCurrentWorkspaceHandler implements IQueryHandler<GetCurrentWorkspaceQuery> {
  constructor(private readonly workspaceService: WorkspaceService) {}

  async execute(query: GetCurrentWorkspaceQuery): Promise<any> {
    return this.workspaceService.getCurrentWorkspace();
  }
}