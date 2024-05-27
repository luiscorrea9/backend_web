import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrinterModule } from './printer/printer.module';
import { TasksModule } from '../tasks/tasks.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [PrinterModule, TasksModule, AuthModule],
  exports: [ReportsService]
})
export class ReportsModule {}
