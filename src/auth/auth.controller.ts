import { Controller,Get, Post, Body, UseGuards, Req} from '@nestjs/common'; 
import { AuthService } from './auth.service'; 
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto'; 
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@ApiTags('auth')
@Controller('auth')
@Controller('auth') 
export class AuthController { 
  constructor(private authService: AuthService) {} 

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mengambil data profil user yang sedang dipakai saat ini' })
  async getMe(@Req() req: any) {
    const userId = req.user.id; 
    return this.authService.getMe(userId);
  }

  @Post('login') 
  login(@Body() dto: LoginDto) { 
    return this.authService.login(dto); 
  } 
}