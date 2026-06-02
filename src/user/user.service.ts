import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateUserDto) {
    const userExist = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (userExist) {
      throw new BadRequestException('Email sudah terdaftar!');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // Simpan ke database dengan password yang sudah di-hash
    const newUser = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword, // Gunakan hasil hash
        role: dto.role,
      },
    });

    // Sembunyikan password dari response Postman demi keamanan
    const { password, ...result } = newUser;
    return result;
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        id: 'asc'
      }
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByName(name: string) {
    // Gunakan findFirst karena kolom nama tidak di-set @unique di schema.prisma
    const user = await this.prisma.user.findFirst({
      where: { name: name },
    });

    if (!user) {
      throw new NotFoundException(`User dengan nama '${name}' tidak ditemukan`);
    }

    // Sembunyikan password
    const { password, ...result } = user;
    return result;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    const updateData = { ...dto};

    // Cek apakah admin mengupdate password, jika ya maka lakukan enkripsi bcrypt
    if (updateData.password) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    // Update ke Prisma
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password, ...result } = updatedUser;
    
    return {
      message: `User dengan ID ${id} berhasil diperbarui`,
      user: result,
    };
  }

  async updateByName(name: string, dto: UpdateUserDto) {
    const user = await this.findByName(name);

    const updateData = { ...dto};

    if (updateData.password) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    
    const { password, ...result } = updatedUser;
    return {
      message: `User dengan nama '${name}' berhasil diperbarui`,
      user: result,
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: `User with id ${id} deleted` };
  }

  async removeByName(name: string) {
    const user = await this.findByName(name);
    await this.prisma.user.delete({
      where: { id: user.id },
    });

    return { message: `User dengan nama '${name}' berhasil dihapus` };
  }
}