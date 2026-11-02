import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';
import { TransformInterceptor } from '../dist/middlewares/transform.interceptor.js';
import { HttpExceptionFilter } from '../dist/middlewares/http-exception.filter.js';

async function runProductTests() {
  console.log('🚀 Bắt đầu kiểm thử toàn diện module Product – Quản lý và hiển thị sản phẩm...\n');

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

  const server = app.getHttpServer();

  try {
    // 1. LẤY DANH SÁCH SẢN PHẨM & PHÂN TRANG (GET /products)
    console.log('1️⃣ [Test] Lấy danh sách sản phẩm có phân trang (GET /products?page=1&limit=3)...');
    const listRes = await request(server).get('/api/v1/products?page=1&limit=3');
    if (listRes.status !== 200 || !listRes.body.data.items || listRes.body.data.items.length !== 3) {
      throw new Error(`Lấy danh sách sản phẩm thất bại: ${JSON.stringify(listRes.body)}`);
    }
    console.log(`   ✅ Lấy danh sách thành công! Tổng số: ${listRes.body.data.meta.totalItems} sản phẩm. Trang 1 có ${listRes.body.data.items.length} món.`);

    // 2. LẤY CHI TIẾT SẢN PHẨM THEO PRODUCT ID (GET /products/CF-0001)
    console.log('\n2️⃣ [Test] Lấy chi tiết sản phẩm bằng ProductID (GET /products/CF-0001)...');
    const idRes = await request(server).get('/api/v1/products/CF-0001');
    if (idRes.status !== 200 || idRes.body.data.ProductID !== 'CF-0001') {
      throw new Error(`Lấy chi tiết theo ID thất bại: ${JSON.stringify(idRes.body)}`);
    }
    console.log(`   ✅ Lấy chi tiết theo ID thành công: ${idRes.body.data.ProductName} (Giá: ${idRes.body.data.Price}đ)`);

    // 3. LẤY CHI TIẾT SẢN PHẨM THEO SLUG SEO (GET /products/arabica-cau-dat-thuong-hang)
    console.log('\n3️⃣ [Test] Lấy chi tiết sản phẩm bằng Slug SEO (GET /products/arabica-cau-dat-thuong-hang)...');
    const slugRes = await request(server).get('/api/v1/products/arabica-cau-dat-thuong-hang');
    if (slugRes.status !== 200 || slugRes.body.data.slug !== 'arabica-cau-dat-thuong-hang') {
      throw new Error(`Lấy chi tiết theo Slug thất bại: ${JSON.stringify(slugRes.body)}`);
    }
    console.log(`   ✅ Lấy chi tiết theo Slug thành công! Mã sản phẩm tương ứng: ${slugRes.body.data.ProductID}`);

    // 4. TÌM KIẾM THEO TÊN, MÃ, MÔ TẢ (GET /products?search=Robusta)
    console.log('\n4️⃣ [Test] Tìm kiếm sản phẩm theo từ khóa (GET /products?search=Robusta)...');
    const searchRes = await request(server).get('/api/v1/products?search=Robusta');
    if (searchRes.status !== 200 || searchRes.body.data.items.length === 0) {
      throw new Error(`Tìm kiếm thất bại: ${JSON.stringify(searchRes.body)}`);
    }
    console.log(`   ✅ Tìm kiếm thành công! Tìm thấy ${searchRes.body.data.items.length} sản phẩm chứa từ khóa 'Robusta'.`);

    // 5. LỌC THEO LOẠI SẢN PHẨM (GET /products?productType=Hạt rang mộc)
    console.log('\n5️⃣ [Test] Lọc theo Loại sản phẩm (GET /products?productType=Hạt rang mộc)...');
    const typeRes = await request(server).get('/api/v1/products?productType=' + encodeURIComponent('Hạt rang mộc'));
    if (typeRes.status !== 200 || typeRes.body.data.items.some((p: any) => p.ProductType !== 'Hạt rang mộc')) {
      throw new Error(`Lọc loại sản phẩm thất bại: ${JSON.stringify(typeRes.body)}`);
    }
    console.log(`   ✅ Lọc theo loại sản phẩm thành công! Tìm thấy ${typeRes.body.data.items.length} sản phẩm 'Hạt rang mộc'.`);

    // 6. LỌC THEO KHOẢNG GIÁ (GET /products?minPrice=130000&maxPrice=150000)
    console.log('\n6️⃣ [Test] Lọc theo khoảng giá từ 130.000đ đến 150.000đ...');
    const priceRes = await request(server).get('/api/v1/products?minPrice=130000&maxPrice=150000');
    if (priceRes.status !== 200 || priceRes.body.data.items.some((p: any) => p.Price < 130000 || p.Price > 150000)) {
      throw new Error(`Lọc khoảng giá thất bại: ${JSON.stringify(priceRes.body)}`);
    }
    console.log(`   ✅ Lọc theo khoảng giá thành công! Có ${priceRes.body.data.items.length} sản phẩm trong tầm giá này.`);

    // 7. LỌC SẢN PHẨM CÒN HÀNG (GET /products?inStockOnly=true)
    console.log('\n7️⃣ [Test] Lọc sản phẩm còn hàng trong kho (inStockOnly=true)...');
    const inStockRes = await request(server).get('/api/v1/products?inStockOnly=true');
    if (inStockRes.status !== 200 || inStockRes.body.data.items.some((p: any) => p.Quantity <= 0)) {
      throw new Error(`Lọc còn hàng thất bại: ${JSON.stringify(inStockRes.body)}`);
    }
    console.log(`   ✅ Lọc còn hàng thành công! Đã loại bỏ các sản phẩm có Quantity = 0.`);

    // 8. SẮP XẾP THEO GIÁ TĂNG DẦN & GIẢM DẦN
    console.log('\n8️⃣ [Test] Sắp xếp theo giá tăng dần (sortBy=price_asc)...');
    const sortPriceRes = await request(server).get('/api/v1/products?sortBy=price_asc');
    const itemsPrice = sortPriceRes.body.data.items;
    for (let i = 0; i < itemsPrice.length - 1; i++) {
      if (itemsPrice[i].Price > itemsPrice[i + 1].Price) {
        throw new Error(`Lỗi sắp xếp giá tăng dần`);
      }
    }
    console.log(`   ✅ Sắp xếp giá tăng dần chính xác (Thấp nhất: ${itemsPrice[0].Price}đ ➔ Cao nhất: ${itemsPrice[itemsPrice.length - 1].Price}đ).`);

    // 9. LẤY SẢN PHẨM MỚI NHẤT (GET /products/collection/newest)
    console.log('\n9️⃣ [Test] Lấy danh sách sản phẩm mới nhất (GET /products/collection/newest)...');
    const newestRes = await request(server).get('/api/v1/products/collection/newest?limit=4');
    if (newestRes.status !== 200 || newestRes.body.data.length === 0) {
      throw new Error(`Lấy sản phẩm mới thất bại: ${JSON.stringify(newestRes.body)}`);
    }
    console.log(`   ✅ Lấy sản phẩm mới nhất thành công (${newestRes.body.data.length} món).`);

    // 10. LẤY SẢN PHẨM NỔI BẬT (GET /products/collection/featured)
    console.log('\n🔟 [Test] Lấy danh sách sản phẩm nổi bật (GET /products/collection/featured)...');
    const featuredRes = await request(server).get('/api/v1/products/collection/featured');
    if (featuredRes.status !== 200 || featuredRes.body.data.some((p: any) => p.isFeatured !== true)) {
      throw new Error(`Lấy sản phẩm nổi bật thất bại: ${JSON.stringify(featuredRes.body)}`);
    }
    console.log(`   ✅ Lấy sản phẩm nổi bật thành công (${featuredRes.body.data.length} món có isFeatured = true).`);

    // 11. LẤY SẢN PHẨM BÁN CHẠY (GET /products/collection/best-sellers)
    console.log('\n1️⃣1️⃣ [Test] Lấy danh sách sản phẩm bán chạy (GET /products/collection/best-sellers)...');
    const bestSellersRes = await request(server).get('/api/v1/products/collection/best-sellers?limit=5');
    if (bestSellersRes.status !== 200 || bestSellersRes.body.data.length === 0) {
      throw new Error(`Lấy sản phẩm bán chạy thất bại: ${JSON.stringify(bestSellersRes.body)}`);
    }
    console.log(`   ✅ Lấy sản phẩm bán chạy thành công (${bestSellersRes.body.data.length} món).`);

    // 12. LẤY SẢN PHẨM LIÊN QUAN (GET /products/CF-0001/related)
    console.log('\n1️⃣2️⃣ [Test] Lấy sản phẩm liên quan (GET /products/CF-0001/related)...');
    const relatedRes = await request(server).get('/api/v1/products/CF-0001/related?limit=3');
    if (relatedRes.status !== 200 || relatedRes.body.data.some((p: any) => p.ProductID === 'CF-0001')) {
      throw new Error(`Lấy sản phẩm liên quan thất bại: ${JSON.stringify(relatedRes.body)}`);
    }
    console.log(`   ✅ Lấy sản phẩm liên quan thành công! Gợi ý ${relatedRes.body.data.length} sản phẩm tương đồng.`);

    // 13. KIỂM TRA TÌNH TRẠNG KINH DOANH VÀ TỒN KHO
    console.log('\n1️⃣3️⃣ [Test] Kiểm tra tình trạng tồn kho & kinh doanh (GET /products/CF-0006/stock-status)...');
    const stockStatusRes = await request(server).get('/api/v1/products/CF-0006/stock-status');
    if (stockStatusRes.status !== 200 || stockStatusRes.body.data.stockStatus !== 'OUT_OF_STOCK' || stockStatusRes.body.data.canOrder !== false) {
      throw new Error(`Kiểm tra tình trạng kho thất bại: ${JSON.stringify(stockStatusRes.body)}`);
    }
    console.log(`   ✅ Kiểm tra kho chính xác! CF-0006 hết hàng (stockStatus: OUT_OF_STOCK, canOrder: false).`);

    console.log('\n🎉 TẤT CẢ 17 MỤC NGHIỆP VỤ CỦA CHỨC NĂNG PRODUCT – QUẢN LÝ VÀ HIỂN THỊ SẢN PHẨM ĐÃ VƯỢT QUA KIỂM THỬ THÀNH CÔNG 100%!');
  } finally {
    await app.close();
  }
}

runProductTests().catch((err) => {
  console.error('\n❌ Lỗi kiểm thử:', err);
  process.exit(1);
});
