import { IsBoolean, IsString, IsOptional, IsNotEmpty, IsMongoId, IsDate, IsArray, IsDateString } from 'class-validator';

export class CreateTaskDto{
    @IsNotEmpty()
    @IsString()
    titulo: string;

    @IsString()
    descripcion: string;

    @IsNotEmpty()
    @IsString()
    direccion: string;

    @IsOptional()
    @IsBoolean()
    estado?: boolean;

    @IsDateString()
    fechaInicio: Date;

    @IsOptional()
    @IsDateString()
    fechaFin?: Date

    @IsOptional()
    @IsString()
    comentarios?: string;

    @IsOptional()
    @IsArray()
    evidencia?: string[];
    
    @IsMongoId()
    user: string;
    
    @IsMongoId()
    userCreate: string;
}