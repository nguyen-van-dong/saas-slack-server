// services/jwt.service.ts
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secret = process.env.JWT_SECRET || 'secretKey';

  sign(payload: any, expiresIn: string): string {
    return jwt.sign(payload, this.secret, { expiresIn: expiresIn });
  }

  verify(token: string): any {
    return jwt.verify(token, this.secret);
  }
}
