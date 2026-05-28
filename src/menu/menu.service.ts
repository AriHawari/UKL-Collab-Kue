import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateMenuDto) {
    return this.prisma.menu.create({ data: dto });
  }

  async findAll() {
    return this.prisma.menu.findMany({
      orderBy: {
        id: 'asc'
      }
    });
  }

  async findOne(id: number) {
    const menu = await this.prisma.menu.findUnique({
      where: { id }
    });
    if (!menu) throw new NotFoundException('Menu not found');
    return menu;
  }

  async findByName(name: string) {
    const menu = await this.prisma.menu.findFirst({
      where: { name: name }
    });
    if (!menu) throw new NotFoundException(`Menu dengan nama '${name}' tidak ditemukan`);
    return menu;
  }

  async update(id: number, dto: UpdateMenuDto) {
    await this.findOne(id);
    return this.prisma.menu.update({
      where: { id },
      data: dto,
    });
  }

  async updateByName(name: string, dto: UpdateMenuDto) {
    const menu = await this.findByName(name); 
    return this.prisma.menu.update({
      where: { id: menu.id }, 
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.menu.delete({ where: { id } });
    return { message: `menu with id ${id} deleted` };
  }

  async removeByName(name: string) {
    const menu = await this.findByName(name); 
    await this.prisma.menu.delete({
      where: { id: menu.id }
    });
    return { message: `Menu dengan nama '${name}' berhasil dihapus` };
  }
}