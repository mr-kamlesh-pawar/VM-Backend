import { Controller, Post, Body, UseGuards, Get, Res, Query,Req, Request} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register user
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // Login user (local authentication)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user); // req.user is set by LocalAuthGuard
  }

  // Forgot password (send reset email)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }




   // GET /reset-password?token=...
   @Get('reset-password')
   async showResetPasswordForm(@Query('token') token: string, @Res() res: Response) {
     try {
       // Verify the token
       const { email } = this.authService.verifyToken(token);
 
       // Render a form or redirect to a frontend page
       res.send(`
         <h1>Reset Password</h1>
         <form action="auth/reset-password" method="POST">
           <input type="hidden" name="token" value="${token}" />
           <label for="newPassword">New Password:</label>
           <input type="password" id="newPassword" name="newPassword" required />
           <button type="submit">Reset Password</button>
         </form>
       `);
     } catch (err) {
       res.status(400).send('Invalid or expired token');
     }
   }


  // Reset password with token
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
