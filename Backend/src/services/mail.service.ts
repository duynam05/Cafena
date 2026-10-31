import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;
  private readonly from: string;

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    const host = this.configService.get<string>('mail.host');
    const port = this.configService.get<number>('mail.port', 587);
    const user = this.configService.get<string>('mail.user');
    const pass = this.configService.get<string>('mail.pass');
    this.from = this.configService.get<string>(
      'mail.from',
      'Cafena Coffee <no-reply@cafena.vn>',
    );

    if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });
        this.logger.log(`SMTP Mail Transporter đã sẵn sàng: ${host}:${port}`);
      } catch (err: any) {
        this.logger.warn(`Không thể khởi tạo SMTP transporter: ${err.message}`);
      }
    } else {
      this.logger.log(
        'Chưa cấu hình SMTP trong .env -> Chế độ Dev Mode: Mọi mã OTP & Link sẽ được hiển thị trên Terminal Console.',
      );
    }
  }

  /**
   * Gửi email xác thực tài khoản (bao gồm OTP 6 số và Link xác nhận)
   */
  async sendEmailVerification(
    email: string,
    fullName: string,
    otp: string,
    token: string,
  ): Promise<void> {
    const clientUrl = this.configService.get<string>(
      'clientUrl',
      'http://localhost:5173',
    );
    const verifyLink = `${clientUrl}/#verify-email?token=${token}`;

    this.printDevLog('XÁC THỰC EMAIL TÀI KHOẢN (EMAIL VERIFICATION)', [
      `Người nhận: ${fullName} <${email}>`,
      `Mã OTP xác thực: ${otp} (Hết hạn sau 24 giờ)`,
      `Đường dẫn xác nhận: ${verifyLink}`,
    ]);

    if (!this.transporter) return;

    try {
      await this.transporter.sendMail({
        from: this.from,
        to: email,
        subject: '☕ [Cafena Coffee] - Xác thực địa chỉ email tài khoản của bạn',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #fdfaf6;">
            <h2 style="color: #6F4E37; text-align: center;">Chào mừng bạn đến với Cafena Coffee!</h2>
            <p>Xin chào <strong>${fullName}</strong>,</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại hệ thống bán cà phê trực tuyến <strong>Cafena Coffee</strong>. Vui lòng xác thực email của bạn để kích hoạt đầy đủ các quyền lợi thành viên.</p>
            <div style="background-color: #ffffff; border: 1px dashed #6F4E37; padding: 16px; text-align: center; margin: 24px 0; border-radius: 6px;">
              <p style="margin: 0; color: #718096; font-size: 14px;">Mã OTP xác thực của bạn (Hiệu lực trong 24h):</p>
              <h1 style="margin: 8px 0; letter-spacing: 6px; color: #6F4E37; font-size: 32px;">${otp}</h1>
            </div>
            <p style="text-align: center; margin: 24px 0;">
              <a href="${verifyLink}" style="background-color: #6F4E37; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Bấm vào đây để Xác thực ngay
              </a>
            </p>
            <p style="font-size: 13px; color: #718096;">Hoặc bạn có thể sao chép liên kết sau vào trình duyệt: <br/><a href="${verifyLink}" style="color: #6F4E37;">${verifyLink}</a></p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 12px; color: #a0aec0; text-align: center;">Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.</p>
          </div>
        `,
      });
    } catch (err: any) {
      this.logger.error(`Lỗi khi gửi email xác thực đến ${email}: ${err.message}`);
    }
  }

  /**
   * Gửi email quên mật khẩu (bao gồm mã OTP 6 số và Link đặt lại mật khẩu)
   */
  async sendPasswordReset(
    email: string,
    fullName: string,
    otp: string,
    token: string,
  ): Promise<void> {
    const clientUrl = this.configService.get<string>(
      'clientUrl',
      'http://localhost:5173',
    );
    const resetLink = `${clientUrl}/#reset-password?token=${token}`;

    this.printDevLog('YÊU CẦU ĐẶT LẠI MẬT KHẨU (PASSWORD RESET)', [
      `Người nhận: ${fullName} <${email}>`,
      `Mã OTP đặt lại mật khẩu: ${otp} (Hết hạn sau 15 phút)`,
      `Đường dẫn đặt lại: ${resetLink}`,
    ]);

    if (!this.transporter) return;

    try {
      await this.transporter.sendMail({
        from: this.from,
        to: email,
        subject: '🔒 [Cafena Coffee] - Yêu cầu đặt lại mật khẩu tài khoản',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #fdfaf6;">
            <h2 style="color: #6F4E37; text-align: center;">Yêu cầu Đặt lại Mật khẩu</h2>
            <p>Xin chào <strong>${fullName}</strong>,</p>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với địa chỉ email <strong>${email}</strong>.</p>
            <div style="background-color: #ffffff; border: 1px dashed #e53e3e; padding: 16px; text-align: center; margin: 24px 0; border-radius: 6px;">
              <p style="margin: 0; color: #718096; font-size: 14px;">Mã OTP bảo mật của bạn (Có hiệu lực trong 15 phút):</p>
              <h1 style="margin: 8px 0; letter-spacing: 6px; color: #e53e3e; font-size: 32px;">${otp}</h1>
            </div>
            <p style="text-align: center; margin: 24px 0;">
              <a href="${resetLink}" style="background-color: #6F4E37; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Đặt lại Mật khẩu ngay
              </a>
            </p>
            <p style="font-size: 13px; color: #718096;">Hoặc bạn có thể truy cập link: <br/><a href="${resetLink}" style="color: #6F4E37;">${resetLink}</a></p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 12px; color: #a0aec0; text-align: center;">Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email. Mật khẩu hiện tại của bạn vẫn được an toàn.</p>
          </div>
        `,
      });
    } catch (err: any) {
      this.logger.error(`Lỗi khi gửi email đặt lại mật khẩu đến ${email}: ${err.message}`);
    }
  }

  private printDevLog(title: string, details: string[]) {
    const divider = '================================================================================';
    console.log('\n' + divider);
    console.log(`✉️  [MAIL SERVICE DEV LOG] ${title}`);
    details.forEach((line) => console.log(`   👉 ${line}`));
    console.log(divider + '\n');
  }
}
