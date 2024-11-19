import { ItemsModule } from './items/items.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerService } from './logger/logger.service';
import configuration from './config/configuration';
import { CommentsModule } from './comments/comments.module';
import { JobsModule } from './jobs/jobs.module';
import { RepliesModule } from './replies/replies.module';
import { UsersModule } from './Users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ItemsModule,
    CommentsModule,
    JobsModule,
    RepliesModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `${configService.get('database.uri')}`,
        tls: true,
      }),
      inject: [ConfigService],
    }),
    // MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  controllers: [],
  providers: [LoggerService],
})
export class AppModule {}
