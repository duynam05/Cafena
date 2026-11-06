# Cafena Coffee - Backend REST API (Node.js + NestJS + PostgreSQL + Prisma)

Hệ thống Backend quản lý và kinh doanh cà phê trực tuyến (lấy cảm hứng từ thương hiệu Cafena Coffee), được thiết kế chuẩn theo mô hình **MVC kết hợp Service & Repository Pattern**, đáp ứng đầy đủ yêu cầu nghiệp vụ của đề tài.

---

## ☕ 1. Cấu Trúc Thư Mục Chuẩn (MVC + Service + Repository)

Toàn bộ mã nguồn `src` được tổ chức phân tầng rõ ràng theo đúng yêu cầu:

```
Backend/src/
├── config/                  # Quản lý cấu hình hệ thống (port, database, jwt, ai service)
│   └── configuration.ts
├── models/                  # Định nghĩa các Data Model / Entity Interfaces
│   └── index.ts
├── controllers/             # Tầng tiếp nhận HTTP Request & định tuyến REST API
│   ├── product.controller.ts
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── category.controller.ts
│   ├── order.controller.ts
│   ├── inventory.controller.ts
│   ├── statistics.controller.ts
│   ├── ai-recommendation.controller.ts
│   ├── app.controller.ts
│   └── index.ts
├── services/                # Tầng nghiệp vụ (Business Logic)
│   ├── product.service.ts
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── category.service.ts
│   ├── order.service.ts
│   ├── inventory.service.ts
│   ├── statistics.service.ts
│   ├── ai-recommendation.service.ts
│   ├── app.service.ts
│   └── index.ts
├── repositories/            # Tầng truy xuất CSDL (Data Access Layer - Repository Pattern)
│   ├── prisma.service.ts
│   ├── product.repository.ts
│   ├── user.repository.ts
│   ├── category.repository.ts
│   ├── order.repository.ts
│   ├── inventory.repository.ts
│   └── index.ts
├── dto/                     # Data Transfer Objects & Validation (class-validator)
│   ├── pagination.dto.ts
│   ├── product.dto.ts
│   ├── auth.dto.ts
│   ├── user.dto.ts
│   ├── category.dto.ts
│   ├── order.dto.ts
│   ├── inventory.dto.ts
│   └── ai-recommendation.dto.ts
├── middlewares/             # Filters xử lý lỗi và Interceptor chuẩn hóa response
│   ├── http-exception.filter.ts
│   ├── transform.interceptor.ts
│   └── logger.middleware.ts
├── guards/                  # Bảo vệ route bằng JWT & phân quyền vai trò (RBAC)
│   ├── jwt-auth.guard.ts
│   ├── roles.guard.ts
│   ├── jwt.strategy.ts
│   ├── public.decorator.ts
│   ├── roles.decorator.ts
│   ├── current-user.decorator.ts
│   └── index.ts
├── utils/                   # Các tiện ích bổ trợ (Excel, XML, Phân trang)
│   ├── excel.util.ts
│   ├── xml.util.ts
│   └── pagination.util.ts
├── app.module.ts            # Root Module đăng ký toàn bộ Controller, Service, Repository
└── main.ts                  # Điểm khởi chạy (Swagger, CORS, Interceptor, Validation)
```

---

## 🔐 2. Chức Năng 1: Authentication & Authorization (Xác Thực & Phân Quyền)

Hệ thống cung cấp đầy đủ 12 yêu cầu xác thực và phân quyền RBAC:

