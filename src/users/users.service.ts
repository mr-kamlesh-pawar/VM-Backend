import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,  // Inject UserRepository
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['role'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['role'] });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  }
  

  async create(user: Partial<User>): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() }, // Convert email to lowercase
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  

    // Add the updatePassword method
    async updatePassword(email: string, newPassword: string): Promise<User> {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }
      user.password = newPassword; // Update the password
      return this.usersRepository.save(user); // Save the updated user
    }
}
