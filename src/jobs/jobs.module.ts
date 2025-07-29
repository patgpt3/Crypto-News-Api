import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema } from './schemas/job.schema';
import { LoggerService } from 'src/logger/logger.service';
import { UsersModule } from 'src/Users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
    UsersModule, // Import UsersModule instead of directly providing UsersService
  ],
  controllers: [JobsController],
  providers: [JobsService, LoggerService],
})
export class JobsModule {}
