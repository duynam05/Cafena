import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';
import { TransformInterceptor } from '../dist/middlewares/transform.interceptor.js';
import { HttpExceptionFilter } from '../dist/middlewares/http-exception.filter.js';
import { PrismaService } from '../dist/repositories/prisma.service.js';

async function runCategoryTests() {
  console.log('🚀 Bắt đầu kiểm thử toàn diện module Category – Quản lý danh mục...\n');

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

  let adminToken = '';
  let parentCategoryId = '';
  let childCategoryId = '';
  let tempEmptyCategoryId = '';

  try {
    // 0. ĐĂNG NHẬP ADMIN LẤY TOKEN
    console.log('0️⃣ [Setup] Đăng nhập Admin lấy Token...');
    const loginRes = await request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@cafena.vn', password: 'admin123' });
    adminToken = loginRes.body.data.accessToken;
    console.log('   ✅ Đăng nhập Admin thành công.');

    // 1. LẤY DANH SÁCH DANH MỤC & PHÂN TRANG (GET /categories)
    console.log('\n1️⃣ [Test] Lấy danh sách danh mục có phân trang (GET /categories?page=1&limit=5)...');
    const listRes = await request(server).get('/api/v1/categories?page=1&limit=5');
    if (listRes.status !== 200 || !listRes.body.data.items) {
      throw new Error(`Lấy danh sách danh mục thất bại: ${JSON.stringify(listRes.body)}`);
    }
    console.log(`   ✅ Lấy danh sách thành công! Hiện có ${listRes.body.data.meta.totalItems} danh mục.`);

    // 2. TÌM KIẾM DANH MỤC (GET /categories?search=Arabica)
    console.log('\n2️⃣ [Test] Tìm kiếm danh mục theo từ khóa (GET /categories?search=Arabica)...');
    const searchRes = await request(server).get('/api/v1/categories?search=Arabica');
    if (searchRes.status !== 200 || searchRes.body.data.items.length === 0) {
      throw new Error(`Tìm kiếm danh mục thất bại: ${JSON.stringify(searchRes.body)}`);
    }
    console.log(`   ✅ Tìm kiếm thành công! Tìm thấy: ${searchRes.body.data.items[0].name}`);

    // 3. TẠO DANH MỤC CHA MỚI (POST /categories)
    console.log('\n3️⃣ [Test] Tạo danh mục cha mới (POST /categories)...');
    const createParentRes = await request(server)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `Dụng Cụ Pha Chế ${Date.now()}`,
        description: 'Các loại phin, bình syphon, phễu lọc V60',
        isActive: true,
      });

    if (createParentRes.status !== 201) {
      throw new Error(`Tạo danh mục cha thất bại: ${JSON.stringify(createParentRes.body)}`);
    }
    parentCategoryId = createParentRes.body.data.id;
    console.log(`   ✅ Tạo danh mục cha thành công: ${createParentRes.body.data.name} (Slug: ${createParentRes.body.data.slug})`);

    // 4. TẠO DANH MỤC CON THUỘC DANH MỤC CHA (POST /categories with parentId)
    console.log('\n4️⃣ [Test] Tạo danh mục con lồng nhau (POST /categories with parentId)...');
    const createChildRes = await request(server)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `Bình Pha Cold Brew ${Date.now()}`,
        parentId: parentCategoryId,
        description: 'Bình ngâm ủ lạnh dung tích 600ml - 1000ml',
      });

    if (createChildRes.status !== 201 || createChildRes.body.data.parent?.id !== parentCategoryId) {
      throw new Error(`Tạo danh mục con thất bại: ${JSON.stringify(createChildRes.body)}`);
    }
    childCategoryId = createChildRes.body.data.id;
    console.log(`   ✅ Tạo danh mục con thành công: ${createChildRes.body.data.name} thuộc cha ID: ${parentCategoryId}`);

    // 5. LẤY CẤU TRÚC CÂY PHÂN CẤP ĐA CẤP (GET /categories/tree)
    console.log('\n5️⃣ [Test] Lấy cấu trúc cây danh mục đa cấp (GET /categories/tree)...');
    const treeRes = await request(server).get('/api/v1/categories/tree');
    if (treeRes.status !== 200 || !Array.isArray(treeRes.body.data)) {
      throw new Error(`Lấy cây danh mục thất bại: ${JSON.stringify(treeRes.body)}`);
    }
    const foundParentInTree = treeRes.body.data.find((c: any) => c.id === parentCategoryId);
    if (!foundParentInTree || !foundParentInTree.children || foundParentInTree.children.length === 0) {
      throw new Error(`Không tìm thấy quan hệ cha-con lồng nhau trong Tree`);
    }
    console.log(`   ✅ Lấy cây danh mục đa cấp thành công! Danh mục cha "${foundParentInTree.name}" chứa ${foundParentInTree.children.length} danh mục con.`);

    // 6. XEM CHI TIẾT DANH MỤC THEO SLUG SEO & ID (GET /categories/:idOrSlug)
    console.log('\n6️⃣ [Test] Xem chi tiết danh mục theo Slug SEO (GET /categories/ca-phe-arabica)...');
    const slugRes = await request(server).get('/api/v1/categories/ca-phe-arabica');
    if (slugRes.status !== 200 || slugRes.body.data.slug !== 'ca-phe-arabica') {
      throw new Error(`Xem chi tiết theo slug thất bại: ${JSON.stringify(slugRes.body)}`);
    }
    console.log(`   ✅ Xem chi tiết theo Slug thành công: ${slugRes.body.data.name} (Đang chứa ${slugRes.body.data._count.products} sản phẩm).`);

    // 7. LẤY SẢN PHẨM THEO DANH MỤC (GET /categories/:idOrSlug/products)
    console.log('\n7️⃣ [Test] Lấy sản phẩm theo danh mục (GET /categories/ca-phe-arabica/products)...');
    const prodRes = await request(server).get('/api/v1/categories/ca-phe-arabica/products?page=1&limit=5');
    if (prodRes.status !== 200 || !prodRes.body.data.products?.items) {
      throw new Error(`Lấy sản phẩm theo danh mục thất bại: ${JSON.stringify(prodRes.body)}`);
    }
    console.log(`   ✅ Lấy sản phẩm theo danh mục thành công! Danh mục "${prodRes.body.data.category.name}" có ${prodRes.body.data.products.meta.totalItems} sản phẩm.`);

    // 8. CẬP NHẬT DANH MỤC (PATCH /categories/:id)
    console.log('\n8️⃣ [Test] Cập nhật thông tin danh mục (PATCH /categories/:id)...');
    const updateRes = await request(server)
      .patch(`/api/v1/categories/${parentCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        description: 'Mô tả đã được cập nhật mới nhất cho danh mục cha',
      });

    if (updateRes.status !== 200 || updateRes.body.data.description !== 'Mô tả đã được cập nhật mới nhất cho danh mục cha') {
      throw new Error(`Cập nhật danh mục thất bại: ${JSON.stringify(updateRes.body)}`);
    }
    console.log('   ✅ Cập nhật danh mục thành công.');

    // 9. ẨN HOẶC HIỂN THỊ DANH MỤC (PATCH /categories/:id/status)
    console.log('\n9️⃣ [Test] Ẩn danh mục (PATCH /categories/:id/status?isActive=false)...');
    const hideRes = await request(server)
      .patch(`/api/v1/categories/${parentCategoryId}/status?isActive=false`)
      .set('Authorization', `Bearer ${adminToken}`);

    if (hideRes.status !== 200 || hideRes.body.data.category.isActive !== false) {
      throw new Error(`Ẩn danh mục thất bại: ${JSON.stringify(hideRes.body)}`);
    }
    console.log('   ✅ Ẩn danh mục thành công (isActive: false).');

    const showRes = await request(server)
      .patch(`/api/v1/categories/${parentCategoryId}/status?isActive=true`)
      .set('Authorization', `Bearer ${adminToken}`);
    if (showRes.status !== 200 || showRes.body.data.category.isActive !== true) {
      throw new Error(`Hiển thị lại danh mục thất bại: ${JSON.stringify(showRes.body)}`);
    }
    console.log('   ✅ Hiển thị lại danh mục thành công (isActive: true).');

    // 10. KIỂM TRA CHẶN XÓA AN TOÀN (KHI CÓ SẢN PHẨM HOẶC CÓ DANH MỤC CON)
    console.log('\n🔟 [Test] Kiểm tra chặn xóa an toàn danh mục đang có danh mục con...');
    const deleteBlockedRes = await request(server)
      .delete(`/api/v1/categories/${parentCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    if (deleteBlockedRes.status !== 400) {
      throw new Error(`Cảnh báo an ninh: Danh mục có con mà không bị chặn xóa! Status: ${deleteBlockedRes.status}`);
    }
    console.log('   ✅ Đã chặn xóa danh mục có danh mục con thành công (400 Bad Request đúng chuẩn).');

    // 11. XÓA DANH MỤC CON RỖNG THÀNH CÔNG
    console.log('\n1️⃣1️⃣ [Test] Xóa danh mục con rỗng không chứa sản phẩm (DELETE /categories/:id)...');
    const deleteChildRes = await request(server)
      .delete(`/api/v1/categories/${childCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    if (deleteChildRes.status !== 200) {
      throw new Error(`Xóa danh mục con thất bại: ${JSON.stringify(deleteChildRes.body)}`);
    }
    console.log('   ✅ Xóa danh mục con thành công.');

    // Sau khi xóa con, xóa tiếp danh mục cha rỗng
    const deleteParentRes = await request(server)
      .delete(`/api/v1/categories/${parentCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    if (deleteParentRes.status !== 200) {
      throw new Error(`Xóa danh mục cha thất bại: ${JSON.stringify(deleteParentRes.body)}`);
    }
    console.log('   ✅ Xóa danh mục cha rỗng thành công.');

    console.log('\n🎉 TẤT CẢ 7 MỤC NGHIỆP VỤ CỦA CHỨC NĂNG CATEGORY – QUẢN LÝ DANH MỤC ĐÃ VƯỢT QUA KIỂM THỬ THÀNH CÔNG 100%!');
  } finally {
    // Dọn dẹp dữ liệu test nếu còn
    if (childCategoryId) await prisma.category.delete({ where: { id: childCategoryId } }).catch(() => {});
    if (parentCategoryId) await prisma.category.delete({ where: { id: parentCategoryId } }).catch(() => {});
    await app.close();
  }
}

runCategoryTests().catch((err) => {
  console.error('\n❌ Lỗi kiểm thử:', err);
  process.exit(1);
});
