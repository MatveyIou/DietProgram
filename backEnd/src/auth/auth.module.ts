import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';

import { UserModule } from 'src/user/user.module';

@Module({
  imports:[
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10000s' },
  }),
  
  ],
  providers: [AuthService,LocalStrategy,JwtStrategy],
  exports: [AuthService] // should be used in login(to create a user)

})
export class AuthModule {}
