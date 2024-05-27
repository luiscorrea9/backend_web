import { Controller, Get, Post, Body, Patch, Param, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from './decorators/ruta-publica.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { Usuario } from './schemas/user.schema';
import { Auth } from './decorators/auth.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //rutas publicas
  @Public()
  @Post('/registro')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Public()
  @Post('/login')
  @HttpCode(200)
  login( @Body() loginDto: LoginDto  ) {
    return this.authService.login( loginDto );
  }

  //rutas privadas
  // @Auth()
  @Get('check-status')
  checkAuthStatus(@GetUser() user: Usuario) {
    return this.authService.checkAuthStatus( user );
  }

  @Patch('/act/:id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateUserDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Patch('/remove/:id')
  @HttpCode(200)
  removeLogic(@Param('id') id: string) {
    return this.authService.removeLogic(id);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

}
