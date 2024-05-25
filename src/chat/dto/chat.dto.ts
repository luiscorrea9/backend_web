import { IsInt, IsOptional, IsString } from 'class-validator';


export class ChatDto {
@IsString()
readonly prompt: string;

@IsInt()
@IsOptional()
readonly maxTokens?: number;
}