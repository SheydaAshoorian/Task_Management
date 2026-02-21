import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService} from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder} from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enableCors(); // برای اینکه فرانت‌اِند بتونه بهش وصل شه
  app.setGlobalPrefix('api/v1');  // ورژن‌بندی API
  app.useGlobalPipes(new ValidationPipe()); // فعال سازی validations

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001 ;


  //***************.  پیکربندی Swagger ****************** */
  
  const config = new DocumentBuilder()
    .setTitle('Todo App API')
    .setDescription('The Todo Application API description')
    .setVersion('1.0')
    .addBearerAuth() // اضافه کردن دکمه Authorize برای توکن JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  //  مسیر دسترسی به داکیومنت
  SwaggerModule.setup('api/docs', app, document);

  //************************************** */

  await app.listen(port);

  console.log(`Server is running on: http://localhost:${port}/api/v1`);

}

bootstrap();
