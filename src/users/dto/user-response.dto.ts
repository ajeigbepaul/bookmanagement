import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'testuser' })
  username: string;

  @ApiProperty({ example: 'test@example.com' })
  email: string;
}