| STT | Yêu cầu nghiệp vụ | Trạng thái | Endpoint RESTful API | Ghi chú |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Đăng ký tài khoản khách hàng | ✅ Hoàn thành | `POST /api/v1/auth/register` | Tự động tạo giỏ hàng rỗng, gửi mã OTP & link xác minh email |
| **2** | Đăng nhập email & mật khẩu | ✅ Hoàn thành | `POST /api/v1/auth/login` | Trả về thông tin user + cặp `accessToken` & `refreshToken` |
| **3** | Đăng xuất | ✅ Hoàn thành | `POST /api/v1/auth/logout` | Vô hiệu hóa `hashedRefreshToken` trong CSDL |
| **4** | Xác thực JWT Access Token | ✅ Hoàn thành | `Bearer <accessToken>` | Sử dụng `JwtAuthGuard`, payload `sub`, `email`, `role` |
| **5** | Làm mới Access Token | ✅ Hoàn thành | `POST /api/v1/auth/refresh` | Cơ chế Refresh Token Rotation, so khớp mã băm trong DB |
| **6** | Quên mật khẩu | ✅ Hoàn thành | `POST /api/v1/auth/forgot-password` | Tạo OTP 6 số (15p) & secure link token gửi qua mail |
| **7** | Gửi OTP / Link qua Email | ✅ Hoàn thành | Tích hợp MailService | Gửi qua Nodemailer SMTP; ở Dev Mode in log trực tiếp ra Terminal |
| **8** | Đặt lại mật khẩu | ✅ Hoàn thành | `POST /api/v1/auth/reset-password`<br>`POST /api/v1/auth/reset-password-otp` | Hỗ trợ cả 2 cách: qua đường Link hoặc nhập trực tiếp mã OTP 6 số |
| **9** | Xác minh email | ✅ Hoàn thành | `POST /api/v1/auth/verify-email`<br>`POST /api/v1/auth/verify-email-otp`<br>`POST /api/v1/auth/resend-verification` | Kích hoạt `isEmailVerified = true` qua Link hoặc mã OTP |
| **10** | Kiểm tra trạng thái tài khoản | ✅ Hoàn thành | `GET /api/v1/auth/check-status`<br>`GET /api/v1/auth/profile` | Chặn đăng nhập & gọi API ngay lập tức nếu `isActive = false` |
| **11** | Phân quyền RBAC | ✅ Hoàn thành | Roles: `CUSTOMER`, `STAFF`, `ADMIN` | Sử dụng enum `Role` trong Prisma CSDL |
| **12** | Kiểm tra quyền truy cập API | ✅ Hoàn thành | `@Roles(...)` + `RolesGuard` | Chặn truy cập trái quyền (403 Forbidden) cho từng endpoint |

```bash
# Lệnh chạy kiểm thử tự động toàn bộ 12 mục chức năng Authentication:
npm run test:auth
```

---

## 👤 3. Chức Năng 2: User – Quản Lý Tài Khoản

Cung cấp đầy đủ các API quản lý tài khoản cá nhân, danh bạ địa chỉ giao hàng và theo dõi đơn hàng:

| STT | Yêu cầu nghiệp vụ | Trạng thái | Endpoint RESTful API | Ghi chú |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Lấy thông tin tài khoản hiện tại | ✅ Hoàn thành | `GET /api/v1/users/profile` | Kèm danh sách địa chỉ đã lưu và số lượng đơn hàng |
| **2** | Cập nhật họ tên, email, số điện thoại | ✅ Hoàn thành | `PATCH /api/v1/users/profile` | Nếu đổi email mới: kiểm tra trùng lặp, chuyển `isEmailVerified=false` và tự động gửi mã OTP xác thực lại |
| **3** | Cập nhật ảnh đại diện (Avatar) | ✅ Hoàn thành | `PATCH /api/v1/users/profile/avatar` | Tải lên tệp ảnh (Multer, max 5MB, JPG/PNG/WEBP), tự động dọn dẹp file cũ |
| **4** | Thay đổi mật khẩu | ✅ Hoàn thành | `POST /api/v1/users/profile/change-password` | Kiểm tra mật khẩu cũ, hash mật khẩu mới và thu hồi Refresh Token cũ |
| **5** | Xem danh sách địa chỉ giao hàng | ✅ Hoàn thành | `GET /api/v1/users/addresses` | Tự động sắp xếp địa chỉ mặc định lên đầu |
| **6** | Thêm địa chỉ giao hàng mới | ✅ Hoàn thành | `POST /api/v1/users/addresses` | Nếu là địa chỉ đầu tiên, tự động gán làm mặc định (`isDefault=true`) |
| **7** | Cập nhật địa chỉ giao hàng | ✅ Hoàn thành | `PATCH /api/v1/users/addresses/:id` | Cho phép sửa họ tên người nhận, SĐT, số nhà, phường/xã, quận/huyện |
| **8** | Xóa địa chỉ giao hàng | ✅ Hoàn thành | `DELETE /api/v1/users/addresses/:id` | Nếu xóa địa chỉ mặc định, tự động chuyển địa chỉ còn lại làm mặc định |
| **9** | Thiết lập địa chỉ mặc định | ✅ Hoàn thành | `PATCH /api/v1/users/addresses/:id/default` | Hủy mặc định của các địa chỉ cũ và gán địa chỉ này làm mặc định |
| **10** | Xem lịch sử mua hàng của bản thân | ✅ Hoàn thành | `GET /api/v1/users/orders` | Hỗ trợ phân trang (`page`, `limit`) và bộ lọc theo trạng thái (`status`) |
| **11** | Xem chi tiết đơn hàng của bản thân | ✅ Hoàn thành | `GET /api/v1/users/orders/:id` | Kiểm tra quyền sở hữu đơn hàng (chỉ xem được đơn của chính mình) |

