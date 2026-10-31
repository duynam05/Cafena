import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Đang khởi tạo dữ liệu mẫu (Seeding) ---');

  // 1. Tạo tài khoản Admin, Staff và Customer mẫu
  const adminPassword = await bcrypt.hash('admin123', 10);
  const staffPassword = await bcrypt.hash('staff123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@cafena.vn' },
    update: {},
    create: {
      email: 'admin@cafena.vn',
      password: adminPassword,
      fullName: 'Quản Trị Viên Hệ Thống',
      phone: '0901112222',
      address: 'Trụ sở Cafena, Hà Nội',
      role: Role.ADMIN,
      isEmailVerified: true,
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@cafena.vn' },
    update: {},
    create: {
      email: 'staff@cafena.vn',
      password: staffPassword,
      fullName: 'Nhân Viên Bán Hàng',
      phone: '0903334444',
      address: 'Chi nhánh Cafena TP.HCM',
      role: Role.STAFF,
      isEmailVerified: true,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@cafena.vn' },
    update: {},
    create: {
      email: 'customer@cafena.vn',
      password: customerPassword,
      fullName: 'Khách Hàng Thân Thiết',
      phone: '0905556666',
      address: '123 Đường Cà Phê, Quận 1, TP.HCM',
      role: Role.CUSTOMER,
      isEmailVerified: true,
      cart: {
        create: {},
      },
    },
  });

  console.log('Tạo người dùng mẫu thành công:');
  console.log(' - Admin: admin@cafena.vn / admin123');
  console.log(' - Staff: staff@cafena.vn / staff123');
  console.log(' - Customer: customer@cafena.vn / customer123');

  // 2. Tạo danh mục cà phê mẫu
  const catArabica = await prisma.category.upsert({
    where: { slug: 'ca-phe-arabica' },
    update: {},
    create: {
      name: 'Cà phê Arabica',
      slug: 'ca-phe-arabica',
      description: 'Dòng cà phê hương thơm quyến rũ, vị chua thanh tinh tế',
    },
  });

  const catRobusta = await prisma.category.upsert({
    where: { slug: 'ca-phe-robusta' },
    update: {},
    create: {
      name: 'Cà phê Robusta',
      slug: 'ca-phe-robusta',
      description: 'Dòng cà phê đậm đà, hàm lượng cafein cao, hậu vị ngọt',
    },
  });

  const catBlend = await prisma.category.upsert({
    where: { slug: 'ca-phe-blend' },
    update: {},
    create: {
      name: 'Cà phê Phối Trộn (Blend)',
      slug: 'ca-phe-blend',
      description: 'Sự hòa quyện cân bằng tuyệt hảo giữa Arabica và Robusta',
    },
  });

  // 3. Tạo sản phẩm mẫu có đầy đủ thuộc tính AI
  const sampleProducts = [
    {
      ProductID: 'CF-0001',
      ProductName: 'Arabica Cầu Đất Thượng Hạng',
      PathImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
      ProductType: 'Hạt rang mộc',
      Quantity: 150,
      Unit: 'gói 250g',
      Price: 145000,
      Description: 'Được tuyển chọn từ những trái chín mọng tại vùng Cầu Đất - Đà Lạt. Vị chua thanh tao nhã, hậu vị ngọt ngào sâu lắng.',
      roastLevel: 'Medium',
      flavorNotes: 'Hương hoa, Cam chanh, Mật ong, Caramel',
      origin: 'Cầu Đất, Đà Lạt',
      categoryId: catArabica.id,
    },
    {
      ProductID: 'CF-0002',
      ProductName: 'Robusta Buôn Ma Thuột Đậm Gu',
      PathImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
      ProductType: 'Bột pha phin',
      Quantity: 200,
      Unit: 'gói 500g',
      Price: 110000,
      Description: 'Cà phê Robusta đậm chất Tây Nguyên, hương thơm nồng đượm, vị đắng mạnh mẽ phù hợp pha phin truyền thống.',
      roastLevel: 'Dark',
      flavorNotes: 'Socola đen, Hạt dẻ nướng, Khói gỗ, Đường cháy',
      origin: 'Buôn Ma Thuột, Đắk Lắk',
      categoryId: catRobusta.id,
    },
    {
      ProductID: 'CF-0003',
      ProductName: 'Cafena Signature Blend (70/30)',
      PathImage: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
      ProductType: 'Hạt rang mộc',
      Quantity: 120,
      Unit: 'gói 250g',
      Price: 135000,
      Description: 'Công thức phối trộn độc quyền giữa 70% Arabica Cầu Đất và 30% Robusta Buôn Ma Thuột, mang lại tách cà phê cân bằng hoàn hảo.',
      roastLevel: 'Medium-Dark',
      flavorNotes: 'Socola sữa, Hạnh nhân, Caramel ngậy',
      origin: 'Lâm Đồng & Đắk Lắk',
      categoryId: catBlend.id,
    },
    {
      ProductID: 'CF-0004',
      ProductName: 'Arabica Bourbon Honey Process',
      PathImage: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800',
      ProductType: 'Hạt rang mộc',
      Quantity: 80,
      Unit: 'gói 250g',
      Price: 180000,
      Description: 'Quy trình sơ chế Honey giữ trọn lớp đường tự nhiên quanh hạt thóc. Thể chất tròn đầy, hương vị trái cây nhiệt đới nổi bật.',
      roastLevel: 'Light',
      flavorNotes: 'Đào, Mận chín, Mật ong hoa rừng, Trà đen',
      origin: 'Trạm Hành, Đà Lạt',
      categoryId: catArabica.id,
    },
    {
      ProductID: 'CF-0005',
      ProductName: 'Cold Brew Blend Tươi Mát',
      PathImage: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
      ProductType: 'Cà phê ủ lạnh',
      Quantity: 95,
      Unit: 'gói 200g',
      Price: 125000,
      Description: 'Dành riêng cho phong cách ngâm ủ lạnh Cold Brew, chiết xuất vị ngọt thanh, hàm lượng axit thấp, giải khát sảng khoái.',
      roastLevel: 'Medium',
      flavorNotes: 'Cam vàng, Berry, Vani, Bơ đậu phộng',
      origin: 'Đà Lạt',
      categoryId: catBlend.id,
    },
  ];

  for (const prod of sampleProducts) {
    await prisma.product.upsert({
      where: { ProductID: prod.ProductID },
      update: {},
      create: prod,
    });
  }

  console.log(`Đã khởi tạo thành công ${sampleProducts.length} sản phẩm mẫu!`);
  console.log('--- Hoàn tất Seeding ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
