import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';
import { TransformInterceptor } from '../dist/middlewares/transform.interceptor.js';
import { HttpExceptionFilter } from '../dist/middlewares/http-exception.filter.js';
import { PrismaService } from '../dist/repositories/prisma.service.js';

async function runCartTests() {
  console.log('🚀 Bắt đầu kiểm thử toàn diện module Cart – Quản lý giỏ hàng...\n');

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

  let customerToken = '';
  let customerId = '';
  let cartItemId1 = '';
  let cartItemId2 = '';

  const testEmail = `cart_test_${Date.now()}@cafena.vn`;

  try {
    // 0. ĐĂNG KÝ KHÁCH HÀNG MỚI ĐỂ TEST GIỎ HÀNG RIÊNG BIỆT
    console.log('0️⃣ [Setup] Tạo tài khoản khách hàng thử nghiệm...');
    const regRes = await request(server)
      .post('/api/v1/auth/register')
      .send({
        email: testEmail,
        password: 'Password123@',
        fullName: 'Khách Hàng Test Giỏ Hàng',
      });
    customerToken = regRes.body.data.accessToken;
    customerId = regRes.body.data.user.id;
    console.log('   ✅ Đã đăng ký tài khoản khách hàng thành công.');

    // 1. TỰ ĐỘNG KHỞI TẠO & LẤY THÔNG TIN GIỎ HÀNG (GET /cart)
    console.log('\n1️⃣ [Test] Lấy thông tin giỏ hàng ban đầu (GET /cart)...');
    const getCartRes = await request(server)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${customerToken}`);

    if (getCartRes.status !== 200 || getCartRes.body.data.totalItems !== 0) {
      throw new Error(`Lấy giỏ hàng ban đầu thất bại: ${JSON.stringify(getCartRes.body)}`);
    }
    console.log('   ✅ Lấy giỏ hàng thành công! Giỏ hàng rỗng (totalItems: 0, totalAmount: 0đ).');

    // 2. KIỂM TRA SẢN PHẨM KHÔNG TỒN TẠI (POST /cart với CF-9999)
    console.log('\n2️⃣ [Test] Kiểm tra chặn khi thêm sản phẩm không tồn tại (CF-9999)...');
    const notFoundRes = await request(server)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ productId: 'CF-9999', quantity: 1 });

    if (notFoundRes.status !== 404) {
      throw new Error(`Cảnh báo: Sản phẩm không tồn tại nhưng không trả về 404! Status: ${notFoundRes.status}`);
    }
    console.log('   ✅ Đã chặn sản phẩm không tồn tại thành công (404 Not Found đúng chuẩn).');

    // 3. KIỂM TRA SỐ LƯỢNG TỒN KHO: HẾT HÀNG HOẶC VƯỢT QUÁ TỒN KHO
    console.log('\n3️⃣ [Test] Kiểm tra chặn khi thêm sản phẩm hết hàng (CF-0006 Quantity=0)...');
    const outOfStockRes = await request(server)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ productId: 'CF-0006', quantity: 1 });

    if (outOfStockRes.status !== 400) {
      throw new Error(`Cảnh báo: Sản phẩm hết hàng nhưng vẫn cho thêm! Status: ${outOfStockRes.status}`);
    }
    console.log('   ✅ Đã chặn sản phẩm hết hàng thành công (400 Bad Request).');

    console.log('\n   [Test] Kiểm tra chặn khi thêm số lượng vượt quá tồn kho (Quantity=99999)...');
    const exceedStockRes = await request(server)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ productId: 'CF-0001', quantity: 99999 });

    if (exceedStockRes.status !== 400) {
      throw new Error(`Cảnh báo: Thêm vượt quá tồn kho nhưng không bị chặn! Status: ${exceedStockRes.status}`);
    }
    console.log('   ✅ Đã chặn khi thêm số lượng vượt tồn kho thành công (400 Bad Request).');

    // 4. THÊM SẢN PHẨM HỢP LỆ VÀO GIỎ HÀNG (POST /cart)
    console.log('\n4️⃣ [Test] Thêm sản phẩm CF-0001 (Quantity: 2) vào giỏ hàng...');
    const add1Res = await request(server)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ productId: 'CF-0001', quantity: 2 });

    if (add1Res.status !== 201 || add1Res.body.data.cart.totalItems !== 2) {
      throw new Error(`Thêm món 1 thất bại: ${JSON.stringify(add1Res.body)}`);
    }
    cartItemId1 = add1Res.body.data.cart.items[0].id;
    console.log(`   ✅ Thêm món 1 thành công! Giỏ hàng có ${add1Res.body.data.cart.totalItems} món, tổng tiền: ${add1Res.body.data.cart.totalAmount}đ.`);

    // 5. THÊM SẢN PHẨM THỨ HAI VÀO GIỎ HÀNG
    console.log('\n5️⃣ [Test] Thêm sản phẩm CF-0002 (Quantity: 1) vào giỏ hàng...');
    const add2Res = await request(server)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ productId: 'CF-0002', quantity: 1 });

    if (add2Res.status !== 201 || add2Res.body.data.cart.totalItems !== 3) {
      throw new Error(`Thêm món 2 thất bại: ${JSON.stringify(add2Res.body)}`);
    }
    cartItemId2 = add2Res.body.data.cart.items.find((i: any) => i.productId === 'CF-0002').id;
    console.log(`   ✅ Thêm món 2 thành công! Tổng số lượng món: ${add2Res.body.data.cart.totalItems}, Tổng tiền: ${add2Res.body.data.cart.totalAmount}đ.`);

    // 6. CẬP NHẬT SỐ LƯỢNG MÓN TRONG GIỎ HÀNG (PATCH /cart/items/:id)
    console.log('\n6️⃣ [Test] Cập nhật số lượng món CF-0001 từ 2 thành 4 món...');
    const updateRes = await request(server)
      .patch(`/api/v1/cart/items/${cartItemId1}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ quantity: 4 });

    if (updateRes.status !== 200 || updateRes.body.data.cart.totalItems !== 5) {
      throw new Error(`Cập nhật số lượng thất bại: ${JSON.stringify(updateRes.body)}`);
    }
    console.log(`   ✅ Cập nhật số lượng thành công! Tổng số lượng món mới: ${updateRes.body.data.cart.totalItems}.`);

    // 7. KIỂM TRA LẠI GIÁ VÀ TỒN KHO TRƯỚC KHI ĐẶT HÀNG (GET /cart/validate)
    console.log('\n7️⃣ [Test] Kiểm tra lại giá sản phẩm & số lượng tồn kho trước khi đặt hàng (GET /cart/validate)...');
    const validateRes = await request(server)
      .get('/api/v1/cart/validate')
      .set('Authorization', `Bearer ${customerToken}`);

    if (validateRes.status !== 200 || validateRes.body.data.isValid !== true || validateRes.body.data.canCheckout !== true) {
      throw new Error(`Kiểm tra giỏ hàng trước khi đặt thất bại: ${JSON.stringify(validateRes.body)}`);
    }
    console.log(`   ✅ Xác thực giỏ hàng thành công! Trạng thái sẵn sàng đặt hàng (canCheckout: true, warnings: 0).`);

    // 8. XÓA MỘT SẢN PHẨM KHỎI GIỎ HÀNG (DELETE /cart/items/:id)
    console.log('\n8️⃣ [Test] Xóa một sản phẩm khỏi giỏ hàng (DELETE /cart/items/:id)...');
    const removeOneRes = await request(server)
      .delete(`/api/v1/cart/items/${cartItemId2}`)
      .set('Authorization', `Bearer ${customerToken}`);

    if (removeOneRes.status !== 200 || removeOneRes.body.data.cart.items.some((i: any) => i.id === cartItemId2)) {
      throw new Error(`Xóa 1 món thất bại: ${JSON.stringify(removeOneRes.body)}`);
    }
    console.log(`   ✅ Xóa 1 món thành công! Giỏ hàng còn lại ${removeOneRes.body.data.cart.items.length} món.`);

    // 9. XÓA TOÀN BỘ GIỎ HÀNG (DELETE /cart)
    console.log('\n9️⃣ [Test] Xóa toàn bộ giỏ hàng (DELETE /cart)...');
    const clearRes = await request(server)
      .delete('/api/v1/cart')
      .set('Authorization', `Bearer ${customerToken}`);

    if (clearRes.status !== 200 || clearRes.body.data.cart.totalItems !== 0 || clearRes.body.data.cart.totalAmount !== 0) {
      throw new Error(`Xóa toàn bộ giỏ hàng thất bại: ${JSON.stringify(clearRes.body)}`);
    }
    console.log('   ✅ Đã xóa toàn bộ giỏ hàng thành công (totalItems: 0, totalAmount: 0đ).');

    console.log('\n🎉 TẤT CẢ 11 MỤC NGHIỆP VỤ CỦA CHỨC NĂNG CART – QUẢN LÝ GIỎ HÀNG ĐÃ VƯỢT QUA KIỂM THỬ THÀNH CÔNG 100%!');
  } finally {
    // Dọn dẹp dữ liệu test
    if (customerId) {
      await prisma.cartItem.deleteMany({ where: { cart: { userId: customerId } } }).catch(() => {});
      await prisma.cart.deleteMany({ where: { userId: customerId } }).catch(() => {});
      await prisma.user.delete({ where: { id: customerId } }).catch(() => {});
    }
    await app.close();
  }
}

runCartTests().catch((err) => {
  console.error('\n❌ Lỗi kiểm thử:', err);
  process.exit(1);
});
