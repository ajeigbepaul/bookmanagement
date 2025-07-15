import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  readonly usernameOrEmail: string;

  @IsString()
  readonly password: string;
}
