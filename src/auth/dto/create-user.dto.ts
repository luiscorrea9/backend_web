import { IsArray, IsBoolean, IsEmail, IsString, MinLength} from 'class-validator';



export class CreateUserDto {

    @IsEmail()
    correo: string;

    @IsString()
    nombre: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsBoolean()
    activo?: boolean;

    @IsArray()
    roles?: string[];

}
