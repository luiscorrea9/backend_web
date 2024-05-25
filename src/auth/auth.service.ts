import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as twilio from 'twilio';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from './schemas/user.schema';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interfaces/login-response';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Role } from './schemas/role.schema';

@Injectable()
export class AuthService {
  private readonly client: twilio.Twilio;
  constructor(
    @InjectModel( Usuario.name )
    private userModel: Model<Usuario>,
    @InjectModel(Role.name) 
    private roleModel: Model<Role>,
    private jwtService: JwtService,
    private mailerService: MailerService
  ){
  
    this.client=  twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);
    
  }


  async create(createUserDto: CreateUserDto): Promise<LoginResponse> {
    
    try {
      
      const { password, ...userData } = createUserDto;
           
      const newUser = new this.userModel({
        password: bcrypt.hashSync( password, 10 ),
        ...userData
      });

       await newUser.save();
       const { password:_, ...user } = newUser.toJSON();
       
       //envio correo
       await this.sendUserConfirmation(createUserDto);
       return {
        user: user,
        token: this.getJwtToken({ id: user._id })
      }
      
    } catch (error) {
      
      if( error.code === 11000 ) {
        throw new BadRequestException(`el usuario ${ createUserDto.correo } ya existe`)
      }
      throw new InternalServerErrorException('problema en la BD');
    }

  }

  async sendUserConfirmation(createUserDto: CreateUserDto) {
    
    await this.mailerService.sendMail({
      to: createUserDto.correo,
      subject: 'Welcome to Tasks App!',
      template: './welcome',
      context: {
        name: createUserDto.nombre,
        
      },
    });
  }

  async createSMS(user: string, cel: string){
    const currentTime: Date = new Date();
   await this.client.messages
  .create({
     body: `Tasks: ${user} ingresaste a la app exitosamente! ${currentTime.toLocaleDateString()} a las ${currentTime.toLocaleTimeString()} Si no fuiste tu comunicate con el Admin.`,
     from: process.env.TWILIO_NUM,
     to: '+57'+cel
   })
  .then(message => console.log(message.sid));
  }

  findAll(): Promise<Usuario[]> {
    return this.userModel.find();
  }

  async login( loginDto: LoginDto ):Promise<LoginResponse> {

    const { correo, password } = loginDto;

    const user = await this.userModel.findOne({ correo });
    
    if ( !user ) {
      throw new UnauthorizedException('Credenciales no validas');
    }
    
    if ( !bcrypt.compareSync( password, user.password ) ) {
      throw new UnauthorizedException('Credenciales no validas');
    }

    if(!user.activo) throw new UnauthorizedException('Su cuenta no se encuentra activa.');

    const rol = await this.roleModel.findById(user.role);

    const { password:_,role, ...rest  } = user.toJSON();
    
    //envio sms
    // this.createSMS(user.nombre, user.cel);
      
    return {
      user: rest,
      role: rol.rol,
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
    
    try {
      const user= await this.userModel.findByIdAndUpdate(id,{activo: false});
      if(!user) throw new NotFoundException('Usuario no existe');
      return {
        msg: "se ha desactivado la cuenta correctamente!"
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
