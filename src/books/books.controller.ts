import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../users/authenticated-request.interface';
import { CreateBookDto } from './dto/create-book.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { BookResponseDto } from './dto/book-response.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: 'Get a paginated list of books' })
  @ApiResponse({
    status: 200,
    description: 'List of books returned.',
    type: [BookResponseDto],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by title or author',
  })
  @ApiQuery({
    name: 'genre',
    required: false,
    description: 'Filter by genre',
  })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('genre') genre?: string,
  ) {
    return this.booksService.findAll({ page, limit, search, genre });
  }

  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiResponse({
    status: 200,
    description: 'Book found.',
    type: BookResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({
    status: 201,
    description: 'Book created successfully.',
    type: BookResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateBookDto, @Req() req: AuthenticatedRequest) {
    return this.booksService.create({ ...body, createdBy: req.user.userId });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a book' })
  @ApiResponse({
    status: 200,
    description: 'Book updated successfully.',
    type: BookResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<CreateBookDto>,
  ) {
    return this.booksService.update(id, body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a book' })
  @ApiResponse({ status: 200, description: 'Book deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}
