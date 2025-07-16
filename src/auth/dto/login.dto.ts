import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'testuser or test@example.com' })
  @IsString()
  readonly usernameOrEmail: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  readonly password: string;
}
