import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SimpleAuthGuard } from './simple-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: RegisterDto) {
    return this.authService.login(dto);
  }

  @UseGuards(SimpleAuthGuard)
  @Get()
  getUsers() {
    return this.authService.getUsers();
  }
}
