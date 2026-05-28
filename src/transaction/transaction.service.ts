import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateTransactionDto) {
    return this.prisma.$transaction(async (tx) => {
      let totalTransactionPrice = 0;
      const detailsData: any[] = [];

      for (const item of dto.items) {
        // Cek apakah menu ada di database
        const menu = await tx.menu.findUnique({ where: { id: item.menuId } });
        if (!menu) {
          throw new NotFoundException(`Menu dengan ID ${item.menuId} tidak ditemukan`);
        }

        // Untuk mengecek
        if (menu.stock < item.quantity) {
          throw new BadRequestException(`Stok untuk menu [${menu.name}] tidak mencukupi! Sisa stok: ${menu.stock}`);
        }

        // Kurangi stok menu di database
        await tx.menu.update({
          where: { id: menu.id },
          data: { stock: menu.stock - item.quantity },
        });

        // Hitung subtotal harga menu tersebut
        const subTotal = menu.price * item.quantity;
        totalTransactionPrice += subTotal;

        // Simpan data detail sementara ke dalam array
        detailsData.push({
          menuId: item.menuId,
          quantity: item.quantity,
          subTotal: subTotal,
        });
      }

      // Buat data induk Transaksi beserta Detailnya sekaligus
      const transaction = await tx.transaction.create({
        data: {
          userId: dto.userId,
          totalPrice: totalTransactionPrice,
          details: {
            create: detailsData, // Otomatis mengisi tabel TransactionDetail
          },
        },
        include: {
          details: true, // Sertakan detail data saat mengembalikan response
        },
      });

      return {
        message: 'Transaksi berhasil dicatat!',
        data: transaction,
      };
    });
  }

async findAll() {
  return this.prisma.transaction.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true } // Mengambil info pembeli tanpa password
      },
      details: {
        include: {
          menu: true // Mengambil info detail menu yang dibeli (nama, harga, dll)
        }
      }
    },
    orderBy: {
      createdAt: 'desc' // Transaksi terbaru muncul di paling atas
    }
  });
}

}