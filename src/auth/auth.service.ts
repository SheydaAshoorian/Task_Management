import { Injectable, Logger, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto'; 
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto' ;
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
  ) {}

    async login(dto: LoginDto) {

        const user = await this.usersService.findOneByEmail(dto.email);

        if (!user) {

            console.log('DB user:', user);  
            throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است');
         }

        const saltOrRounds = 10;
        const manualHash = await bcrypt.hash('12345678', saltOrRounds);

        const isMatch = await bcrypt.compare(dto.password,  user.password)

        if (!isMatch) {

            throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };

    return {
        message: 'خوش آمدید! ورود با موفقیت انجام شد',
        access_token: await this.jwtService.signAsync(payload),
        user: {
        id: user.id,
        first_name: user.first_name,
        last_family: user.last_name,
        email: user.email,
        role: user.role
        }
    };
    }


    async register(createUserDto: CreateUserDto) {

    const { email, password, first_name, last_name} = createUserDto;

    // ۱. چک کردن تکراری نبودن کاربر
    const existingUser = await this.userRepository.findOne({ where: { email } });
    
    if (existingUser) {
      throw new BadRequestException('این ایمیل قبلاً ثبت شده است');
    }

    try{
        // ۲. هش کردن پسورد
        const hashedPassword = await bcrypt.hash(password, 10);

        // ۳. ذخیره در دیتابیس
        const user = this.userRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        });

        await this.userRepository.save(user);

        // ۴. برگرداندن دیتای کاربر (بدون پسورد)
        delete user.password;
        return {
        message: 'ثبت‌نام با موفقیت انجام شد',
        user,
        };

    } catch (error) {
        
      this.logger.error(`خطا در هنگام ذخیره‌سازی کاربر: ${error.message}`);
      throw new BadRequestException('خطایی در فرآیند ثبت‌نام رخ داد');
    }
  }
}