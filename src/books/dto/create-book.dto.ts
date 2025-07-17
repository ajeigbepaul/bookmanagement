import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'My Book Title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Author Name' })
  @IsString()
  author: string;

  @ApiProperty({ example: 'fiction', description: 'Book genre' })
  @IsString()
  genre: string;

  @ApiProperty({ example: 'A description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/cover.jpg',
    required: false,
    description: 'URL of the book cover image',
  })
  @IsOptional()
  @IsString()
  coverImageUrl?: string;
}
