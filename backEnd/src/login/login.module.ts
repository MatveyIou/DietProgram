import { Module } from '@nestjs/common';


import { LoginService } from './login.service';
import { LoginController } from './login.controller';

import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule,AuthModule],
  controllers: [LoginController],
  providers: [LoginService,JwtService],
  //exports:[LoginService], // should only be used in AuthService
})
export class LoginModule {}
