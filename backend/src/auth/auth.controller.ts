import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { FastifyRequest } from 'fastify';
import { SignUpDto } from './dto/signup.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    const res = await this.authService.signUp(body);
    return res;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req: FastifyRequest) {
    return this.authService.login({ user: req.user });
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  async refresh(
    @Req() req: FastifyRequest & { user: { refreshToken: string } },
  ) {
    return await this.authService.refresh({ user: req.user });
  }

  //OR LOGIC IF EITHER ONE FO THE ITEM IN PERMISSION IS PRESENT FOT HE LOGGED IN USER ACCESSTO THE ROUTE IS GIVEN
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  profile(@Req() req: FastifyRequest) {
    return req.user;
  }
}
