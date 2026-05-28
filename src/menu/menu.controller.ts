import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

import { UserRole } from 'generated/prisma/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Menu Management') // Mengelompokkan semua rute Menu
@ApiBearerAuth('JWT-auth')
@Controller('menu')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @Roles(UserRole.ADMIN) 
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER) 
  findAll() {
    return this.menuService.findAll();
  }

  @Get('name/:name')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  findByName(@Param('name') name: string) {
    return this.menuService.findByName(name);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER) 
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Patch('name/:name')
  @Roles(UserRole.ADMIN)
  updateByName(@Param('name') name: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.updateByName(name, updateMenuDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN) 
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete('name/:name')
  @Roles(UserRole.ADMIN)
  removeByName(@Param('name') name: string) {
    return this.menuService.removeByName(name);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}