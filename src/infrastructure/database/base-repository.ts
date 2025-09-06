import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { BaseRepositoryInterface } from './base-repository.interface';

@Injectable()
export abstract class BaseRepository<T, CreateInput, UpdateInput, WhereInput, PrismaModel>
  implements BaseRepositoryInterface<T, CreateInput, UpdateInput, WhereInput> {
  
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly model: PrismaModel,
  ) {}

  // Abstract method to convert Prisma model to domain entity
  protected abstract toDomain(prismaModel: any): T;

  // Create operations
  async create(data: CreateInput): Promise<T> {
    const result = await (this.model as any).create({ data });
    return this.toDomain(result);
  }

  async createMany(data: CreateInput[]): Promise<{ count: number }> {
    return await (this.model as any).createMany({ data });
  }

  // Read operations
  async findById(id: string): Promise<T | null> {
    const result = await (this.model as any).findUnique({ where: { id } });
    return result ? this.toDomain(result) : null;
  }

  async findMany(filter?: WhereInput): Promise<T[]> {
    const results = await (this.model as any).findMany({ where: filter });
    return results.map(result => this.toDomain(result));
  }

  async findFirst(filter: WhereInput): Promise<T | null> {
    const result = await (this.model as any).findFirst({ where: filter });
    return result ? this.toDomain(result) : null;
  }

  async findUnique(filter: WhereInput): Promise<T | null> {
    const result = await (this.model as any).findUnique({ where: filter });
    return result ? this.toDomain(result) : null;
  }

  async count(filter?: WhereInput): Promise<number> {
    return await (this.model as any).count({ where: filter });
  }

  // Update operations
  async update(id: string, data: UpdateInput): Promise<T> {
    const result = await (this.model as any).update({ where: { id }, data });
    return this.toDomain(result);
  }

  async updateMany(filter: WhereInput, data: UpdateInput): Promise<{ count: number }> {
    return await (this.model as any).updateMany({ where: filter, data });
  }

  async upsert(where: WhereInput, create: CreateInput, update: UpdateInput): Promise<T> {
    const result = await (this.model as any).upsert({ where, create, update });
    return this.toDomain(result);
  }

  // Delete operations
  async delete(id: string): Promise<T> {
    const result = await (this.model as any).delete({ where: { id } });
    return this.toDomain(result);
  }

  async deleteMany(filter: WhereInput): Promise<{ count: number }> {
    return await (this.model as any).deleteMany({ where: filter });
  }

  // Pagination
  async findManyWithPagination(
    page: number,
    limit: number,
    filter?: WhereInput,
    orderBy?: any
  ): Promise<{ data: T[]; total: number; page: number; limit: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      (this.model as any).findMany({
        where: filter,
        skip,
        take: limit,
        orderBy,
      }),
      (this.model as any).count({ where: filter }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map(item => this.toDomain(item)),
      total,
      page,
      limit,
      totalPages,
    };
  }
}
