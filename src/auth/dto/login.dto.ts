import { IsEmail, MinLength } from 'class-validator';



export class LoginDto {

    @IsEmail()
    correo: string;

    @MinLength(6)
    password: string;

}