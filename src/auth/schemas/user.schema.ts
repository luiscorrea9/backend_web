import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from './role.schema';

@Schema()
export class Usuario {

    _id?: string;

    @Prop({ unique: true, required: true })
    correo: string;

    @Prop({ required: true })
    nombre: string;

    @Prop({ required: true })
    cel: string;

    @Prop({ minlength: 6, required: true })
    password?: string;

    @Prop({ default: true })
    activo?: boolean;

    @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
    role?: Role;

}


export const UserSchema = SchemaFactory.createForClass( Usuario );
