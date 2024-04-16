
import { Usuario } from '../schemas/user.schema';



export interface LoginResponse {
    user: Usuario;
    token: string;
}