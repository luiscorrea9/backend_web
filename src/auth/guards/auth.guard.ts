import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { IS_PUBLIC_KEY } from '../decorators/ruta-publica.decorator';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private authService:AuthService,
    private reflector: Reflector
  ) {}


  async canActivate( context: ExecutionContext ): Promise<boolean>{
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No se encontro un Token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token, { secret: process.env.JWT_SECRET}
      );
        
      const user = await this.authService.findUserById( payload.id );
      if ( !user ) throw new UnauthorizedException('Usuario no existe');
      if ( !user.activo ) throw new UnauthorizedException('Usuario no se encuentra activo, hable con el Admin');
      
      request['user'] = user;
      
    } catch (error) {
      throw new UnauthorizedException();
    }
   

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
