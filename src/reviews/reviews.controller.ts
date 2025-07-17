import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthenticatedRequest } from '../users/authenticated-request.interface';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('books/:id/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'Get all reviews for a book' })
  @ApiResponse({ status: 200, description: 'List of reviews.' })
  @Get()
  findAll(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findByBook(id);
  }

  @ApiOperation({ summary: 'Get average rating for a book' })
  @ApiResponse({ status: 200, description: 'Average rating.' })
  @Get('average')
  getAverage(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.getAverageRating(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review for a book' })
  @ApiResponse({ status: 201, description: 'Review created.' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Omit<CreateReviewDto, 'bookId'>,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.reviewsService.create({ ...body, bookId: id }, req.user.userId);
  }
} 