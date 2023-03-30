import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:h3XXvRvGvBn2Taf2@cluster0.badhe.mongodb.net/?retryWrites=true&w=majority',
    ),
  ],
})
export class DatabaseModule {}
