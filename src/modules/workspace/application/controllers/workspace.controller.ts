import { Controller, Delete, Get, Param, Post, Put, Body, UseGuards, Req } from "@nestjs/common";
import { CreateWorkspaceDto } from "../../dto/create-workspace.dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { UpdateWorkspaceDto } from "../../dto/update-workspace.dto";
import { GetAllWorkspaceQuery } from "../query/get-all-workspace.query";
import { GetWorkspaceByIdQuery } from "../query/get-workspace-by-id.query";
import { CreateWorkspaceCommand } from "../commands/create-workspace.command";
import { UpdateWorkspaceCommand } from "../commands/update-workspace.command";
import { DeleteWorkspaceCommand } from "../commands/delete-workspace.command";
import { JwtAuthGuard } from "src/modules/auth/application/infrastructure/guards/jwt.guard";
import { GetCurrentWorkspaceQuery } from "../query/get-current-workspace.query";
import { AssignWorkspaceDto } from "../../dto/assign-workspace.dto";
import { AssignWorkspaceCommand } from "../commands/assign-workspace.command";
import { InviteUserToWorkspaceDto } from "../../dto/invite-user-to-workspace.dto";
import { InviteUserToWorkspaceCommand } from "../commands/invite-user-to-workspace.command";
import { ResponseInviteToWorkspaceDto } from "../../dto/response-invite-to-workspace.dto";
import { ResponseInviteToWorkspaceCommand } from "../commands/response-invite-to-workspace.command";

@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspaceController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) { }

  @Post()
  async createWorkspace(@Body() dto: CreateWorkspaceDto) {
    return this.commandBus.execute(new CreateWorkspaceCommand(dto.name));
  }

  @Get()
  async getAllWorkspaces() {
    return this.queryBus.execute(new GetAllWorkspaceQuery());
  }

  @Get(':id')
  async getWorkspaceById(@Param('id') id: string) {
    return this.queryBus.execute(new GetWorkspaceByIdQuery(id));
  }

  @Put(':id')
  async updateWorkspace(@Param('id') id: string, @Body() dto: UpdateWorkspaceDto) {
    return this.commandBus.execute(new UpdateWorkspaceCommand(id, dto.name));
  }

  @Post('assign-workspace')
  async assignWorkspace(@Body() dto: AssignWorkspaceDto) {
    return this.commandBus.execute(new AssignWorkspaceCommand(dto.workspaceId));
  }

  @Post('invite-user-to-workspace')
  async inviteUserToWorkspace(@Body() dto: InviteUserToWorkspaceDto) {
    return this.commandBus.execute(new InviteUserToWorkspaceCommand(dto.workspaceId, dto.userId));
  }

  @Post('response-invite-to-workspace')
  async responseInviteToWorkspace(@Body() dto: ResponseInviteToWorkspaceDto) {
    return this.commandBus.execute(new ResponseInviteToWorkspaceCommand(dto.workspaceId, dto.userId, dto.status, dto.message));
  }

  @Delete(':id')
  async deleteWorkspace(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteWorkspaceCommand(id));
  }
}
