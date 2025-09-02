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
    const url = `https://yourdomain.com/auth/activate?token=${token}`;
    await this.transporter.sendMail({
      from: '"DnSoft" <no-reply@dnsoft.vn>',
      to,
      subject: 'Kích hoạt tài khoản',
      html: `<p>Click vào link để kích hoạt: <a href="${url}">${url}</a></p>`,
    });
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const url = `https://yourdomain.com/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: '"DnSoft" <no-reply@dnsoft.vn>',
      to,
      subject: 'Khôi phục mật khẩu',
      html: `<p>Click để đặt lại mật khẩu: <a href="${url}">${url}</a></p>`,
    });
  }
}
