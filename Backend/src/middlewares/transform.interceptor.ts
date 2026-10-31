import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((result) => {
        if (result && typeof result === 'object' && 'data' in result && 'meta' in result) {
          return {
            success: true,
            statusCode,
            message: result.message || 'Thành công',
            data: result.data,
            meta: result.meta,
          };
        }

        if (result && typeof result === 'object' && 'message' in result && 'data' in result) {
          return {
            success: true,
            statusCode,
            message: result.message,
            data: result.data,
          };
        }

        return {
          success: true,
          statusCode,
          message: 'Thao tác thành công',
          data: result,
        };
      }),
    );
  }
}

