import { GetAllWorkspaceQuery } from "../query/get-all-workspace.query";
import { WorkspaceService } from "../services/workspace.service";
import { successResponse } from "src/common/utils/response.util";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { pick } from "lodash";

@QueryHandler(GetAllWorkspaceQuery)
export class GetAllWorkspaceHandler implements IQueryHandler<GetAllWorkspaceQuery> {
  constructor(private readonly workspaceService: WorkspaceService) {}

  async execute(query: GetAllWorkspaceQuery): Promise<any> {
    const workspaces = await this.workspaceService.getAllWorkspaces();
    const workspacesResponse = workspaces.map(workspace => pick(workspace, ['id', 'name', 'slug']));
    return successResponse({ workspaces: workspacesResponse }, 'Workspaces fetched successfully');
  }
}
