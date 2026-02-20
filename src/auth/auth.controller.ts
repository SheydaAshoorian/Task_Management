import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth') // دسته‌بندی در سواگر
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user and return JWT token' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }


@Post('register')
@ApiOperation({ summary: 'ثبت نام کاربر جدید' })
async register(@Body() createUserDto: CreateUserDto) {
  return this.authService.register(createUserDto);
}
}