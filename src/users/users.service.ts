import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Methods for user management will go here

  async findByUsernameOrEmail(username: string, email: string) {
    return this.usersRepository.findOne({
      where: [{ username }, { email }],
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async follow(followerId: number, followingId: number): Promise<void> {
    if (followerId === followingId)
      throw new Error('You cannot follow yourself');
    const follower = await this.usersRepository.findOne({
      where: { id: followerId },
      relations: ['following'],
    });
    const following = await this.usersRepository.findOne({
      where: { id: followingId },
      relations: ['followers'],
    });
    if (!follower || !following) throw new Error('User not found');
    if (follower.following.some((u) => u.id === followingId)) return; // already following
    follower.following.push(following);
    await this.usersRepository.save(follower);
  }

  async unfollow(followerId: number, followingId: number): Promise<void> {
    if (followerId === followingId)
      throw new Error('You cannot unfollow yourself');
    const follower = await this.usersRepository.findOne({
      where: { id: followerId },
      relations: ['following'],
    });
    if (!follower) throw new Error('User not found');
    follower.following = follower.following.filter((u) => u.id !== followingId);
    await this.usersRepository.save(follower);
  }

  async getFollowers(userId: number): Promise<User[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followers'],
    });
    if (!user) throw new Error('User not found');
    return user.followers;
  }

  async getFollowing(userId: number): Promise<User[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });
    if (!user) throw new Error('User not found');
    return user.following;
  }
}
