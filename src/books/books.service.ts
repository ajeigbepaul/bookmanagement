import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { instanceToPlain } from 'class-transformer';
import { Cache } from 'cache-manager';
import { Comment } from '../comments/comment.entity';
import { User } from '../users/user.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAll({
    page,
    limit,
    search,
    genre,
  }: {
    page: number;
    limit: number;
    search?: string;
    genre?: string;
  }) {
    const cacheKey = `books:page:${page}:limit:${limit}:search:${search || ''}:genre:${genre || ''}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    // Build dynamic where clause
    const where: any = {};
    if (search) {
      where['title'] = () => `LOWER(title) LIKE '%${search.toLowerCase()}%'`;
      where['author'] = () => `LOWER(author) LIKE '%${search.toLowerCase()}%'`;
    }
    if (genre) {
      where['genre'] = genre;
    }

    // Use QueryBuilder for flexible search (title or author)
    const qb = this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.createdBy', 'createdBy')
      .orderBy('book.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.andWhere(
        '(LOWER(book.title) LIKE :search OR LOWER(book.author) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }
    if (genre) {
      qb.andWhere('book.genre = :genre', { genre });
    }

    const [data, total] = await qb.getManyAndCount();

    // For each book, get commentsCount, followersCount, followingCount
    const booksWithCounts = await Promise.all(
      data.map(async (book) => {
        const commentsCount = await this.commentsRepository.count({
          where: { book: { id: book.id } },
        });
        let followersCount = 0;
        let followingCount = 0;
        if (book.createdBy?.id) {
          const author = await this.usersRepository.findOne({
            where: { id: book.createdBy.id },
            relations: ['followers', 'following'],
          });
          followersCount = author?.followers?.length || 0;
          followingCount = author?.following?.length || 0;
        }
        return {
          ...instanceToPlain(book),
          commentsCount,
          followersCount,
          followingCount,
        };
      }),
    );

    const result = {
      data: booksWithCounts,
      total,
      page,
      limit,
    };
    await this.cacheManager.set(cacheKey, result, 60);
    return result;
  }

  async findOne(id: number) {
    const cacheKey = `book:${id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const book = await this.booksRepository.findOneBy({ id });
    if (!book) throw new NotFoundException('Book not found');
    const result = instanceToPlain(book);
    await this.cacheManager.set(cacheKey, result, 60);
    return result;
  }

  async create(data: Partial<Book>) {
    const book = this.booksRepository.create(data);
    const saved = await this.booksRepository.save(book);
    if (typeof (this.cacheManager as any).reset === 'function') {
      await (this.cacheManager as any).reset();
    }
    return instanceToPlain(saved);
  }

  async update(id: number, data: Partial<Book>) {
    const book = await this.booksRepository.findOneBy({ id });
    if (!book) throw new NotFoundException('Book not found');
    Object.assign(book, data);
    const saved = await this.booksRepository.save(book);
    if (typeof (this.cacheManager as any).reset === 'function') {
      await (this.cacheManager as any).reset();
    }
    return instanceToPlain(saved);
  }

  async remove(id: number): Promise<void> {
    // Delete all comments for this book first (in case cascade is not yet active)
    await this.commentsRepository.delete({ book: { id } });
    await this.booksRepository.delete(id);
    if (typeof (this.cacheManager as any).reset === 'function') {
      await (this.cacheManager as any).reset();
    }
  }
}
