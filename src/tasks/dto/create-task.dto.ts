import { IsBoolean, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateTaskDto{
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    done?: boolean;
}