import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        // اگر دیتا حاوی پیام بود از اون استفاده کن، وگرنه پیش‌فرض بذار
        message: data?.message || 'عملیات موفقیت‌آمیز بود',
        // اگر دیتا دارای فیلد user یا هر دیتای دیگه‌ای بود، اون رو توی بخش data بذار
       data: data?.data ? data.data : (data?.user || data || {}),
        timestamp: new Date().toISOString(),
      })),
    );
  }
}