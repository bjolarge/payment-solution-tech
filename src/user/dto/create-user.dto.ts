import {IsEmail, IsString, IsStrongPassword} from 'class-validator';
export class CreateUserDto {
    @IsString()
    //added the IsEmail decorator and IsStrongPassword decorator
    @IsEmail()
    email: string;
    @IsString()
    name: string;
    @IsString()
    @IsStrongPassword()
    password: string;
    // @IsString()
    // refreshToken: string;
}
