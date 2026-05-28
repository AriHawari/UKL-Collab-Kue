import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // <-- Import ini

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- KONFIGURASI SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('Restoran UKL API')
    .setDescription('Dokumentasi API lengkap untuk aplikasi Kasir Restoran / Kafe')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Masukkan token JWT login kamu di sini',
        in: 'header',
      },
      'JWT-auth', // Nama pengunci keamanan khusus untuk Swagger
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Menentukan jalur web menjadi: localhost:3000/api
  // ---------------------------

  await app.listen(3000);
}
bootstrap();