import React from 'react';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Youtube, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Footer({ currentPage, setCurrentPage }) {
  const { openAuthModal } = useCart();

  const handleLinkClick = (e, item) => {
    if (item === 'Giới thiệu' && setCurrentPage) {
      e.preventDefault();
      setCurrentPage('about');
      window.location.hash = '#about-page';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item === 'Liên hệ' && setCurrentPage) {
      e.preventDefault();
      setCurrentPage('contact');
      window.location.hash = '#contact-page';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item === 'Đăng ký thành viên' && openAuthModal) {
      e.preventDefault();
      openAuthModal('register');
    }
  };

  return (
    <footer className="relative text-white font-sans overflow-hidden">
      {/* Main Footer with Dark Textured Background */}
      <div 
        className="relative py-14 sm:py-16 lg:py-20 border-t border-neutral-900 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/img/background-footer.jpg)',
        }}
      >
        {/* Responsive Container: Tự động co giãn & căn đều tuyệt đối trên mọi độ phân giải màn hình */}
        <div className="w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-12 xl:gap-16">
            
            {/* Column 1: Về Coffena (Tự co giãn cân đối bên trái, chiếm ~38% màn hình lớn) */}
            <div className="w-full lg:w-[40%] xl:w-[38%] shrink-0 space-y-4 text-[16px] sm:text-[17px] text-neutral-300 leading-relaxed">
              <h4 className="font-condensed font-extrabold text-[20px] sm:text-[22px] text-white uppercase tracking-wider mb-4">
                Về Coffena
              </h4>
              <p>
                Chúng tôi được đặt chân tới các vùng nguyên liệu cà phê tốt nhất Việt Nam bao gồm Điện Biên, Pleiku, Lâm Đồng, Đak Lak, Buôn Mê Thuột. Mỗi vùng đất, mỗi giống cà phê, mỗi nông hộ đều chứa đựng 1 câu chuyện riêng.
              </p>
              <p>
                Coffeena cũng đồng hành cùng các hợp tác xã để xây dựng các vườn ươm cho các giống cà phê mới bền vững và thích nghi được sự biến đổi khí hậu như Starmaya, Liberica, Marsellesa, Centroamericano H1.
              </p>

              {/* Contact Info */}
              <div className="pt-2 space-y-3 text-[16px] sm:text-[17px] text-neutral-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-neutral-400 shrink-0 mt-1" />
                  <span>1234 Nguyễn Thị Minh Khai, phường 2, quận 3, Tp. Hồ Chí Minh</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-neutral-400 shrink-0" />
                  <span>Email: <a href="mailto:hello@coffeena.abc" className="hover:text-[#E51E25] transition-colors duration-200">hello@coffeena.abc</a></span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-neutral-400 shrink-0" />
                  <a href="tel:+840988001002" className="hover:text-[#E51E25] transition-colors duration-200">+84 0988001002</a>
                </div>
              </div>
            </div>

            {/* Columns 2, 3, 4: Giới thiệu - Liên kết - Kết nối (Dàn đều 100% không gian bên phải) */}
            <div className="w-full lg:w-[56%] xl:w-[58%] flex flex-col sm:flex-row justify-between gap-8 sm:gap-6 lg:gap-8">
              
              {/* Column 2: Giới thiệu */}
              <div className="space-y-4 text-[16px] sm:text-[17px] text-neutral-300 shrink-0">
                <h4 className="font-condensed font-extrabold text-[20px] sm:text-[22px] text-white uppercase tracking-wider mb-4">
                  Giới thiệu
                </h4>
                <ul className="space-y-3">
                  {[
                    'Sản phẩm khuyến mãi',
                    'Sản phẩm nổi bật',
                    'Tất cả sản phẩm'
                  ].map((item, idx) => (
                    <li key={idx}>
                      <a
                        href="#signature-menu"
                        className="flex items-center gap-2 group hover:text-[#E51E25] transition-colors duration-200 cursor-pointer"
                      >
                        <span className="text-neutral-400 group-hover:text-[#E51E25] transition-colors duration-200 font-bold">·</span>
                        <span className="group-hover:text-[#E51E25] transition-colors duration-200">{item}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Liên kết */}
              <div className="space-y-4 text-[16px] sm:text-[17px] text-neutral-300 shrink-0">
                <h4 className="font-condensed font-extrabold text-[20px] sm:text-[22px] text-white uppercase tracking-wider mb-4">
                  Liên kết
                </h4>
                <ul className="space-y-3">
                  {[
                    'Tìm kiếm',
                    'Giới thiệu',
                    'Đăng ký thành viên',
                    'Chính sách đổi trả',
                    'Chính sách bảo mật',
                    'Điều khoản dịch vụ',
                    'Liên hệ'
                  ].map((item, idx) => (
                    <li key={idx}>
                      <a
                        href={item === 'Giới thiệu' ? '#about-page' : item === 'Liên hệ' ? '#contact-page' : '#about'}
                        onClick={(e) => handleLinkClick(e, item)}
                        className={`flex items-center gap-2 group transition-colors duration-200 cursor-pointer ${
                          item === 'Đăng ký thành viên' ? 'text-amber-300 font-semibold' : ''
                        } hover:text-[#E51E25]`}
                      >
                        <span className="text-neutral-400 group-hover:text-[#E51E25] transition-colors duration-200 font-bold">·</span>
                        <span className="group-hover:text-[#E51E25] transition-colors duration-200">{item}</span>
                        {item === 'Đăng ký thành viên' && (
                          <span className="px-1.5 py-0.2 bg-red-600/80 text-white text-[10px] rounded font-bold ml-1">
                            +50K
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Kết nối với Coffeena */}
              <div className="space-y-4 text-[16px] sm:text-[17px] text-neutral-300 shrink-0">
                <h4 className="font-condensed font-extrabold text-[20px] sm:text-[22px] text-white uppercase tracking-wider mb-4 whitespace-nowrap">
                  Kết nối với Coffeena
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3.5 group hover:text-[#E51E25] transition-colors duration-200 cursor-pointer"
                    >
                      <Facebook className="w-5 h-5 fill-current text-neutral-400 group-hover:text-[#E51E25] transition-colors duration-200 shrink-0" />
                      <span className="group-hover:text-[#E51E25] transition-colors duration-200">Facebook</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3.5 group hover:text-[#E51E25] transition-colors duration-200 cursor-pointer"
                    >
                      <Twitter className="w-5 h-5 fill-current text-neutral-400 group-hover:text-[#E51E25] transition-colors duration-200 shrink-0" />
                      <span className="group-hover:text-[#E51E25] transition-colors duration-200">Twitter</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3.5 group hover:text-[#E51E25] transition-colors duration-200 cursor-pointer"
                    >
                      <Instagram className="w-5 h-5 text-neutral-400 group-hover:text-[#E51E25] transition-colors duration-200 shrink-0" />
                      <span className="group-hover:text-[#E51E25] transition-colors duration-200">Instagram</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3.5 group hover:text-[#E51E25] transition-colors duration-200 cursor-pointer"
                    >
                      <span className="w-5 h-5 flex items-center justify-center font-bold text-base text-neutral-400 group-hover:text-[#E51E25] transition-colors duration-200 shrink-0">G</span>
                      <span className="group-hover:text-[#E51E25] transition-colors duration-200">Google</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3.5 group hover:text-[#E51E25] transition-colors duration-200 cursor-pointer"
                    >
                      <Youtube className="w-5 h-5 text-neutral-400 group-hover:text-[#E51E25] transition-colors duration-200 shrink-0" />
                      <span className="group-hover:text-[#E51E25] transition-colors duration-200">Youtube</span>
                    </a>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar - Căn đều thẳng hàng với nội dung trên */}
      <div className="bg-[#1C1C1C] border-t border-neutral-900/80 py-5 text-[15px] text-neutral-300">
        <div className="w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright Text */}
          <div className="text-center sm:text-left text-[15px] text-neutral-300 flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span>Copyright © 2026 Cafena. Powered by Haravan</span>
            <span className="text-neutral-600">|</span>
            <a
              href="#admin"
              onClick={(e) => {
                e.preventDefault();
                if (setCurrentPage) setCurrentPage('admin');
                window.location.hash = '#admin';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-neutral-400 hover:text-[#E51E25] transition-colors text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>⚙️</span>
              <span>Trang Quản Trị (Admin)</span>
            </a>
            <span className="text-neutral-600">|</span>
            <button
              type="button"
              onClick={() => openAuthModal && openAuthModal('register')}
              className="text-amber-300 hover:text-white transition-colors text-xs flex items-center gap-1 cursor-pointer font-bold"
            >
              <span>🎁</span>
              <span>Đăng Ký Hội Viên (+50K)</span>
            </button>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {[
              { src: '/img/payment_1_img.webp', alt: 'ZaloPay' },
              { src: '/img/payment_2_img.webp', alt: 'OnePAY' },
              { src: '/img/payment_3_img.webp', alt: 'VNPAY' },
              { src: '/img/payment_4_img.webp', alt: 'Kredivo' }
            ].map((p, idx) => (
              <span
                key={idx}
                className="bg-white rounded px-3 py-1 flex items-center justify-center h-8 sm:h-9 shadow-sm"
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  className="h-5 sm:h-6 w-auto object-contain max-w-[65px]"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
