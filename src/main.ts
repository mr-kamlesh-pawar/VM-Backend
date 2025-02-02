import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as dotenv from 'dotenv';

dotenv.config();  // Load environment variables

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation for all DTOs
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transform payloads to DTO instances
    whitelist: true, // Strip properties that are not part of the DTO
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
  }));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
