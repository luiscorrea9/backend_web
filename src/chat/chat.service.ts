import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import { generateContent } from './use-cases';


@Injectable()
export class ChatService {

async chatGeminiAi(chatDto: ChatDto){
    return await generateContent({
        prompt: chatDto.prompt
    });
}

}
