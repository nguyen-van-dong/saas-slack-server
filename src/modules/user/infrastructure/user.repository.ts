import { Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '../domain/user.repository.interface';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { User } from '../domain/user.entity';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<User>): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email!,
        fullName: data.fullName!,
        password: data.password!,
      },
    });

    return new User(user.id, user.email, user.fullName, user.password, user.createdAt, user.updatedAt, false, null, null);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return new User(user.id, user.email, user.fullName, user.password, user.createdAt, user.updatedAt, user.isActive, null, null);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.prisma.user.update({ where: { id }, data });
    return new User(user.id, user.email, user.fullName, user.password, user.createdAt, user.updatedAt, user.isActive, null, null);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return new User(user.id, user.email, user.fullName, user.password, user.createdAt, user.updatedAt, user.isActive, null, null);
  }

  async findOneBy(filter: Partial<User>): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: filter as any });
    if (!user) return null;
    return new User(user.id, user.email, user.fullName, user.password, user.createdAt, user.updatedAt, user.isActive, null, null);
  }
}
