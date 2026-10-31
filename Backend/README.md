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

## 📋 3. Đối Chiếu 11 Yêu Cầu Của Module Sản Phẩm (Product)

Thực thể **Product**: `ProductID`, `ProductName`, `PathImage`, `ProductType`, `Quantity`, `Unit`, `Price`, `Description`, `CreateDate`, `UpdateDate`.

| STT | Yêu cầu nghiệp vụ | Trạng thái Backend API | Endpoint RESTful |
| :---: | :--- | :---: | :--- |
| **1** | Bảng phân trang (10 - 15 item/page) | ✅ Đã hỗ trợ | `GET /api/v1/products?page=1&limit=10` (mặc định 10-15) |
| **2** | Thêm mới sản phẩm | ✅ Đã hỗ trợ | `POST /api/v1/products` (tự động cấp mã `CF-xxxx` nếu không truyền) |
| **3** | Cập nhật sản phẩm | ✅ Đã hỗ trợ | `PATCH /api/v1/products/:id` |
| **4** | Xem chi tiết sản phẩm | ✅ Đã hỗ trợ | `GET /api/v1/products/:id` |
| **5** | Xóa 1 bản ghi hoặc nhiều bản ghi checkbox | ✅ Đã hỗ trợ | `DELETE /api/v1/products/:id` & `POST /api/v1/products/batch-delete` |
| **6** | Tìm kiếm đa trường (Tên, mô tả, mã, loại...) | ✅ Đã hỗ trợ | `GET /api/v1/products?search=...&productType=...` |
| **7** | Sao chép 1 bản ghi | ✅ Đã hỗ trợ | `POST /api/v1/products/:id/duplicate` |
| **8** | Sao chép nhiều bản ghi | ✅ Đã hỗ trợ | `POST /api/v1/products/batch-duplicate` |
| **9** | Import & Export dữ liệu (Excel, JSON, XML) | ✅ Đã hỗ trợ | <ul><li>Export: `GET /api/v1/products/export/excel`, `/json`, `/xml`</li><li>Import: `POST /api/v1/products/import/excel`, `/json`, `/xml`</li></ul> |
| **10** | Cấu hình ẩn / hiện cột của Table | 🖥️ Frontend | Giao diện Frontend quản lý State hiển thị cột |
| **11** | Phím tắt cho các chức năng CRUD (`Alt + S + H + N`) | 🖥️ Frontend | Giao diện Frontend bắt sự kiện phím tắt (Keyboard Event Listeners) |

---

## 🚀 3. Hướng Dẫn Khởi Chạy

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
