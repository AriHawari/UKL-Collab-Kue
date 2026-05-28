import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [PrismaModule, UserModule, MenuModule, AuthModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
