import { IsArray, IsBoolean, IsEmail, IsMongoId, IsString, MinLength} from 'class-validator';



export class CreateUserDto {

    @IsEmail()
    correo: string;

    @IsString()
    nombre: string;

    @IsString()
    @MinLength(10)
    cel: string;

    @IsString()
    @MinLength(6)
    password: string;

    // @IsBoolean()
    activo?: boolean;

    @IsMongoId()
    role: string;

}
