import { PrismaService } from "src/infrastructure/database/prisma.service";
import { VerifyEmailCommand } from "../commands/verify-email.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { successResponse } from "src/common/utils/response.util";

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
    constructor(private readonly prisma: PrismaService) {}

    async execute(command: VerifyEmailCommand): Promise<any> {
        const { email } = command;

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.isActive) {
            throw new BadRequestException('User already verified');
        }

        user.isActive = true;
        await this.prisma.user.update({
            where: { id: user.id },
            data: { isActive: true },
        });

        return successResponse(null, 'User verified successfully');
    }
}
