import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthService, AuthResponse } from './auth.service';
import { SignUpDto, SignInDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: SignUpDto): Promise<AuthResponse> {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  signIn(@Body() dto: SignInDto): Promise<AuthResponse> {
    return this.authService.signIn(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
      phone: user.phone,
      about: user.about,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  }
}
