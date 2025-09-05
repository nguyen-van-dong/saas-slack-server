export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  timestamp: string;
  path?: string;
}

export class SuccessResponse<T = any> implements ApiResponse<T> {
  success: boolean = true;
  message: string;
  data?: T;
  timestamp: string;
  path?: string;

  constructor(message: string, data?: T, path?: string) {
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.path = path;
  }
}

export class ErrorResponse implements ApiResponse {
  success: boolean = false;
  message: string;
  error: {
    code: string;
    details?: any;
  };
  timestamp: string;
  path?: string;

  constructor(message: string, code: string, details?: any, path?: string) {
    this.message = message;
    this.error = { code, details };
    this.timestamp = new Date().toISOString();
    this.path = path;
  }
}
