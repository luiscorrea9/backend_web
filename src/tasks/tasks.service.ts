import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongosse,{ Model, Types } from 'mongoose';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {

    constructor(@InjectModel(Task.name) private taskModel: Model<Task>){}


    finAll(){
        return this.taskModel.find();
    }

    async create(createTask: CreateTaskDto){
        try {
        const newTask = new this.taskModel({...createTask});
        await newTask.save();
        return {
            msg: 'Tarea creada correctamente!'
        }
        } catch (error) {
            throw new InternalServerErrorException('problema en la BD');
        }
        

    }

    async findOne(id: string){
        // const idUser= new Types.ObjectId(id);

        try {
            const task= this.taskModel.findById(id);
            if(!task ) throw new NotFoundException('no se encontro la tarea');
            return task;
        } catch (error) {
            throw new InternalServerErrorException('problema en la BD');
        }
        
    }
    
    async findTasksByEstatusId( id: string, estado: string ) {
        const idUser= new Types.ObjectId(id);
        let status: boolean=true;
        if(estado==='false'){status=false;}
        try {
            const tasks = await this.taskModel.find({ user:idUser, estado: status}).exec();
            
            if(!tasks ) throw new NotFoundException('no se encontro el usuario');
            
            return tasks;
        } catch (error) {
            throw new InternalServerErrorException('problema en la BD');
        }
      
      }

    async delete(id: string){
        return this.taskModel.findByIdAndDelete(id);    
    }

    async update(id: string, task: UpdateTaskDto){
        return this.taskModel.findByIdAndUpdate(id, task, {new: true});
    }
}
