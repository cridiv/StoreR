import { 
  Controller, 
  Get, 
  Req, 
  Res, 
  UseGuards, 
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user: { id: string; email?: string }; 
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private config: ConfigService) {}

  // Step 1 — Google login
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  // Step 2 — Google callback
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const googleUser = req.user as any;

    if (!googleUser) {
      throw new UnauthorizedException('Google user not found');
    }

    const user = await this.authService.validateGoogleUser(googleUser);
    
    if (!user.email) {
      throw new UnauthorizedException('User email not found');
    }
    
    const token = this.authService.generateJwt({ id: user.id, email: user.email as string });
    const frontendURL =
      this.config.get<string>('FRONTEND_URL') ??
      'https://storer-wheat.vercel.app/dashboard;
    return res.redirect(`${frontendURL}?token=${token}`);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const user = await this.authService.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
      createdAt: user.createdAt,
    };
  } 
};
