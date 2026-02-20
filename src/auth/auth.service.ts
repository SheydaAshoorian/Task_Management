import { Injectable, Logger, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto'; 
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto' ;
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

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
}