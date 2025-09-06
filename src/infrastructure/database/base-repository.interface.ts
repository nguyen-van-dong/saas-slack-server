export interface BaseRepositoryInterface<T, CreateInput, UpdateInput, WhereInput> {
  // Create operations
  create(data: CreateInput): Promise<T>;
  createMany(data: CreateInput[]): Promise<{ count: number }>;

  // Read operations
  findById(id: string): Promise<T | null>;
  findMany(filter?: WhereInput): Promise<T[]>;
  findFirst(filter: WhereInput): Promise<T | null>;
  findUnique(filter: WhereInput): Promise<T | null>;
  count(filter?: WhereInput): Promise<number>;

  // Update operations
  update(id: string, data: UpdateInput): Promise<T>;
  updateMany(filter: WhereInput, data: UpdateInput): Promise<{ count: number }>;
  upsert(where: WhereInput, create: CreateInput, update: UpdateInput): Promise<T>;

  // Delete operations
  delete(id: string): Promise<T>;
  deleteMany(filter: WhereInput): Promise<{ count: number }>;

  // Pagination
  findManyWithPagination(
    page: number,
    limit: number,
    filter?: WhereInput,
    orderBy?: any
  ): Promise<{ data: T[]; total: number; page: number; limit: number; totalPages: number }>;
}
