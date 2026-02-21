import { Injectable, ConflictException, NotFoundException,Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  private readonly logger = new Logger(UsersService.name);

  constructor(

    @InjectRepository(User)
    private userRepository: Repository<User>,
    
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByEmail(email: string): Promise<User | null> {
  return this.userRepository.findOne({
    where: { email },
    select: ['id', 'email', 'password', 'role', 'first_name', 'last_name'], 
  });
}


  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
