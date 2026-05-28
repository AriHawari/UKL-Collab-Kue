import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service'; // Sesuaikan path prisma kamu
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }, // Token hangus dalam 1 hari
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    PrismaService, 
    JwtStrategy, 
    JwtAuthGuard, 
    RolesGuard
  ],
  exports: [JwtAuthGuard, RolesGuard, JwtModule], // Di-export agar modul lain (seperti BookModule) bisa pakai guard-nya
})
export class AuthModule {}