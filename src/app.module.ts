import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ReportsModule } from './reports/reports.module';



@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot(process.env.MONGO_URI),
    TasksModule,
    AuthModule,
    ChatModule,
    ReportsModule,
  ],
})
export class AppModule {}
