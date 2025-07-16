import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'testuser' })
  @IsString()
  readonly username: string;

  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
