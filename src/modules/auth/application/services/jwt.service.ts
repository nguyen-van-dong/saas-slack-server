// services/jwt.service.ts
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secret = process.env.JWT_SECRET || 'secret';

  sign(payload: any): string {
    return jwt.sign(payload, this.secret, { expiresIn: '7d' });
  }

  verify(token: string): any {
    return jwt.verify(token, this.secret);
  }
}
