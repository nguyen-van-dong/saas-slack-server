import { Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '../domain/user.repository.interface';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { BaseRepository } from 'src/infrastructure/database/base-repository';
import { User } from '../domain/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<
  User,
  Partial<User>,
  Partial<User>,
  Partial<User>,
  any
> implements UserRepositoryInterface {
  
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.user);
  }

  // Implement the abstract method from BaseRepository
  protected toDomain(prismaModel: any): User {
    return new User(
      prismaModel.id,
      prismaModel.email,
      prismaModel.fullName,
      prismaModel.password,
      prismaModel.createdAt,
      prismaModel.updatedAt,
      prismaModel.isActive,
      prismaModel.resetPasswordExpires,
      prismaModel.resetPasswordToken
    );
  }

  // Custom methods specific to User
  async findByEmail(email: string): Promise<User | null> {
    return this.findUnique({ email });
  }

  async findOneBy(filter: Partial<User>): Promise<User | null> {
    return this.findUnique(filter);
  }
}
