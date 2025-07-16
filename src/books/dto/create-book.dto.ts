import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'My Book Title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Author Name' })
  @IsString()
  author: string;

  @ApiProperty({ example: 'A description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
