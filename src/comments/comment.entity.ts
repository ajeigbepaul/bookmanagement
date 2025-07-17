import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Book, { eager: true, onDelete: 'CASCADE' })
  book: Book;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
