import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from './schemas/user.schema';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interfaces/login-response';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel( Usuario.name ) 
    private userModel: Model<Usuario>,
    private jwtService: JwtService,
  ){}


  async create(createUserDto: CreateUserDto): Promise<LoginResponse> {
    
    try {
      
      const { password, ...userData } = createUserDto;
           
      const newUser = new this.userModel({
        password: bcrypt.hashSync( password, 10 ),
        ...userData
      });

       await newUser.save();
       const { password:_, ...user } = newUser.toJSON();
       
       return {
        user: user,
        token: this.getJwtToken({ id: user._id })
      }
      
    } catch (error) {
      // Logger.log(error);
      if( error.code === 11000 ) {
        throw new BadRequestException(`el usuario ${ createUserDto.correo } ya existe`)
      }
      throw new InternalServerErrorException('problema en la BD');
    }

  }

  findAll(): Promise<Usuario[]> {
    return this.userModel.find();
  }

  async login( loginDto: LoginDto ):Promise<LoginResponse> {

    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if ( !user ) {
      throw new UnauthorizedException('Credenciales no validas');
    }
    
    if ( !bcrypt.compareSync( password, user.password ) ) {
      throw new UnauthorizedException('Credenciales no validas');
    }

    const { password:_, ...rest  } = user.toJSON();

      
    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    }
  
  }

  async findUserById( id: string ) {
    const user = await this.userModel.findById( id );
    if(!user) throw new NotFoundException('Usuario no existe');
    const { password, ...rest } = user.toJSON();
    return rest;
  }

 

  async update(id: string, updateUSerDto: UpdateUserDto) {
   this.findUserById(id);
    try {
      
      const {password} = updateUSerDto;

      if(password){
        const salt = bcrypt.genSaltSync();
        updateUSerDto.password= bcrypt.hashSync(password, salt);
      }
      
      const user = await this.userModel.findByIdAndUpdate(id,updateUSerDto);

      return {
        msg: `el Usuario ${user.correo} se ha actualizado correctamente`,
        data: user
      }
    } catch (error) {
      throw new InternalServerErrorException('problema en la BD');
    }
  }

  async removeLogic(id: string) {
    // const user = this.findUserById(id);
    try {
      const user= await this.userModel.findByIdAndUpdate(id,{activo: false});
      if(!user) throw new NotFoundException('Usuario no existe');
      return {
        msg: "se ha eliminado correctamente!"
      }
    } catch (error) {
      throw new InternalServerErrorException('Problema en BD')
    }
    
  }

  private getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign( payload );
    return token;

  }
}
