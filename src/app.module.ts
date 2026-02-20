import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // باعث می‌شود در تمام ماژول‌ها به env دسترسی داشته باشی
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
