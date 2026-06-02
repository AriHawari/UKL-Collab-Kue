import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, // Diubah jadi camelCase agar konsisten
  ) {}

  // REGISTER 
  async register(dto: RegisterDto) {
    const userExist = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (userExist) {
      throw new BadRequestException('username atau email sudah digunakan');
    }
  
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const newUser = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
      },
    });

    const { password, ...result } = newUser;
    return {
      message: 'Registrasi user baru berhasil',
      user: result,
    };
  }

  // LOGIN 
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Validasi user dulu sebelum cek password agar tidak crash jika user null
    if (!user) {
      throw new UnauthorizedException('Username atau password salah!');
    }

    const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Username atau password salah!');
    }

    const payload = { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    };

    return {
      message: 'Login berhasil!',
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getMe(userId: number) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new BadRequestException('User tidak ditemukan');
  }

  // Buang password sebelum dikembalikan ke client/Postman
  const { password, ...result } = user;
  return {
    message: 'Berhasil mengambil profil diri sendiri',
    user: result,
  };
}
}