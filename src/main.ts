import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // await app.listen(3000);
  const configService: ConfigService = app.get(ConfigService);
  // // Enable CORS for all origins or specify the allowed origin
  // app.enableCors({
  //   origin: 'http://localhost:3000/', // Your local app URL or specific domains
  //   methods: 'GET,POST,PUT,DELETE,OPTIONS',
  //   allowedHeaders: 'Content-Type, Authorization',
  // });
  // // Enable CORS for all origins or specify the allowed origin
  // app.enableCors({
  //   origin: 'toptop.love', // Your local app URL or specific domains
  //   methods: 'GET,POST,PUT,DELETE,OPTIONS',
  //   allowedHeaders: 'Content-Type, Authorization',
  // });

  app.enableCors({
    origin: '*', // or the port where your frontend is running
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify other headers if needed
    credentials: true, // Include credentials if necessary
  });

  await app.listen(configService.get('port') || 3000);
}
bootstrap();
