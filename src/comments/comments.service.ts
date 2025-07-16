import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(
    bookId: number,
    { page, limit }: { page: number; limit: number },
  ) {
    const [data, total] = await this.commentsRepository.findAndCount({
      where: { book: { id: bookId } },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: data.map((comment) => instanceToPlain(comment)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const comment = await this.commentsRepository.findOneBy({ id });
    if (!comment) throw new NotFoundException('Comment not found');
    return instanceToPlain(comment);
  }

  async create(data: { content: string; bookId: number; userId: number }) {
    const book = await this.booksRepository.findOneBy({ id: data.bookId });
    if (!book) throw new NotFoundException('Book not found');
    const user = await this.usersRepository.findOneBy({ id: data.userId });
    if (!user) throw new NotFoundException('User not found');
    const comment = this.commentsRepository.create({
      content: data.content,
      book,
      user,
    });
    const saved = await this.commentsRepository.save(comment);
    return instanceToPlain(saved);
  }

  async remove(id: number): Promise<void> {
    await this.commentsRepository.delete(id);
  }
}
