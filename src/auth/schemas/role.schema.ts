import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Role {

    _id?: string;

    @Prop({ unique: true, required: true })
    rol: string;


}


export const RoleSchema = SchemaFactory.createForClass( Role );
