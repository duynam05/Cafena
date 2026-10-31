import React from 'react';
import { useCart } from '../context/CartContext';

// 3 Món gợi ý phần trên (khớp yêu cầu chỉ giữ 3 món)
export const MENU_SUGGESTION_ITEMS = [
  {
    id: 'sig-1',
    name: 'Cafe đen nóng',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: null,
    image: '/img/cafe_den_nong_c53df31dd7bc4f23967e2a09eaf96ae9_0b832f13c2d246329e3fe1bed0627a9b_small.webp'
  },
  {
    id: 'sig-4',
    name: 'Cafe muối',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 30000,
    originalPrice: null,
    image: '/img/cafe_muoi_c4c5f099cbc248679335eba5fcbfdf0b_48fc9609567d4a7bb32467069dd60bcd_small.webp'
  },
  {
    id: 'sig-2',
    name: 'Cafe sữa đá',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: 30000,
    image: '/img/cafe_sua_da_ee2490f7d7dc47748ae88e323b31fa2b_eab075b7a57149fe80a152ade1b9cbc3_small.webp'
  }
];

// Thời gian hoạt động
export const OPERATING_HOURS = [
  { day: 'Saturday', hours: '9.00am - 3.00pm' },
  { day: 'Sunday', hours: 'Closed' },
  { day: 'Monday', hours: '9.00am - 6.00pm' },
  { day: 'Tuesday', hours: '9.00am - 6.00pm' },
  { day: 'Wednesday', hours: '9.00am - 6.00pm' },
  { day: 'Thursday', hours: '9.00am - 6.00pm' },
  { day: 'Firday', hours: '9.00am - 6.00pm' }
];

// 4 Món ngon nhiều khách yêu thích phần dưới
export const FAVORITE_ITEMS = [
  {
    id: 'fav-1',
    name: 'Cafe đen nóng',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: null,
    image: '/img/cafe_den_nong_c53df31dd7bc4f23967e2a09eaf96ae9_0b832f13c2d246329e3fe1bed0627a9b_small.webp'
  },
  {
    id: 'fav-2',
    name: 'Cafe muối',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 30000,
    originalPrice: null,
    image: '/img/cafe_muoi_c4c5f099cbc248679335eba5fcbfdf0b_48fc9609567d4a7bb32467069dd60bcd_small.webp'
  },
  {
    id: 'fav-3',
    name: 'Cafe sữa đá',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: 30000,
    image: '/img/cafe_sua_da_ee2490f7d7dc47748ae88e323b31fa2b_eab075b7a57149fe80a152ade1b9cbc3_small.webp'
  },
  {
    id: 'fav-4',
    name: 'Cafe sữa nóng',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: null,
    image: '/img/cafe_sua_nong_65937f23b853420080a8190e972d3e9a_a9a31b27d34c489a972023b6d21e54ec_small.webp'
  }
];

// 6 Món Combo Tiết Kiệm (Phần 3)
export const COMBO_ITEMS = [
  {
    id: 'combo-1',
    name: 'Cafe đen nóng',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: null,
    image: '/img/cafe_den_nong_c53df31dd7bc4f23967e2a09eaf96ae9_0b832f13c2d246329e3fe1bed0627a9b_small.webp'
  },
  {
    id: 'combo-2',
    name: 'Cafe muối',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 30000,
    originalPrice: null,
    image: '/img/cafe_muoi_c4c5f099cbc248679335eba5fcbfdf0b_48fc9609567d4a7bb32467069dd60bcd_small.webp'
  },
  {
    id: 'combo-3',
    name: 'Cafe sữa đá',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: 30000,
    image: '/img/cafe_sua_da_ee2490f7d7dc47748ae88e323b31fa2b_eab075b7a57149fe80a152ade1b9cbc3_small.webp'
  },
  {
    id: 'combo-4',
    name: 'Cafe sữa nóng',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: null,
    image: '/img/cafe_sua_nong_65937f23b853420080a8190e972d3e9a_a9a31b27d34c489a972023b6d21e54ec_small.webp'
  },
  {
    id: 'combo-5',
    name: 'Capuchino',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 38000,
    originalPrice: null,
    image: '/img/capuchino_2_0f38ce14337b400783e7fa3222ec7129_a7b20c54d10648e190a5dd5aff7d871f_small.webp'
  },
  {
    id: 'combo-6',
    name: 'Cookie đá xay',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 45000,
    originalPrice: null,
    image: '/img/cookie_da_xay_6a17637f63bd4be2ab93b9e75b99e014_4807fca8cd5840fa80e1dc310ef80089_small.webp'
  }
];

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-US').format(amount) + '₫';
}

