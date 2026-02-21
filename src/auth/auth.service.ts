import { Injectable, Logger, BadRequestException, ConflictException,
     UnauthorizedException , forwardRef, Inject} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto' ;
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';



@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);


    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject(forwardRef(() => UsersService)) 
        private usersService: UsersService, 
        private jwtService: JwtService,


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
        data: {
        access_token: await this.jwtService.signAsync(payload),
        user: user
        }
    };
    }


    async register(createUserDto: CreateUserDto) {

    const { email, password, first_name, last_name} = createUserDto;

    // ۱. چک کردن تکراری نبودن کاربر
    const existingUser = await this.userRepository.findOne({ where: { email } });
    console.log('Checking for email:', email);

    if (existingUser) {
        console.log('User found in DB:', existingUser);
        throw new BadRequestException('این ایمیل قبلاً ثبت شده است');
    }

    try{
        // ۲. هش کردن پسورد
        const hashedPassword = await bcrypt.hash(password, 10);

        // ۳. ذخیره در دیتابیس
        const user = this.userRepository.create({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        });

        await this.userRepository.save(user);
        console.log('User saved successfully:', user);

        // ۴. برگرداندن دیتای کاربر (بدون پسورد)
        const { password: _, ...userWithoutPassword } = user;

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