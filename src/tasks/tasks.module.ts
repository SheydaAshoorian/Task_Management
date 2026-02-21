import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from  '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User]),
      AuthModule,
],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
