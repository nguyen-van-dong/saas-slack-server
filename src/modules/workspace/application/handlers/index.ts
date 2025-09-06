import { CreateWorkspaceHandler } from './create-workspace.handler';
import { UpdateWorkspaceHandler } from './update-workspace.handler';
import { DeleteWorkspaceHandler } from './delete-workspace.handler';
import { GetAllWorkspaceHandler } from './get-all-workspace.handler';
import { GetWorkspaceByIdHandler } from './get-workspace-by-id.handler';
import { GetCurrentWorkspaceHandler } from './get-current-workspace.handler';
import { InviteUserToWorkspaceHandler } from './invite-user-to-workspace.handler';
import { ResponseInviteToWorkspaceHandler } from './response-invite-to-workspace.handler';

export const commandHandlers = [
  CreateWorkspaceHandler,
  UpdateWorkspaceHandler,
  DeleteWorkspaceHandler,
  GetAllWorkspaceHandler,
  GetWorkspaceByIdHandler,
  GetCurrentWorkspaceHandler,
  InviteUserToWorkspaceHandler,
  ResponseInviteToWorkspaceHandler,
];
