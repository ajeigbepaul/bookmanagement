import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';
import { IsInt, Min, Max, IsString } from 'class-validator';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  content: string;

  @Column()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ManyToOne(() => Book, (book) => book.reviews, { onDelete: 'CASCADE' })
  book: Book;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
