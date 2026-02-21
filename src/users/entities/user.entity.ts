import { Entity , Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Exclude } from 'class-transformer';

export enum  UserRole{

    Admin = 'admin',
    User = 'user',
    Manager = 'manager',
}


@Entity('User')
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ unique: true }) 
    email: string;

    @Column(
        { type : 'enum',
          enum : UserRole,
          default : UserRole.User , 
        }
    )
    role: UserRole ;

    @Column({ select: false})
    @Exclude()
    password: string;


    @Column({ default: true})
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Task, (task) => task.assignedTo)
    assignedTasks: Task[]; // تسک‌هایی که به این کاربر محول شده

    @OneToMany(() => Task, (task) => task.createdBy)
    createdTasks: Task[]; // تسک‌هایی که این کاربر ساخته است



}