import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'generated/prisma/enums';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'

@ApiTags('Transaction (Struk Kasir')
@ApiBearerAuth('JWT-auth')
@Controller('transaction')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.transactionService.findAll();
  }
}