import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { instanceToPlain } from 'class-transformer';
import { Cache } from 'cache-manager';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAll({ page, limit }: { page: number; limit: number }) {
    const cacheKey = `books:page:${page}:limit:${limit}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const [data, total] = await this.booksRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    const result = {
      data: data.map((book) => instanceToPlain(book)),
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
    await this.booksRepository.delete(id);
    if (typeof (this.cacheManager as any).reset === 'function') {
      await (this.cacheManager as any).reset();
    }
  }
}
