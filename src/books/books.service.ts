import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async findAll({ page, limit }: { page: number; limit: number }) {
    const [data, total] = await this.booksRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: data.map((book) => instanceToPlain(book)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const book = await this.booksRepository.findOneBy({ id });
    if (!book) throw new NotFoundException('Book not found');
    return instanceToPlain(book);
  }

  async create(data: Partial<Book>) {
    const book = this.booksRepository.create(data);
    const saved = await this.booksRepository.save(book);
    return instanceToPlain(saved);
  }

  async update(id: number, data: Partial<Book>) {
    const book = await this.booksRepository.findOneBy({ id });
    if (!book) throw new NotFoundException('Book not found');
    Object.assign(book, data);
    const saved = await this.booksRepository.save(book);
    return instanceToPlain(saved);
  }

  async remove(id: number): Promise<void> {
    await this.booksRepository.delete(id);
  }
}
