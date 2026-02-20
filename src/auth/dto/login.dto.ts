import { IsEmail, IsNotEmpty,password,MinLength,IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger' ;


export class LoginDto {

    @ApiProperty( {example: 'example@gmail.com'} )
    @IsEmail({} , { message: 'ایمیل وارد شده معتبر نیست'} )
    email: string ;
    
    @ApiProperty( {example: 'password123'} )
    @IsNotEmpty( { message: ' پسوورد نمیتواند خالی باشد'} )
    @MinLength(6)
    @IsString()
    password: string ;

}