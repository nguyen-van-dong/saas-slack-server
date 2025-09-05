import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { pick } from 'lodash';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { RegisterUserCommand } from '../commands/register-user.command';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { successResponse } from 'src/common/utils/response.util';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBus,
  ) {}

  async execute(command: RegisterUserCommand): Promise<any> {
    const { email, password, fullName } = command;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
      },
    });

    // Emit event
    this.eventBus.publish(new UserRegisteredEvent(user.id, email));

    // Return only specific fields (id, email, fullName) using lodash pick
    const userResponse = pick(user, ['id', 'email', 'fullName']);
    return successResponse({ user: userResponse }, 'User registered successfully');
  }
}
