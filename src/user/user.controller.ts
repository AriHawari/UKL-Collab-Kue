import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';



import { UserRole } from 'generated/prisma/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator'


import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('User Management')
@ApiBearerAuth('JWT-auth')  // Memberi ikon gembok pertanda butuh token login
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('name/:name')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  findByName(@Param('name') name: string) {
    return this.userService.findByName(name);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch("name")
  @Roles(UserRole.ADMIN)
  updateByName(
    @Param('name') name: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.updateByName(name, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Delete('name/:name')
  @Roles(UserRole.ADMIN)
  removeByName(@Param('name') name: string) {
    return this.userService.removeByName(name);
  }
}
