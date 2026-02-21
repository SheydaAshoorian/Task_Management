import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  // ایجاد تسک برای کاربر خاص
async create(createTaskDto: CreateTaskDto, creatorId: number) {
  const newTask = this.tasksRepository.create({
    ...createTaskDto,
    createdById: creatorId, // کی ساخته؟ کسی که لاگین کرده
    assignedToId: createTaskDto.assignedToId || creatorId, // اگر کسی رو انتخاب نکرد، خودش مسئول باشه
  });
  return await this.tasksRepository.save(newTask);
}

  async findAll(){
    return await this.tasksRepository.find();
  }



  async findUserAllTasks(userId: number) {
    return await this.tasksRepository.find({
      where: [
        { createdById: userId }, // تسک‌هایی که من ساختم
        { assignedToId: userId }  // تسک‌هایی که باید من انجام بدم
      ],
      order: { createdAt: 'DESC' },
    });
}

  async findOne(id: number, userId: number) {
    const task = await this.tasksRepository.findOne({
      where: [
        { id, createdById: userId },
        { id, assignedToId: userId }
      ]
    });
    
    if (!task) throw new NotFoundException('تسک پیدا نشد یا شما اجازه دسترسی ندارید');
    return task;
  }

  // حذف تسک (فقط توسط مالک)
  async remove(id: number, userId: number) {
    const task = await this.findOne(id, userId); // اول چک میکنیم مال خودش باشه
    await this.tasksRepository.remove(task);
    return { message: 'تسک با موفقیت حذف شد' };
  }


async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
  // اول تسک رو پیدا می‌کنیم (متد findOne خودمان که امنیت رو چک می‌کنه)
  const task = await this.findOne(id, userId);

  // اعمال تغییرات جدید روی آبجکت تسک
  Object.assign(task, updateTaskDto);

  return await this.tasksRepository.save(task);
} 

}