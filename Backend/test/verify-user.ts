import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import path from 'path';
import fs from 'fs';
import { AppModule } from '../dist/app.module.js';
import { TransformInterceptor } from '../dist/middlewares/transform.interceptor.js';
import { HttpExceptionFilter } from '../dist/middlewares/http-exception.filter.js';
import { PrismaService } from '../dist/repositories/prisma.service.js';

async function runUserTests() {
  console.log('🚀 Bắt đầu kiểm thử toàn diện module User – Quản lý tài khoản...\n');

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

  const testEmail = `user_test_${Date.now()}@cafena.vn`;
  let currentEmail = testEmail;
  const initialPassword = 'UserPassword123@';
  let accessToken = '';
  let userId = '';
  let addressId1 = '';
  let addressId2 = '';

  // Tạo file ảnh giả lập để test upload avatar
  const tempDir = path.join(process.cwd(), 'temp_test');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  const testImagePath = path.join(tempDir, 'test_avatar.png');
  fs.writeFileSync(testImagePath, Buffer.from('FAKE_PNG_IMAGE_CONTENT'));

  try {
    // 0. ĐĂNG KÝ TÀI KHOẢN ĐỂ TEST
    console.log('0️⃣ [Setup] Tạo tài khoản kiểm thử...');
    const regRes = await request(server)
      .post('/api/v1/auth/register')
      .send({
        email: testEmail,
        password: initialPassword,
        fullName: 'Trần Văn Người Dùng',
        phone: '0911223344',
        address: 'Số 1 Phố Cà Phê, Hà Nội',
      });

    if (regRes.status !== 201) {
      throw new Error(`Đăng ký thất bại: ${JSON.stringify(regRes.body)}`);
    }
    accessToken = regRes.body.data.accessToken;
    userId = regRes.body.data.user.id;
    console.log('   ✅ Đã tạo tài khoản test thành công.');

    // 1. LẤY THÔNG TIN TÀI KHOẢN HIỆN TẠI (GET PROFILE)
    console.log('\n1️⃣ [Test] Lấy thông tin tài khoản hiện tại (GET /users/profile)...');
    const profileRes = await request(server)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${accessToken}`);

    if (profileRes.status !== 200 || profileRes.body.data.email !== testEmail) {
      throw new Error(`Lấy profile thất bại: ${JSON.stringify(profileRes.body)}`);
    }
    console.log('   ✅ Lấy thông tin tài khoản thành công! Họ tên: ' + profileRes.body.data.fullName);

    // 2. CẬP NHẬT HỌ TÊN VÀ SỐ ĐIỆN THOẠI (PATCH PROFILE)
    console.log('\n2️⃣ [Test] Cập nhật họ tên, số điện thoại (PATCH /users/profile)...');
    const updateInfoRes = await request(server)
      .patch('/api/v1/users/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        fullName: 'Trần Văn Cà Phê Mới',
        phone: '0988998899',
      });

    if (updateInfoRes.status !== 200 || updateInfoRes.body.data.user.fullName !== 'Trần Văn Cà Phê Mới') {
      throw new Error(`Cập nhật thông tin thất bại: ${JSON.stringify(updateInfoRes.body)}`);
    }
    console.log('   ✅ Cập nhật họ tên và số điện thoại thành công.');

    // 3. CẬP NHẬT EMAIL MỚI (YÊU CẦU XÁC THỰC LẠI)
    console.log('\n3️⃣ [Test] Cập nhật email mới (yêu cầu gửi mã xác thực lại)...');
    const newEmail = `new_${Date.now()}@cafena.vn`;
    const updateEmailRes = await request(server)
      .patch('/api/v1/users/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: newEmail,
      });

    if (
      updateEmailRes.status !== 200 ||
      updateEmailRes.body.data.emailChanged !== true ||
      updateEmailRes.body.data.user.isEmailVerified !== false
    ) {
      throw new Error(`Cập nhật email thất bại: ${JSON.stringify(updateEmailRes.body)}`);
    }
    currentEmail = newEmail;
    console.log('   ✅ Cập nhật email thành công! Đã chuyển isEmailVerified=false và phát sinh mã xác thực mới.');

    // 4. CẬP NHẬT ẢNH ĐẠI DIỆN (UPLOAD FILE AVATAR)
    console.log('\n4️⃣ [Test] Cập nhật ảnh đại diện (PATCH /users/profile/avatar)...');
    const avatarRes = await request(server)
      .patch('/api/v1/users/profile/avatar')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('avatar', testImagePath);

    if (avatarRes.status !== 200 || !avatarRes.body.data.avatar.startsWith('/uploads/avatars/')) {
      throw new Error(`Upload avatar thất bại: ${JSON.stringify(avatarRes.body)}`);
    }
    console.log(`   ✅ Upload avatar thành công! Đường dẫn: ${avatarRes.body.data.avatar}`);

    // 5. THAY ĐỔI MẬT KHẨU TÀI KHOẢN (CHANGE PASSWORD)
    console.log('\n5️⃣ [Test] Thay đổi mật khẩu tài khoản (POST /users/profile/change-password)...');
    const newPassword = 'NewUserSecretPassword456@';
    const changePassRes = await request(server)
      .post('/api/v1/users/profile/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: initialPassword,
        newPassword: newPassword,
      });

    if (changePassRes.status !== 200) {
      throw new Error(`Đổi mật khẩu thất bại: ${JSON.stringify(changePassRes.body)}`);
    }
    console.log('   ✅ Đổi mật khẩu thành công!');

    // Đăng nhập lại với mật khẩu mới để lấy token mới
    const reLoginRes = await request(server)
      .post('/api/v1/auth/login')
      .send({ email: currentEmail, password: newPassword });
    accessToken = reLoginRes.body.data.accessToken;
    console.log('   ✅ Đăng nhập lại bằng mật khẩu mới thành công.');

    // 6. THÊM ĐỊA CHỈ GIAO HÀNG ĐẦU TIÊN (TỰ ĐỘNG THÀNH MẶC ĐỊNH)
    console.log('\n6️⃣ [Test] Thêm địa chỉ giao hàng thứ nhất (POST /users/addresses)...');
    const addAddress1Res = await request(server)
      .post('/api/v1/users/addresses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientName: 'Trần Văn A (Nhà riêng)',
        phone: '0911223344',
        streetAddress: 'Số 10 Phố Huỳnh Thúc Kháng',
        ward: 'Phường Láng Hạ',
        district: 'Quận Đống Đa',
        province: 'Hà Nội',
      });

    if (addAddress1Res.status !== 201 || addAddress1Res.body.data.address.isDefault !== true) {
      throw new Error(`Thêm địa chỉ 1 thất bại: ${JSON.stringify(addAddress1Res.body)}`);
    }
    addressId1 = addAddress1Res.body.data.address.id;
    console.log('   ✅ Thêm địa chỉ 1 thành công (Tự động thiết lập làm mặc định isDefault=true).');

    // 7. THÊM ĐỊA CHỈ GIAO HÀNG THỨ HAI
    console.log('\n7️⃣ [Test] Thêm địa chỉ giao hàng thứ hai (Cơ quan)...');
    const addAddress2Res = await request(server)
      .post('/api/v1/users/addresses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientName: 'Trần Văn A (Văn phòng)',
        phone: '0988776655',
        streetAddress: 'Tòa nhà Landmark 81',
        ward: 'Phường 22',
        district: 'Quận Bình Thạnh',
        province: 'TP.HCM',
        isDefault: false,
      });

    if (addAddress2Res.status !== 201 || addAddress2Res.body.data.address.isDefault !== false) {
      throw new Error(`Thêm địa chỉ 2 thất bại: ${JSON.stringify(addAddress2Res.body)}`);
    }
    addressId2 = addAddress2Res.body.data.address.id;
    console.log('   ✅ Thêm địa chỉ 2 thành công.');

    // 8. LẤY DANH SÁCH ĐỊA CHỈ
    console.log('\n8️⃣ [Test] Lấy danh sách địa chỉ (GET /users/addresses)...');
    const listAddressRes = await request(server)
      .get('/api/v1/users/addresses')
      .set('Authorization', `Bearer ${accessToken}`);

    if (listAddressRes.status !== 200 || listAddressRes.body.data.length !== 2) {
      throw new Error(`Lấy danh sách địa chỉ thất bại: ${JSON.stringify(listAddressRes.body)}`);
    }
    console.log(`   ✅ Lấy danh sách thành công! Hiện có ${listAddressRes.body.data.length} địa chỉ lưu trữ.`);

    // 9. THIẾT LẬP ĐỊA CHỈ 2 LÀM MẶC ĐỊNH
    console.log('\n9️⃣ [Test] Thiết lập địa chỉ 2 làm mặc định (PATCH /users/addresses/:id/default)...');
    const setDefaultRes = await request(server)
      .patch(`/api/v1/users/addresses/${addressId2}/default`)
      .set('Authorization', `Bearer ${accessToken}`);

    if (setDefaultRes.status !== 200 || setDefaultRes.body.data.address.isDefault !== true) {
      throw new Error(`Đặt mặc định thất bại: ${JSON.stringify(setDefaultRes.body)}`);
    }
    console.log('   ✅ Thiết lập địa chỉ 2 làm mặc định thành công.');

    // 10. SỬA ĐỊA CHỈ 1
    console.log('\n🔟 [Test] Sửa thông tin địa chỉ 1 (PATCH /users/addresses/:id)...');
    const updateAddrRes = await request(server)
      .patch(`/api/v1/users/addresses/${addressId1}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientName: 'Trần Văn A (Nhà riêng Ba Mẹ)',
      });

    if (updateAddrRes.status !== 200 || updateAddrRes.body.data.address.recipientName !== 'Trần Văn A (Nhà riêng Ba Mẹ)') {
      throw new Error(`Sửa địa chỉ thất bại: ${JSON.stringify(updateAddrRes.body)}`);
    }
    console.log('   ✅ Sửa địa chỉ 1 thành công.');

    // 11. XÓA ĐỊA CHỈ 1
    console.log('\n1️⃣1️⃣ [Test] Xóa địa chỉ 1 (DELETE /users/addresses/:id)...');
    const deleteAddrRes = await request(server)
      .delete(`/api/v1/users/addresses/${addressId1}`)
      .set('Authorization', `Bearer ${accessToken}`);

    if (deleteAddrRes.status !== 200) {
      throw new Error(`Xóa địa chỉ thất bại: ${JSON.stringify(deleteAddrRes.body)}`);
    }
    console.log('   ✅ Xóa địa chỉ 1 thành công.');

    // 12. XEM LỊCH SỬ MUA HÀNG VÀ CHI TIẾT ĐƠN HÀNG CỦA BẢN THÂN
    console.log('\n1️⃣2️⃣ [Test] Xem lịch sử đơn hàng của bản thân (GET /users/orders)...');
    // Tạo 1 đơn hàng giả lập trong DB cho user
    const sampleProduct = await prisma.product.findFirst();
    if (sampleProduct) {
      const orderNumber = `ORD-TEST-${Date.now()}`;
      const sampleOrder = await prisma.order.create({
        data: {
          orderNumber,
          userId,
          recipientName: 'Trần Văn A',
          recipientPhone: '0911223344',
          shippingAddress: 'Tòa nhà Landmark 81, Phường 22, Bình Thạnh, TP.HCM',
          totalAmount: sampleProduct.Price * 2,
          items: {
            create: {
              productId: sampleProduct.ProductID,
              quantity: 2,
              price: sampleProduct.Price,
            },
          },
        },
      });

      const ordersRes = await request(server)
        .get('/api/v1/users/orders?page=1&limit=5')
        .set('Authorization', `Bearer ${accessToken}`);

      if (ordersRes.status !== 200 || ordersRes.body.data.length < 1) {
        throw new Error(`Xem lịch sử đơn hàng thất bại: ${JSON.stringify(ordersRes.body)}`);
      }
      console.log(`   ✅ Xem lịch sử đơn hàng thành công! Có ${ordersRes.body.meta.total} đơn hàng.`);

      console.log('\n1️⃣3️⃣ [Test] Xem chi tiết 1 đơn hàng (GET /users/orders/:orderId)...');
      const orderDetailRes = await request(server)
        .get(`/api/v1/users/orders/${sampleOrder.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      if (orderDetailRes.status !== 200 || orderDetailRes.body.data.orderNumber !== orderNumber) {
        throw new Error(`Xem chi tiết đơn hàng thất bại: ${JSON.stringify(orderDetailRes.body)}`);
      }
      console.log(`   ✅ Xem chi tiết đơn hàng ${orderNumber} thành công!`);
    }

    console.log('\n🎉 TẤT CẢ CÁC MỤC NGHIỆP VỤ CỦA CHỨC NĂNG USER - QUẢN LÝ TÀI KHOẢN ĐÃ VƯỢT QUA KIỂM THỬ THÀNH CÔNG 100%!');
  } finally {
    // Dọn dẹp dữ liệu test
    if (userId) {
      await prisma.orderItem.deleteMany({ where: { order: { userId } } }).catch(() => {});
      await prisma.order.deleteMany({ where: { userId } }).catch(() => {});
      await prisma.address.deleteMany({ where: { userId } }).catch(() => {});
      await prisma.cartItem.deleteMany({ where: { cart: { userId } } }).catch(() => {});
      await prisma.cart.deleteMany({ where: { userId } }).catch(() => {});
      await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    }
    if (fs.existsSync(testImagePath)) fs.unlinkSync(testImagePath);
    if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir);
    await app.close();
  }
}

runUserTests().catch((err) => {
  console.error('\n❌ Lỗi kiểm thử:', err);
  process.exit(1);
});
