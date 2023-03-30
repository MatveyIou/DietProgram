import { Module } from '@nestjs/common';
import { UserService } from './user.service';

import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './dto/user.dto';
import { userDataSchema } from './dto/user-data.dto';

@Module({
  imports:[
    MongooseModule.forFeature([{name: 'User',schema: userSchema}]),
    MongooseModule.forFeature([{name: 'Data',schema: userDataSchema}]),
  ],
  
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
