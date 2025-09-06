import { PrismaService } from "src/infrastructure/database/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "../../../user/infrastructure/user.repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserInfo(userId: string): Promise<any> {
    return this.userRepository.findById(userId);
  }

  async updateUser(userId: string, profile: any): Promise<any> {
    return this.userRepository.update(userId, profile);
  }

  async refreshToken(token: string): Promise<any> {
    // const user = await this.userRepository.findOneBy({ keyStoreRefreshToken: token });
    // if (!user) {
    //   throw new BadRequestException('User not found');
    // }
    // if (user.keyStoreRefreshToken !== token) {
    //   throw new BadRequestException('Invalid token');
    // }
    // const keyStore = await this.keyStoreRepository.findByRefreshToken(token);
    // if (!keyStore) {
    //   throw new BadRequestException('Key store not found');
    // }
    // return user;
  }
}
