import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema } from './schemas/job.schema';
import { LoggerService } from 'src/logger/logger.service';
import { UsersService } from 'src/Users/users.service';
import { UserSchema } from 'src/Users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [JobsController],
  providers: [JobsService, LoggerService, UsersService],
})
export class JobsModule {}
