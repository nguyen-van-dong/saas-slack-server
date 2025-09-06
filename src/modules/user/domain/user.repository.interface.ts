import { User } from "./user.entity";

export interface UserRepositoryInterface {
  create(user: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findOneBy(filter: Partial<User>): Promise<User | null>;
}
