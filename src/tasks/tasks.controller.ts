import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Delete,
    Body, 
    Param, 
    ConflictException, 
    NotFoundException, 
    HttpCode } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Controller('tasks')
export class TasksController {

    constructor(private tasksService: TasksService) { }


    @Get()
    findAll() {
        return this.tasksService.finAll();
    }


    @Get(':id')
    async findOne(@Param('id') id: string) {
        try {
            const task = await this.tasksService.findOne(id);
            if (!task) {
                throw new NotFoundException('Task not found');
            }
            return task;
        } catch (error) {
            throw new NotFoundException('Invalid task ID');
        }
    }


    @Post()
    async create(@Body() body: CreateTaskDto) {
        try {
            return await this.tasksService.create(body);
        } catch (error) {
            if (error.code == 11000) {
                throw new ConflictException("Task already exists")
            }
            throw error;
        }
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        try {
            const task = await this.tasksService.delete(id);
            if (!task) {
                throw new NotFoundException('Task not found');
            }
            return task;
        } catch (error) {
            throw new NotFoundException('Invalid task ID');
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UpdateTaskDto) {
    try {
        const task = await this.tasksService.update(id, body);
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        return task;
    } catch (error) {
        throw new NotFoundException('Invalid task ID or same title');
    }

    }


}
