
import { Injectable } from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneUserByEmail(email);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const userId= (await this.usersService.findOneUserByEmail(user.email)).id;
        const payload = { email: user.email, sub: userId };
        console.log("auth "+user.email+". token: "+ this.jwtService.sign(payload))
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
