import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({ name: 'user_followers' })
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];
}
