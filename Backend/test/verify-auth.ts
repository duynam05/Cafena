import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';
import { TransformInterceptor } from '../dist/middlewares/transform.interceptor.js';
import { HttpExceptionFilter } from '../dist/middlewares/http-exception.filter.js';
import { PrismaService } from '../dist/repositories/prisma.service.js';

async function runAuthTests() {
  console.log('🚀 Bắt đầu kiểm thử toàn diện module Authentication & RBAC...\n');

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.init();

  const prisma = app.get(PrismaService);
  const server = app.getHttpServer();

  const testEmail = `test_customer_${Date.now()}@cafena.vn`;
  const testPassword = 'Password123!';
  let customerAccessToken = '';
  let customerRefreshToken = '';
  let customerId = '';
  let verifyOtp = '';
  let verifyToken = '';
  let resetOtp = '';
  let resetToken = '';

  try {
    // 1. ĐĂNG KÝ TÀI KHOẢN KHÁCH HÀNG
    console.log('1️⃣ [Test] Đăng ký tài khoản khách hàng mới...');
    const registerRes = await request(server)
      .post('/api/v1/auth/register')
      .send({
        email: testEmail,
        password: testPassword,
        fullName: 'Nguyễn Thử Nghiệm',
        phone: '0988776655',
        address: 'Số 123 Đường Cà Phê, Hà Nội',
      });

    if (registerRes.status !== 201) {
      throw new Error(`Đăng ký thất bại: ${JSON.stringify(registerRes.body)}`);
    }
    customerAccessToken = registerRes.body.data.accessToken;
    customerRefreshToken = registerRes.body.data.refreshToken;
    customerId = registerRes.body.data.user.id;
    console.log('   ✅ Đăng ký thành công! Cấp AccessToken & RefreshToken tự động.');

    // Lấy OTP & Token xác minh từ DB
    const createdUser = await prisma.user.findUnique({ where: { id: customerId } });
    verifyOtp = createdUser?.emailVerifyOtp || '';
    verifyToken = createdUser?.emailVerifyToken || '';
    console.log(`   📧 Mã OTP xác minh email: ${verifyOtp}, Token: ${verifyToken.substring(0, 10)}...`);

    // 2. KIỂM TRA TRẠNG THÁI TÀI KHOẢN
    console.log('\n2️⃣ [Test] Kiểm tra trạng thái tài khoản...');
    const statusRes = await request(server)
      .get('/api/v1/auth/check-status')
      .set('Authorization', `Bearer ${customerAccessToken}`);

    if (statusRes.body.data.isActive !== true || statusRes.body.data.isEmailVerified !== false) {
      throw new Error(`Trạng thái không đúng: ${JSON.stringify(statusRes.body)}`);
    }
    console.log('   ✅ Tài khoản đang hoạt động (isActive=true), chưa xác minh email (isEmailVerified=false).');

    // 3. XÁC MINH EMAIL BẰNG MÃ OTP
    console.log('\n3️⃣ [Test] Xác minh email bằng mã OTP 6 số...');
    const verifyOtpRes = await request(server)
      .post('/api/v1/auth/verify-email-otp')
      .send({
        email: testEmail,
        otp: verifyOtp,
      });

    if (verifyOtpRes.status !== 200) {
      throw new Error(`Xác minh email bằng OTP thất bại: ${JSON.stringify(verifyOtpRes.body)}`);
    }
    console.log('   ✅ Xác minh email qua OTP thành công!');

    // 4. ĐĂNG XUẤT (VÔ HIỆU HÓA REFRESH TOKEN)
    console.log('\n4️⃣ [Test] Đăng xuất tài khoản...');
    const logoutRes = await request(server)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${customerAccessToken}`);

    if (logoutRes.status !== 200) {
      throw new Error(`Đăng xuất thất bại: ${JSON.stringify(logoutRes.body)}`);
    }
    console.log('   ✅ Đăng xuất thành công, Refresh Token đã bị thu hồi trong CSDL.');

    // 5. THỬ LÀM MỚI TOKEN VỚI REFRESH TOKEN CŨ ĐÃ BỊ THU HỒI
    console.log('\n5️⃣ [Test] Kiểm tra chặn Refresh Token cũ sau khi đã đăng xuất...');
    const refreshOldRes = await request(server)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: customerRefreshToken });

    if (refreshOldRes.status !== 401) {
      throw new Error(`Cảnh báo an ninh: Refresh token cũ vẫn được chấp nhận!`);
    }
    console.log('   ✅ Đã chặn thành công Refresh Token cũ (Trả về 401 Unauthorized đúng chuẩn).');

    // 6. ĐĂNG NHẬP LẠI BẰNG EMAIL VÀ MẬT KHẨU
    console.log('\n6️⃣ [Test] Đăng nhập bằng Email & Mật khẩu...');
    const loginRes = await request(server)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      });

    if (loginRes.status !== 200) {
      throw new Error(`Đăng nhập thất bại: ${JSON.stringify(loginRes.body)}`);
    }
    customerAccessToken = loginRes.body.data.accessToken;
    customerRefreshToken = loginRes.body.data.refreshToken;
    console.log('   ✅ Đăng nhập thành công, nhận cặp Token mới.');

    // 7. LÀM MỚI ACCESS TOKEN BẰNG REFRESH TOKEN MỚI (ROTATION)
    console.log('\n7️⃣ [Test] Làm mới Access Token (Refresh Token Rotation)...');
    const refreshNewRes = await request(server)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: customerRefreshToken });

    if (refreshNewRes.status !== 200) {
      throw new Error(`Refresh token thất bại: ${JSON.stringify(refreshNewRes.body)}`);
    }
    customerAccessToken = refreshNewRes.body.data.accessToken;
    customerRefreshToken = refreshNewRes.body.data.refreshToken;
    console.log('   ✅ Refresh Token hợp lệ! Đã cấp AccessToken & RefreshToken mới.');

    // 8. YÊU CẦU QUÊN MẬT KHẨU
    console.log('\n8️⃣ [Test] Yêu cầu quên mật khẩu...');
    const forgotRes = await request(server)
      .post('/api/v1/auth/forgot-password')
      .send({ email: testEmail });

    if (forgotRes.status !== 200) {
      throw new Error(`Yêu cầu quên mật khẩu thất bại: ${JSON.stringify(forgotRes.body)}`);
    }

    const userWithReset = await prisma.user.findUnique({ where: { id: customerId } });
    resetOtp = userWithReset?.resetPasswordOtp || '';
    resetToken = userWithReset?.resetPasswordToken || '';
    console.log(`   ✅ Gửi mã đặt lại mật khẩu thành công (OTP: ${resetOtp}, Token: ${resetToken.substring(0, 10)}...).`);

    // 9. ĐẶT LẠI MẬT KHẨU BẰNG MÃ OTP
    const newTestPassword = 'NewSecretPassword2026!';
    console.log('\n9️⃣ [Test] Đặt lại mật khẩu bằng mã OTP...');
    const resetOtpRes = await request(server)
      .post('/api/v1/auth/reset-password-otp')
      .send({
        email: testEmail,
        otp: resetOtp,
        newPassword: newTestPassword,
      });

    if (resetOtpRes.status !== 200) {
      throw new Error(`Đặt lại mật khẩu thất bại: ${JSON.stringify(resetOtpRes.body)}`);
    }
    console.log('   ✅ Đặt lại mật khẩu bằng OTP thành công!');

    // 10. ĐĂNG NHẬP VỚI MẬT KHẨU MỚI
    console.log('\n🔟 [Test] Đăng nhập bằng mật khẩu mới...');
    const loginWithNewPassRes = await request(server)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: newTestPassword,
      });

    if (loginWithNewPassRes.status !== 200) {
      throw new Error(`Đăng nhập bằng mật khẩu mới thất bại: ${JSON.stringify(loginWithNewPassRes.body)}`);
    }
    customerAccessToken = loginWithNewPassRes.body.data.accessToken;
    console.log('   ✅ Đăng nhập bằng mật khẩu mới thành công.');

    // 11. ĐĂNG NHẬP VỚI TÀI KHOẢN ADMIN VÀ STAFF MẪU
    console.log('\n1️⃣1️⃣ [Test] Đăng nhập Admin & Staff...');
    const adminLoginRes = await request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@cafena.vn', password: 'admin123' });
    const adminToken = adminLoginRes.body.data.accessToken;

    const staffLoginRes = await request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'staff@cafena.vn', password: 'staff123' });
    const staffToken = staffLoginRes.body.data.accessToken;
    console.log('   ✅ Đăng nhập tài khoản Admin và Staff thành công.');

    // 12. KIỂM TRA PHÂN QUYỀN RBAC (CUSTOMER, STAFF, ADMIN)
    console.log('\n1️⃣2️⃣ [Test] Kiểm tra phân quyền RBAC & kiểm tra quyền truy cập API theo vai trò...');
    // a. Customer truy cập customer endpoint -> 200
    const cAccessRes = await request(server)
      .get('/api/v1/auth/test/customer-access')
      .set('Authorization', `Bearer ${customerAccessToken}`);
    if (cAccessRes.status !== 200) throw new Error('Customer không truy cập được customer endpoint');

    // b. Customer truy cập admin endpoint -> 403 Forbidden
    const cAdminRes = await request(server)
      .get('/api/v1/auth/test/admin-access')
      .set('Authorization', `Bearer ${customerAccessToken}`);
    if (cAdminRes.status !== 403) throw new Error('Lỗi bảo mật: Customer truy cập trái phép được Admin endpoint');
    console.log('   ✅ Khách hàng bị chặn truy cập API Admin (403 Forbidden).');

    // c. Staff truy cập staff endpoint -> 200, nhưng truy cập admin endpoint -> 403
    const sStaffRes = await request(server)
      .get('/api/v1/auth/test/staff-access')
      .set('Authorization', `Bearer ${staffToken}`);
    if (sStaffRes.status !== 200) throw new Error('Staff không truy cập được staff endpoint');

    const sAdminRes = await request(server)
      .get('/api/v1/auth/test/admin-access')
      .set('Authorization', `Bearer ${staffToken}`);
    if (sAdminRes.status !== 403) throw new Error('Lỗi bảo mật: Staff truy cập trái phép được Admin endpoint');
    console.log('   ✅ Nhân viên (Staff) truy cập được Staff API và bị chặn tại Admin API (403 Forbidden).');

    // d. Admin truy cập admin endpoint -> 200
    const aAdminRes = await request(server)
      .get('/api/v1/auth/test/admin-access')
      .set('Authorization', `Bearer ${adminToken}`);
    if (aAdminRes.status !== 200) throw new Error('Admin không truy cập được Admin endpoint');
    console.log('   ✅ Quản trị viên (Admin) toàn quyền truy cập các endpoint cấp cao.');

    console.log('\n🎉 TẤT CẢ 12 HẠNG MỤC XÁC THỰC & PHÂN QUYỀN ĐÃ VƯỢT QUA KIỂM THỬ THÀNH CÔNG 100%!');
  } finally {
    // Dọn dẹp tài khoản test
    if (customerId) {
      await prisma.cartItem.deleteMany({ where: { cart: { userId: customerId } } });
      await prisma.cart.deleteMany({ where: { userId: customerId } });
      await prisma.user.delete({ where: { id: customerId } }).catch(() => {});
    }
    await app.close();
  }
}

runAuthTests().catch((err) => {
  console.error('\n❌ Lỗi kiểm thử:', err);
  process.exit(1);
});
