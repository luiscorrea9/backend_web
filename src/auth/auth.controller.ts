import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from './decorators/ruta-publica.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/registro')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Public()
  @Post('/login')
  login( @Body() loginDto: LoginDto  ) {
    return this.authService.login( loginDto );
  }

  @Patch('/act/:id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateUserDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Patch(':id')
  removeLogic(@Param('id') id: string) {
    return this.authService.removeLogic(id);
  }
}
