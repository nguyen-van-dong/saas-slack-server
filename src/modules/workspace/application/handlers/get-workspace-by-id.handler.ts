import { GetWorkspaceByIdQuery } from "../query/get-workspace-by-id.query";
import { WorkspaceService } from "../services/workspace.service";
import { successResponse } from "src/common/utils/response.util";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { pick } from "lodash";

@QueryHandler(GetWorkspaceByIdQuery)
export class GetWorkspaceByIdHandler implements IQueryHandler<GetWorkspaceByIdQuery> {
  constructor(private readonly workspaceService: WorkspaceService) {}

  async execute(query: GetWorkspaceByIdQuery): Promise<any> {
    const workspace = await this.workspaceService.getWorkspaceById(query.id);
    const workspaceResponse = pick(workspace, ['id', 'name', 'slug']);
    return successResponse({ workspace: workspaceResponse }, 'Workspace fetched successfully');
  }
}
