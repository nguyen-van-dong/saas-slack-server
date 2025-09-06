import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendActivationEmail(to: string, token: string) {
    try {
      const url = `${process.env.CLIENT_URL}/auth/activate?token=${token}`;
      const result = await this.transporter.sendMail({
        from: '"DnSoft" <dong.joseph2810@gmail.com>',
        to,
        subject: 'Kích hoạt tài khoản',
        html: `<p>Click vào link để kích hoạt: <a href="${url}">${url}</a></p>`,
      });
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending activation email:', error);
      throw error;
    }
  }

  async sendResetPasswordEmail(to: string, token: string) {
    try {
      const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
      const result = await this.transporter.sendMail({
        from: '"DnSoft" <dong.joseph2810@gmail.com>',
        to,
        subject: 'Khôi phục mật khẩu',
        html: `<p>Click để đặt lại mật khẩu: <a href="${url}">${url}</a></p>`,
      });
      console.log('Reset password email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending reset password email:', error);
      throw error;
    }
  }
}
