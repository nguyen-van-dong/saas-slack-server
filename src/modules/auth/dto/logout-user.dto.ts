import { IsNotEmpty } from 'class-validator';

export class LogoutUserDto {
  @IsNotEmpty()
  token: string;
}
