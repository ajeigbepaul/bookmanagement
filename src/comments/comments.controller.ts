import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { AuthenticatedRequest } from '../users/authenticated-request.interface';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CommentResponseDto } from './dto/comment-response.dto';

@ApiTags('comments')
@Controller()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  @ApiOperation({ summary: 'Get a paginated list of comments for a book' })
  @ApiResponse({
    status: 200,
    description: 'List of comments returned.',
    type: [CommentResponseDto],
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
  @Get('books/:id/comments')
  findAll(
    @Param('id', ParseIntPipe) bookId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.commentsService.findAll(bookId, { page, limit });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new comment for a book' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully.',
    type: CommentResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('books/:id/comments')
  create(
    @Param('id', ParseIntPipe) bookId: number,
    @Body() body: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.commentsService.create({
      ...body,
      bookId: bookId,
      userId: req.user.userId,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully.' })
  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}
