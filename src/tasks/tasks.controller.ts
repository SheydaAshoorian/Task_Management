import { Controller, Get, Post, Body, UseGuards, Req, Patch,Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // گارد خودت را ایمپورت کن
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Tasks')
@ApiBearerAuth() // این برای نمایش آیکون قفل در سواگر است
@UseGuards(JwtAuthGuard) 
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  // @Req (که اطلاعات کاربر لاگین شده هست و از توکن استخراج شده)
  //@Body (که عنوان و توضیحات تسک هست و کاربر می‌فرسته)
  create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    //  (آیدی منحصر‌به‌فرد کاربر که از توکن گرفته می شود )req.user.sub
    return this.tasksService.create(createTaskDto, req.user.sub);  
  }

  @Get()
  findAll(@Req() req) {
    return this.tasksService.findUserAllTasks(req.user.sub);
  }

  // src/tasks/tasks.controller.ts

@Patch(':id')
update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req) {
  return this.tasksService.update(+id, updateTaskDto, req.user.sub);
}
}