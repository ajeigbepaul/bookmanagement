import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: number) {
    const book = await this.booksRepository.findOneBy({
      id: createReviewDto.bookId,
    });
    if (!book) throw new NotFoundException('Book not found');
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    const review = this.reviewsRepository.create({
      content: createReviewDto.content,
      rating: createReviewDto.rating,
      book,
      user,
    });
    return this.reviewsRepository.save(review);
  }

  async findByBook(bookId: number) {
    return this.reviewsRepository.find({
      where: { book: { id: bookId } },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async getAverageRating(bookId: number): Promise<number> {
    const reviews = await this.reviewsRepository.find({
      where: { book: { id: bookId } },
    });
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  }
}
