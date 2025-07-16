import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class BookResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'My Book Title' })
  title: string;

  @ApiProperty({ example: 'Author Name' })
  author: string;

  @ApiProperty({ example: 'A description', required: false })
  description?: string;

  @ApiProperty({ type: UserResponseDto })
  createdBy: UserResponseDto;

  @ApiProperty({ example: '2025-07-16T07:03:48.334Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-07-16T07:03:48.334Z' })
  updatedAt: string;
}
