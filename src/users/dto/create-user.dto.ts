import { IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'


export class CreateUserDto {

    @IsNotEmpty()
    @ApiProperty()
    first_name: string;

    @IsNotEmpty()
    @ApiProperty()
    last_name: string;


    @ApiProperty({ example: 'sheyda@example.com', description: 'ایمیل منحصر به فرد' })
    @IsEmail({}, { message: 'فرمت ایمیل صحیح نیست' })
    email: string;

    @ApiProperty({ example: 'password123', description: 'رمز عبور حداقل ۶ کاراکتر' })
    @IsString()
    @MinLength(6, { message: 'رمز عبور باید حداقل ۶  کاراکتر باشد' })
    password: string;
 

}
