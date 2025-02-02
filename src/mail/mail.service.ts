import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // You can use other services like SendGrid, AWS SES, etc.
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // App password or email password
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    console.log(`Sending email to ${to}: ${subject} - ${text}`);
  }

  async sendOtpMail(to: string, otp: string): Promise<void> {
    const subject = 'Your OTP Code';
    const text = `Your OTP code is: ${otp}`;
    const html = `<p>Your OTP code is: <strong>${otp}</strong></p>`;
    
    await this.sendMail(to, subject, text, html);
  }

  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    const subject = 'Password Reset Request';
    const text = `Click the following link to reset your password: ${resetLink}`;
    const html = `<p>Click the following link to reset your password: <a href="${resetLink}">Reset Password</a></p>`;
    
    await this.sendMail(to, subject, text, html);
  }
}
