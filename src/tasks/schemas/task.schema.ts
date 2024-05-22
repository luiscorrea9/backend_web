import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Usuario } from 'src/auth/schemas/user.schema';


@Schema()
export class Task{

    _id?: string;

    @Prop({ required: true})
    titulo: string;

    @Prop({required: true})
    descripcion: string;

    @Prop({required: true})
    direccion: string;

    @Prop({default: true})
    estado: boolean;

    @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
    user: Usuario

    @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
    userCreate: Usuario

    @Prop({default: new Date().getDate()})
    fechaInicio: Date

    @Prop()
    fechaFin?: Date

    comentarios?: string;
    
    @Prop({ type: [String]})
    evidencia?: string[];


}

export const TaskSchema = SchemaFactory.createForClass(Task);