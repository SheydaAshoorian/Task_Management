import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService} from '@nestjs/config';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // فعال‌سازی قابلیت سریالایز کردن (حذف فیلدهای @Exclude)
  app.enableCors({
    origin: 'http://localhost:3000', // آدرس فرانت‌اِند 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }); 
  
  app.setGlobalPrefix('api/v1');  // ورژن‌بندی API
  app.useGlobalPipes(new ValidationPipe()); // فعال سازی validations
  app.useGlobalInterceptors(new TransformInterceptor());  //  اینترسپتور تغییر فرمت جواب


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
