import { Controller, Get, Post, Body, Patch, Param, HttpCode, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Task')
@Controller('tasks')
export class TasksController {

    constructor(private tasksService: TasksService) { }


    @Get()
    findAll() {
        return this.tasksService.finAll();
    }


    @Get('/byStatusUser/:id/:estado')
    findByIdandStatus(@Param('id') id: string, @Param('estado') estado: string) {
          return this.tasksService.findTasksByEstatusId(id,estado); 
    }

    @Get('/:id')
    findById(@Param('id') id: string) {
          return this.tasksService.findOne(id); 
    }

    @Post('/postTask')
    create(@Body() body: CreateTaskDto) {
        return this.tasksService.create(body);
    }

    @Put('/putTask/:id')
    update(@Param('id') id: string, @Body() body: UpdateTaskDto){
        return this.tasksService.update(id,body);
    }

}
