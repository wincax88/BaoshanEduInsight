import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            realName: any;
            email: any;
            avatar: any;
            roles: any;
            school: any;
        };
    }>;
    getProfile(req: {
        user: {
            sub: string;
        };
    }): Promise<import("../users/entities/user.entity").User>;
}
