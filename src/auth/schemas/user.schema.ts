import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Usuario {

    _id?: string;

    @Prop({ unique: true, required: true })
    correo: string;

    @Prop({ required: true })
    nombre: string;

    @Prop({ minlength: 6, required: true })
    password?: string;

    @Prop({ default: true })
    activo: boolean;

    @Prop({ type: [String], default: ['user'] })
    roles: string[];

}


export const UserSchema = SchemaFactory.createForClass( Usuario );
