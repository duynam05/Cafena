# Cafena Coffee - Giao Diện UI Website Thương Mại Điện Tử (React + Tailwind CSS)

Dự án mô phỏng hoàn chỉnh giao diện website thương hiệu cà phê **Cafena** (`cafena.myharavan.com` trên nền tảng Haravan), được xây dựng bằng **React (Vite) + Tailwind CSS + Lucide Icons**.

> **Lưu ý:** Dự án hiện tập trung 100% vào **Frontend UI/UX**, sử dụng React State và Mock Data chân thực, **chưa cần kết nối Backend** nhưng vẫn đảm bảo đầy đủ các tính năng tương tác như một website thực tế.

---

## ☕ Các Tính Năng Giao Diện (Features)

1. **Header & Navigation Bar:**
   * Thanh thông báo ưu đãi (nhập mã `CAFENA20` giảm 20%).
   * Menu điều hướng mượt mà: Trang chủ, Về Cafena, Vùng nguyên liệu, Thực đơn, Cẩm nang pha chế, Đánh giá, Liên hệ.
   * Tìm kiếm món & sản phẩm theo thời gian thực (Live Search).
   * Thả tim yêu thích (Wishlist) lưu trữ tự động vào `localStorage`.
   * Nút giỏ hàng có badge hiển thị số lượng món trực tiếp.

2. **Hero Banner:**
   * Tông màu nâu cà phê (`#170C05`), caramel ánh vàng (`#D4A373`) sang trọng.
   * Hiệu ứng thẻ nổi bật món đặc sản trong ngày (*Cà phê muối*), cam kết 100% hạt chín mọng & công nghệ rang Hot-Air.

3. **Vùng Nguyên Liệu Tuyển Chọn (Origins Showcase):**
   * Giới thiệu 3 nông trường: **Cầu Đất** (Lâm Đồng), **Cư M'gar** (Đắk Lắk), **Nam Yang** (Gia Lai).
   * Hiển thị độ cao, giống hạt và nốt hương đặc trưng.

4. **Thực Đơn & Danh Mục Sản Phẩm (Menu & Categories Grid):**
   * Bộ lọc theo 5 danh mục: *Tất cả*, *Cà phê hạt & gói*, *Cà phê pha sẵn*, *Trà & Đá xay*, *Dụng cụ pha chế*.
   * Sắp xếp giá tăng dần, giảm dần, đánh giá cao nhất.
   * Thẻ sản phẩm (Product Card): Đánh giá sao, giá niêm yết, giá khuyến mãi, tag bán chạy, nút thêm nhanh vào giỏ.

5. **Modal Xem Nhanh Chi Tiết (Quick View Modal):**
   * Popup xem chi tiết: Tùy chọn khối lượng (250g / 500g / 1kg), size ly (M / L), mức đường, mức đá.
   * Tăng giảm số lượng và tính tiền trực tiếp.

6. **Giỏ Hàng Động (Cart Drawer) & Voucher:**
   * Trượt mượt mà từ bên phải.
   * Thanh đo tiến trình **Freeship** (tự động mở khóa Miễn phí vận chuyển khi đơn > 299.000₫).
   * Hỗ trợ áp dụng mã giảm giá:
     * `CAFENA20`: Giảm 20% toàn đơn.
     * `FREESHIP`: Giảm 10% phí.

7. **Modal Đặt Hàng Mô Phỏng (Checkout Modal):**
   * Điền thông tin nhận hàng (Họ tên, SĐT, Địa chỉ, Ghi chú).
   * Chọn phương thức thanh toán: COD, VNPAY, ZaloPay, MoMo.
   * Sinh mã vận đơn tự động (ví dụ: `#CFN-847291`) và màn hình chúc mừng đặt hàng thành công.

8. **Góc Chuyên Gia & Cẩm Nang Pha Chế (Brewing Guide):**
   * Hướng dẫn pha Phin truyền thống, ngâm Cold Brew 18 giờ, công nghệ rang Hot-Air.
   * Popup đọc bài viết chi tiết.

9. **Đánh Giá Khách Hàng (Customer Reviews):**
   * Đánh giá 5 sao từ khách hàng văn phòng, home barista và chủ homestay.

10. **Footer Thương Mại Điện Tử:**
    * Đầy đủ thông tin liên hệ, hotline, form đăng ký email nhận voucher 10%, logo đối tác thanh toán (VNPAY, ZaloPay, MoMo, Kredivo...).

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Khởi động môi trường phát triển (Development)
Mở PowerShell tại thư mục này và chạy lệnh:
```bash
npm run dev
```
Sau đó truy cập vào trình duyệt theo địa chỉ: [http://localhost:5173](http://localhost:5173)

### 2. Đóng gói cho môi trường Production (Build)
```bash
npm run build
```
Thư mục xuất bản tĩnh sẽ nằm tại thư mục `dist/`.

---

## 📁 Cấu Trúc Dự Án (Project Structure)

```
Ngon_ngu_kich_ban/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── context/
│   │   └── CartContext.jsx      # Quản lý State giỏ hàng, wishlist, toast, voucher
│   ├── data/
│   │   └── mockData.js          # Dữ liệu mẫu sản phẩm, vùng trồng, blog, đánh giá
│   └── components/
│       ├── Header.jsx           # Topbar, Logo, Nav, Search, Cart Button
│       ├── Hero.jsx             # Banner trang chủ ấn tượng
│       ├── Features.jsx         # 4 cam kết chất lượng thương hiệu
│       ├── Origins.jsx          # Bản đồ vùng nguyên liệu cà phê
│       ├── ProductSection.jsx   # Bộ lọc danh mục & Grid sản phẩm
│       ├── ProductCard.jsx      # Thẻ từng món cà phê
│       ├── PromoBanner.jsx      # Banner quà tặng phin mạ vàng
│       ├── BrewingGuide.jsx     # Cẩm nang kỹ thuật pha chế
│       ├── Reviews.jsx          # Đánh giá khách hàng
│       ├── Footer.jsx           # Thông tin liên hệ & bản quyền
│       ├── CartDrawer.jsx       # Drawer giỏ hàng trượt phải
│       ├── QuickViewModal.jsx   # Popup xem chi tiết & tùy biến món
│       ├── CheckoutModal.jsx    # Form thanh toán & đặt hàng mô phỏng
│       └── Toast.jsx            # Thông báo nổi (Toasts)
```

