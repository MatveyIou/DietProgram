import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { LoginModule } from './login/login.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserStatsService } from './user/user-stats/user-stats.service';

// module is split by features 
// import is for linking other modules
// controller is the "meat" of the app. it get the incoming request and responds to those requests
// provider/service is for functions

//@ - decorator is a function
@Module({ // modules bundles these files
  //doesnt "imports" the files it just links them
  imports: [DatabaseModule ,LoginModule, UserModule, AuthModule,],
  controllers: [AppController],
  providers: [AppService, UserStatsService],
})
export class AppModule {}