```bash
# Lệnh chạy kiểm thử tự động toàn bộ chức năng User:
npm run test:user
```

---

## ☕ 4. Chức Năng 3: Product – Quản Lý và Hiển Thị Sản Phẩm

Thực thể **Product**: `ProductID`, `ProductName`, `slug`, `PathImage`, `images`, `ProductType`, `Quantity`, `Unit`, `Price`, `Description`, `isActive`, `roastLevel`, `flavorNotes`, `origin`, `isFeatured`, `CreateDate`, `UpdateDate`.

| STT | Yêu cầu nghiệp vụ | Trạng thái | Endpoint RESTful API | Ghi chú |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Lấy danh sách sản phẩm | ✅ Hoàn thành | `GET /api/v1/products` | Mặc định phân trang 10–15 sản phẩm mỗi trang |
| **2** | Lấy chi tiết theo ID hoặc Slug | ✅ Hoàn thành | `GET /api/v1/products/:idOrSlug` | Tự động nhận diện cả ProductID (`CF-0001`) và Slug SEO (`arabica-cau-dat`) |
| **3** | Tìm kiếm sản phẩm | ✅ Hoàn thành | `GET /api/v1/products?search=...` | Tìm kiếm không dấu / không phân biệt hoa thường theo tên, mã, mô tả |
| **4** | Lọc theo danh mục | ✅ Hoàn thành | `GET /api/v1/products?categoryId=...`<br>`GET /api/v1/products?categorySlug=...` | Lọc theo ID hoặc Slug đường dẫn danh mục |
| **5** | Lọc theo loại sản phẩm | ✅ Hoàn thành | `GET /api/v1/products?productType=...` | Hạt rang mộc, Bột pha phin, Cà phê ủ lạnh, Dụng cụ pha chế... |
| **6** | Lọc theo khoảng giá | ✅ Hoàn thành | `GET /api/v1/products?minPrice=...&maxPrice=...` | Lọc giá linh hoạt từ min đến max |
| **7** | Lọc sản phẩm còn hàng | ✅ Hoàn thành | `GET /api/v1/products?inStockOnly=true` | Loại bỏ các sản phẩm đã hết hàng trong kho (`Quantity > 0`) |
| **8** | Sắp xếp theo giá tăng/giảm | ✅ Hoàn thành | `GET /api/v1/products?sortBy=price_asc`<br>`GET /api/v1/products?sortBy=price_desc` | Hoặc dùng `sortBy=Price&sortOrder=asc/desc` |
| **9** | Sắp xếp theo ngày tạo | ✅ Hoàn thành | `GET /api/v1/products?sortBy=newest`<br>`GET /api/v1/products?sortBy=oldest` | Mới nhất trước hoặc cũ nhất trước |
| **10** | Sắp xếp theo bán chạy | ✅ Hoàn thành | `GET /api/v1/products?sortBy=best_seller` | Sắp xếp theo số lượng bán ra thực tế từ các đơn hàng |
| **11** | Phân trang sản phẩm | ✅ Hoàn thành | `GET /api/v1/products?page=1&limit=10` | Trả về metadata chuẩn: `page`, `limit`, `totalItems`, `totalPages`, `hasNextPage`, `hasPrevPage` |
| **12** | Lấy sản phẩm mới nhất | ✅ Hoàn thành | `GET /api/v1/products/collection/newest?limit=8` | Phục vụ hiển thị mục "Sản phẩm mới về" ở trang chủ |
| **13** | Lấy sản phẩm nổi bật | ✅ Hoàn thành | `GET /api/v1/products/collection/featured?limit=8` | Phục vụ hiển thị mục "Sản phẩm đặc sắc" (`isFeatured = true`) |
| **14** | Lấy sản phẩm bán chạy nhất | ✅ Hoàn thành | `GET /api/v1/products/collection/best-sellers?limit=8` | Phục vụ hiển thị mục "Best Sellers" |
| **15** | Lấy sản phẩm liên quan | ✅ Hoàn thành | `GET /api/v1/products/:idOrSlug/related?limit=4` | Tự động đối sánh cùng Danh mục & Loại cà phê, loại trừ sản phẩm hiện tại |
| **16** | Lấy ảnh & thuộc tính chi tiết | ✅ Hoàn thành | Trong chi tiết sản phẩm | `images`, `PathImage`, `roastLevel`, `flavorNotes`, `origin`, `Unit` |
| **17** | Kiểm tra tình trạng kho & kinh doanh | ✅ Hoàn thành | `GET /api/v1/products/:idOrSlug/stock-status` | Trả về `stockStatus`: `IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK` và cờ `canOrder` |
| **18** | Thêm mới sản phẩm | ✅ Hoàn thành | `POST /api/v1/products` | Tự động sinh mã `CF-xxxx` và sinh slug chuẩn SEO |
| **19** | Cập nhật sản phẩm | ✅ Hoàn thành | `PATCH /api/v1/products/:id` | Cập nhật thuộc tính và đồng bộ slug mới nếu đổi tên |
| **20** | Xóa sản phẩm đơn & hàng loạt | ✅ Hoàn thành | `DELETE /api/v1/products/:id`<br>`POST /api/v1/products/batch-delete` | Hỗ trợ xóa đơn bản ghi hoặc chọn nhiều bản ghi bằng checkbox |
| **21** | Nhân bản đơn & hàng loạt | ✅ Hoàn thành | `POST /api/v1/products/:id/duplicate`<br>`POST /api/v1/products/batch-duplicate` | Tự động tạo mã và slug mới cho bản sao |
| **22** | Xuất/Nhập dữ liệu | ✅ Hoàn thành | Excel (`.xlsx`), JSON, XML | Hỗ trợ cả 3 định dạng dữ liệu theo yêu cầu đề tài |

