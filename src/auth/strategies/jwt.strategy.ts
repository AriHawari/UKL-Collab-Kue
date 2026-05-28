import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Membaca secret kuewenak dari .env kamu
    });
  }

  // Hasil return dari fungsi ini otomatis nempel di request.user
  async validate(payload: any) {
    return { 
      id: payload.id, 
      email: payload.email, 
      role: payload.role 
    };
  }
}