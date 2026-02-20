import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService} from '@nestjs/config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enablrCors(); // برای اینکه فرانت‌اِند بتونه بهش وصل شه
  app.setGlobalPefix('api/v1');  // ورژن‌بندی API

  const configService = ConfigService.get(ConfigService);
  const port = configService.get(PORT) || 3001 ;

  await app.listen(PORT);

  console.log(`Server is running on: http://localhost:${port}/api/v1`);

}

bootstrap();
