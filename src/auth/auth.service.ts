import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

//   async login(dto: LoginDto) {
//     const user = await this.usersService.findByEmail(dto.email);
//     if (!user) {
//       throw new Error('User not found');
//     }

//     const passwordMatch = await bcrypt.compare(dto.password, user.password);
//     if (!passwordMatch) {
//       throw new Error('Invalid credentials');
//     }

//     const payload = { email: user.email, sub: user.id };
//     const token = this.jwtService.sign(payload);
//     return { accessToken: token };
//   }


async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new Error('User not found');
    }

    const passwordMatch = await bcrypt.compare(dto.password.trim(), user.password); // Trim the password
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }

  
  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password.trim(), 10); // Trim the password
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });
    return { message: 'User registered successfully!', user };
  }

  // Add this method to verify the token
  verifyToken(token: string): { email: string } {
    try {
      return this.jwtService.verify(token); // Verify the token and return the payload
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const token = this.jwtService.sign({ email }, { expiresIn: '1h' });
    const resetLink = `${process.env.BASE_URL}/auth/reset-password?token=${token}`;
//await this.mailService.sendPasswordResetLink(email, resetLink);


    await this.mailService.sendPasswordResetEmail(email, resetLink);
    return { message: 'Reset link sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const { email } = this.jwtService.verify(token);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      return this.usersService.updatePassword(email, hashedPassword);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
