import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { LoginUserCommand } from '../commands/login-user.command';
import { UserLoginEvent } from '../events/user-login.event';
import { UnauthorizedException } from '@nestjs/common';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
    constructor(
        private prisma: PrismaService,
        private eventBus: EventBus,
    ) { }

    async execute(command: LoginUserCommand): Promise<any> {
        const { email, password } = command;

        const user = await this.prisma.user.findUniqueOrThrow({
            where: {
                email,
            },
        });

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        // Emit event
        this.eventBus.publish(new UserLoginEvent(user.id, email));

        return { user };
    }
}
