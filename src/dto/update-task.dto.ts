import { IsBoolean, IsString, IsOptional } from 'class-validator';


export class UpdateTaskDto{
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    done?: boolean;
}