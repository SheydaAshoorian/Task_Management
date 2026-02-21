import { IsNotEmpty,IsString,IsOptional, IsNumber, IsEnum , IsDateString} from 'class-validator'; 
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {

    @ApiProperty({ example: 'طراحی دیتابیس' })
    @IsString() 
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'باید جداول یوزر و تسک طراحی شوند', required: false })
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({ enum: TaskPriority, example: TaskPriority.High })
    @IsEnum(TaskPriority, { message: 'اولویت باید یکی از مقادیر Low, Medium یا High باشد' })
    priority: TaskPriority;

    @ApiProperty({ enum: TaskStatus, example: TaskStatus.Todo })
    @IsEnum(TaskStatus, { message: 'وضعیت نامعتبر است' })
    status: TaskStatus;

    @ApiProperty({ example: '2026-12-30', description: 'تاریخ ضرب‌الاجل تسک' })
    @IsDateString({}, { message: 'فرمت تاریخ ددلاین صحیح نیست' })
    @IsOptional()
    deadline?: Date;

    @ApiProperty()
    @IsNumber({}, { message: 'شناسه کاربر باید عدد باشد' })
    assignedToId: number;


}