export default function MenuPage({ onSelectProduct }) {
  const { setQuickViewProduct } = useCart();

  return (
    <div className="bg-white">
      
      {/* =========================================================================
          PHẦN 1: Coffeena - MENU GỢI Ý (Nền trắng, 3 sản phẩm + Thời gian hoạt động)
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading: Coffeena - MENU GỢI Ý */}
          <div className="text-center mb-12 sm:mb-14">
            <p className="text-[#C45A38] font-bold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">
              Coffeena
            </p>
            <h1 className="font-display text-[39px] font-extrabold font-[800] text-[#3E3B3B] tracking-normal uppercase leading-tight">
              MENU GỢI Ý
            </h1>
          </div>

          {/* 2 Columns: 3 Món bên trái & Khối Thời gian hoạt động bên phải */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* CỘT TRÁI: 3 Món Gợi Ý (8 Cột) */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-5">
              {MENU_SUGGESTION_ITEMS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (onSelectProduct) {
                      onSelectProduct(item);
                    } else if (setQuickViewProduct) {
                      setQuickViewProduct({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        originalPrice: item.originalPrice,
                        image: item.image,
                        description: item.desc,
                        inStock: true
                      });
                    }
                  }}
                  className="bg-white border border-[#EBEBEB] hover:border-gray-300 hover:shadow-md transition-all duration-300 p-4 sm:p-5 flex items-center justify-between gap-4 group cursor-pointer"
                  style={{ cursor: 'pointer' }}
                >
                  {/* Ảnh món nước */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 ease-out"
                      loading="lazy"
                    />
                  </div>

                  {/* Tên & Mô tả món */}
                  <div className="flex-1 text-left pr-2">
                    <h3
                      className="font-condensed font-bold text-[25px] text-[#333] group-hover:text-[#E51E25] transition-colors duration-200 leading-snug tracking-wide"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '25px' }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-neutral-400 font-normal mt-1 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  {/* Giá tiền bên phải */}
                  <div className="text-right shrink-0">
                    <span className="font-display font-bold text-base sm:text-lg text-[#E51E25] block">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && (
                      <span className="line-through text-xs sm:text-sm text-neutral-400 block mt-0.5 font-medium">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CỘT PHẢI: KHỐI THỜI GIAN HOẠT ĐỘNG (4 Cột) */}
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <div className="bg-white border border-[#EBEBEB] shadow-sm overflow-hidden">
                
                {/* Tiêu đề đỏ: Thời gian hoạt động */}
                <div className="bg-[#E51E25] text-white py-3.5 px-6 text-center font-bold text-base sm:text-[17px] tracking-wide">
                  Thời gian hoạt động
                </div>

                {/* Bảng các ngày trong tuần */}
                <div className="divide-y divide-gray-100 bg-white">
                  {OPERATING_HOURS.map((row, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-3.5 px-6 text-sm sm:text-[14px] hover:bg-neutral-50/50 transition-colors"
                    >
                      <span className="text-neutral-600 font-medium">
                        {row.day}
                      </span>
                      <span
                        className={`font-normal ${
                          row.hours === 'Closed'
                            ? 'text-neutral-500 font-medium'
                            : 'text-neutral-500'
                        }`}
                      >
                        {row.hours}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          PHẦN 2: Món ngon - NHIỀU KHÁCH YÊU THÍCH (Nền tối menu_collection_bg.jpg)
          ========================================================================= */}
      <section 
        className="py-16 sm:py-20 lg:py-24 text-white relative bg-cover bg-center bg-no-repeat overflow-hidden border-t border-neutral-900"
        style={{
          backgroundImage: 'url(/img/menu_collection_bg.jpg)',
          backgroundColor: '#111111'
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Heading: Món ngon - NHIỀU KHÁCH YÊU THÍCH */}
          <div className="text-center mb-12 sm:mb-14">
            <p className="text-[#E51E25] font-bold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">
              Món ngon
            </p>
            <h2 className="font-display text-[39px] font-extrabold font-[800] text-white tracking-normal uppercase leading-tight">
              NHIỀU KHÁCH YÊU THÍCH
            </h2>
          </div>

          {/* 2 Columns: 4 Cards on Left - Special Coffee Banner on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Cột trái: 4 Món Yêu Thích với viền mảnh và vạch dọc ngăn cách (7 Cột) */}
            <div className="lg:col-span-7 space-y-4">
              {FAVORITE_ITEMS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (onSelectProduct) {
                      onSelectProduct(item);
                    } else if (setQuickViewProduct) {
                      setQuickViewProduct({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        originalPrice: item.originalPrice,
                        image: item.image,
                        description: item.desc,
                        inStock: true
                      });
                    }
                  }}
                  className="bg-black/40 backdrop-blur-xs border border-white/20 hover:border-white/60 transition-all duration-300 p-4 sm:p-5 flex items-center justify-between gap-4 group cursor-pointer"
                  style={{ cursor: 'pointer' }}
                >
                  {/* Ảnh món nước */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 ease-out"
                      loading="lazy"
                    />
                  </div>

                  {/* Tên & Mô tả món */}
                  <div className="flex-1 text-left pr-2">
                    <h3
                      className="font-condensed font-bold text-[25px] text-white group-hover:text-[#E51E25] transition-colors duration-200 leading-snug tracking-wide"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '25px' }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-neutral-300 font-normal mt-1 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  {/* Vạch ngăn cách dọc | chuẩn theo ảnh mẫu */}
                  <div className="w-[1px] h-10 bg-white/20 mx-1 sm:mx-2 shrink-0 hidden sm:block" />

                  {/* Giá tiền bên phải */}
                  <div className="text-right shrink-0 min-w-[85px]">
                    <span className="font-display font-bold text-base sm:text-lg text-[#E51E25] block">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && (
                      <span className="line-through text-xs sm:text-sm text-neutral-300 block mt-0.5 font-medium">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Cột phải: Banner SPECIAL COFFEE (5 Cột) - Thu gọn kích thước để vừa khít với 4 khung bên trái */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="overflow-hidden rounded-lg shadow-2xl max-w-[300px] sm:max-w-[330px] max-h-[415px] sm:max-h-[430px] flex items-center justify-center">
                <img
                  src="/img/menu_collection_banner.webp"
                  alt="Special Coffee Khuyến Mãi $3.90"
                  className="w-full h-full max-h-[415px] sm:max-h-[430px] object-contain hover:scale-[1.02] transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          PHẦN 3: Set Menu - COMBO TIẾT KIỆM (Nền trắng, 6 sản phẩm chia 2 cột)
          ========================================================================= */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white relative border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading: Set Menu - COMBO TIẾT KIỆM */}
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-[#E51E25] font-bold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">
              Set Menu
            </p>
            <h2 className="font-display text-[39px] font-extrabold font-[800] text-[#3E3B3B] tracking-normal uppercase leading-tight">
              COMBO TIẾT KIỆM
            </h2>
          </div>

          {/* Grid 2 Cột (3 hàng x 2 cột = 6 món) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
            {COMBO_ITEMS.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (onSelectProduct) {
                    onSelectProduct(item);
                  } else if (setQuickViewProduct) {
                    setQuickViewProduct({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      originalPrice: item.originalPrice,
                      image: item.image,
                      description: item.desc,
                      inStock: true
                    });
                  }
                }}
                className="bg-white border border-[#EBEBEB] hover:border-gray-300 hover:shadow-md transition-all duration-300 p-4 sm:p-5 flex items-center justify-between gap-4 group cursor-pointer"
                style={{ cursor: 'pointer' }}
              >
                {/* Ảnh món nước */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 ease-out"
                    loading="lazy"
                  />
                </div>

                {/* Tên & Mô tả món */}
                <div className="flex-1 text-left pr-2">
                  <h3
                    className="font-cursive font-bold text-[20px] text-[#333] group-hover:text-[#E51E25] transition-colors duration-200 leading-snug"
                    style={{ fontFamily: 'cursive', fontSize: '20px' }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-neutral-400 font-normal mt-1 leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                {/* Vạch ngăn cách dọc | chuẩn theo ảnh */}
                <div className="w-[1px] h-10 bg-gray-200 mx-1 sm:mx-2 shrink-0 hidden sm:block" />

                {/* Giá tiền bên phải */}
                <div className="text-right shrink-0 min-w-[85px]">
                  <span className="font-display font-bold text-base sm:text-lg text-[#E51E25] block">
                    {formatPrice(item.price)}
                  </span>
                  {item.originalPrice && (
                    <span className="line-through text-xs sm:text-sm text-neutral-400 block mt-0.5 font-medium">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
