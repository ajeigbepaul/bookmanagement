import { ApiProperty } from '@nestjs/swagger';
import { BookResponseDto } from '../../books/dto/book-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class CommentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Great book!' })
  content: string;

  @ApiProperty({ type: BookResponseDto })
  book: BookResponseDto;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ example: '2025-07-16T07:03:48.334Z' })
  createdAt: string;
}