```bash
# Lệnh chạy kiểm thử tự động toàn bộ chức năng Product:
npm run test:product
```

---

## 🗂️ 5. Chức Năng 4: Category – Quản Lý Danh Mục

Mô hình **Category**: `id`, `name`, `slug`, `description`, `isActive`, `parentId`, `createdAt`, `updatedAt`. Hỗ trợ quan hệ phân cấp cây đa cấp (Cha -> Con) và chặn xóa an toàn.

| STT | Yêu cầu nghiệp vụ | Trạng thái | Endpoint RESTful API | Ghi chú |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Lấy danh sách danh mục | ✅ Hoàn thành | `GET /api/v1/categories` | Hỗ trợ phân trang, tìm kiếm và lọc theo danh mục cha/con |
| **2** | Lấy chi tiết danh mục | ✅ Hoàn thành | `GET /api/v1/categories/:idOrSlug` | Tự động nhận diện cả UUID và Slug SEO (`ca-phe-arabica`) |
| **3** | Cấu trúc cây danh mục đa cấp | ✅ Hoàn thành | `GET /api/v1/categories/tree` | Trả về cây phân cấp lồng nhau (Cha -> Con) cho Menu Navbar |
| **4** | Lấy sản phẩm theo danh mục | ✅ Hoàn thành | `GET /api/v1/categories/:idOrSlug/products` | Tự động gom cả sản phẩm của danh mục con (`includeChildren=true`) |
| **5** | Tìm kiếm danh mục | ✅ Hoàn thành | `GET /api/v1/categories?search=...` | Quét theo tên, slug và mô tả danh mục |
| **6** | Phân trang danh mục | ✅ Hoàn thành | `GET /api/v1/categories?page=1&limit=10` | Trả về metadata phân trang chuẩn (`totalItems`, `totalPages`, v.v.) |
| **7** | Quản lý danh mục cha & con | ✅ Hoàn thành | `POST /api/v1/categories` (với `parentId`) | Chống vòng lặp phân cấp tổ tiên và tự chọn chính mình |
| **8** | Ẩn hoặc hiển thị danh mục | ✅ Hoàn thành | `PATCH /api/v1/categories/:id/status` | Bật/tắt cờ `isActive: true/false` mà không cần xóa danh mục |
| **9** | Cập nhật danh mục | ✅ Hoàn thành | `PATCH /api/v1/categories/:id` | Cập nhật tên, slug, mô tả, danh mục cha (Admin, Staff) |
| **10** | Chặn xóa an toàn | ✅ Hoàn thành | `DELETE /api/v1/categories/:id` | Chặn xóa (400 Bad Request) nếu đang có sản phẩm hoặc có danh mục con |

