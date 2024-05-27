import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Chat Gemini Ai')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  
  @Post('/GeminiAi')
  orthographyCheck(@Body() chatDto: ChatDto) {
    return this.chatService.chatGeminiAi(chatDto);
  }
}
