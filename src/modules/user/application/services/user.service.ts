import { PrismaService } from "src/infrastructure/database/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserInfo(userId: string): Promise<any> {
    return this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, fullName: true } });
  }

  async updateUser(userId: string, profile: any): Promise<any> {
    return this.prisma.user.update({ where: { id: userId }, data: profile });
  }
}
