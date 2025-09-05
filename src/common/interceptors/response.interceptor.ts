import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { SuccessResponse } from '../dto/api-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.url;

    return next.handle().pipe(
      map((data) => {
        // If data is already a formatted response, return it as is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Determine the message based on the HTTP method and path
        const message = this.getSuccessMessage(request.method, path);
        
        return new SuccessResponse(message, data, path);
      }),
    );
  }

  private getSuccessMessage(method: string, path: string): string {
    const pathSegments = path.split('/').filter(Boolean);
    const resource = pathSegments[pathSegments.length - 1] || 'resource';
    
    switch (method) {
      case 'POST':
        if (path.includes('register')) return 'User registered successfully';
        if (path.includes('login')) return 'User logged in successfully';
        if (path.includes('logout')) return 'User logged out successfully';
        if (path.includes('forgot-password')) return 'Password reset email sent';
        if (path.includes('reset-password')) return 'Password reset successfully';
        if (path.includes('change-password')) return 'Password changed successfully';
        if (path.includes('verify-email')) return 'Email verification sent';
        if (path.includes('refresh-token')) return 'Token refreshed successfully';
        return `${resource} created successfully`;
      
      case 'GET':
        return `${resource} retrieved successfully`;
      
      case 'PUT':
      case 'PATCH':
        return `${resource} updated successfully`;
      
      case 'DELETE':
        return `${resource} deleted successfully`;
      
      default:
        return 'Operation completed successfully';
    }
  }
}
