import { Injectable } from '@nestjs/common';
import {VertexAI} from '@google-cloud/vertexai';
import { ChatDto } from './dto/chat.dto';
import { generateContent } from './use-cases';


@Injectable()
export class ChatService {
    private vertexai = new VertexAI({
        project: process.env.GEMINI_PROJECT, 
        location: process.env.GEMINI_LOCATION
    });

    private model = process.env.GEMINI_MODEL;

async chatGeminiAi(chatDto: ChatDto){
    return await generateContent(this.vertexai,{
        model: this.model,
        prompt: chatDto.prompt
    });
}

}