```bash
# Lệnh chạy kiểm thử tự động toàn bộ chức năng Category:
npm run test:category
```

---

## 🛒 6. Chức Năng 5: Cart – Quản Lý Giỏ Hàng

Mô hình **Cart** & **CartItem**: Tự động liên kết mỗi khách hàng với 1 giỏ hàng duy nhất (`1-to-1`). Mỗi sản phẩm trong giỏ được kiểm tra tính hợp lệ về giá bán, tình trạng kinh doanh và số lượng tồn kho thực tế.

| STT | Yêu cầu nghiệp vụ | Trạng thái | Endpoint RESTful API | Ghi chú |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Tạo giỏ hàng cho khách hàng | ✅ Hoàn thành | `GET /api/v1/cart` | Tự động tạo giỏ hàng rỗng ngay khi khách hàng truy cập lần đầu |
| **2** | Lấy thông tin giỏ hàng | ✅ Hoàn thành | `GET /api/v1/cart` | Trả về danh sách sản phẩm, số lượng, thành tiền từng món, `stockStatus` và `isAvailable` |
| **3** | Thêm sản phẩm vào giỏ hàng | ✅ Hoàn thành | `POST /api/v1/cart` | Nhận `productId` và `quantity`. Tự động cộng dồn số lượng nếu sản phẩm đã có trong giỏ |
| **4** | Kiểm tra sản phẩm tồn tại | ✅ Hoàn thành | Trong `POST /api/v1/cart` | Chặn và trả về `404 Not Found` nếu mã sản phẩm không tồn tại |
| **5** | Kiểm tra số lượng tồn kho | ✅ Hoàn thành | Trong `POST` & `PATCH` | Chặn và trả về `400 Bad Request` nếu sản phẩm hết hàng hoặc số lượng yêu cầu vượt quá kho |
| **6** | Cập nhật số lượng sản phẩm | ✅ Hoàn thành | `PATCH /api/v1/cart/items/:id` | Nhận `quantity` mới. Tự động xóa món nếu `quantity <= 0` |
| **7** | Xóa một sản phẩm khỏi giỏ | ✅ Hoàn thành | `DELETE /api/v1/cart/items/:id` | Xóa món cụ thể theo `cartItemId` |
| **8** | Xóa toàn bộ giỏ hàng | ✅ Hoàn thành | `DELETE /api/v1/cart` | Dọn sạch tất cả sản phẩm trong giỏ hàng chỉ với 1 thao tác |
| **9** | Tính tổng số lượng sản phẩm | ✅ Hoàn thành | `totalItems` trong Cart | Tự động tính tổng số lượng của toàn bộ các mặt hàng trong giỏ |
| **10** | Tính tổng tiền giỏ hàng | ✅ Hoàn thành | `totalAmount` trong Cart | Tự động nhân đơn giá với số lượng của từng món và cộng dồn |
| **11** | Kiểm tra lại giá & kho trước khi đặt | ✅ Hoàn thành | `GET /api/v1/cart/validate` | Đối chiếu toàn bộ giỏ hàng với CSDL thực tế: cảnh báo nếu có món đổi giá, hết hàng, không đủ kho |

```bash
# Lệnh chạy kiểm thử tự động toàn bộ chức năng Cart:
npm run test:cart
```

---

## 🚀 7. Hướng Dẫn Khởi Chạy

```bash
cd Backend

# 1. Khởi chạy PostgreSQL bằng Docker Compose (nếu chưa có DB cục bộ)
docker compose up -d

# 2. Đồng bộ CSDL và khởi tạo dữ liệu mẫu
npx prisma db push
npm run build

# 3. Chạy server ở chế độ Development
npm run start:dev
```

* **Swagger API Documentation**: `http://localhost:3000/api/docs`
* **API Base URL**: `http://localhost:3000/api/v1`
