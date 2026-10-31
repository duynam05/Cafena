import React, { useState, useEffect, useRef } from 'react';

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);
  const leftServices = [
    {
      title: 'NGUYÊN LIỆU CHẤT LƯỢNG',
      desc: 'Sản xuất cà phê nguyên liệu tại nông trại chuyên cà phê chất lượng cao ở các vùng trồng cà phê nổi tiếng: CưM\'gar - Đắk Lắk, Nam Yang - Gia Lai, Cầu Đất - Lâm Đồng.',
      icon: '/img/home_service_1_img.webp'
    },
    {
      title: 'KHÔNG NẤM MỐC',
      desc: '100% hạt cà phê nguyên liệu loại bỏ hạt sâu, xốp, mọt, mẻ, tạp chất trước khi rang.',
      icon: '/img/home_service_2_img.webp'
    },
    {
      title: 'HƯƠNG VỊ ĐẶC TRƯNG',
      desc: 'Áp dụng đa dạng phương pháp sơ chế theo quy trình cà phê đặc sản SCA, tạo nên hương vị đặc trưng, đa dạng',
      icon: '/img/home_service_3_img.webp'
    },
    {
      title: 'MORNING COFFEE',
      desc: 'Bắt đầu ngày mới thoải mái và ấm cúng để nhâm nhi một tách cà phê',
      icon: '/img/home_service_4_img.webp'
    }
  ];

  const rightServices = [
    {
      title: 'TỶ LỆ TRÁI CHÍNH ĐẠT 90%',
      desc: 'Tiêu chuẩn bắt buộc để sản xuất cà phê chất lượng cao.',
      icon: '/img/home_service_5_img.webp'
    },
    {
      title: 'MÁY RANG CÔNG NGHỆ',
      desc: 'Công nghệ Hot-air Kiểm soát đồng đều từng mẻ rang, không cháy khét, không ám khói.',
      icon: '/img/home_service_6_img.webp'
    },
    {
      title: 'SẢN PHẨM LUÔN MỚI',
      desc: 'Ngày rang luôn dưới 10 ngày, 100% xay mới mỗi ngày. Trải nghiệm cà phê tươi mới nhất.',
      icon: '/img/home_service_7_img.webp'
    },
    {
      title: 'UỐNG CHẤT, SỐNG KHỎE',
      desc: 'Cà Phê Chất Lượng Cao: Hướng Đến Trải Nghiệm Đáng Giá Về Việt Nam.',
      icon: '/img/home_service_8_img.webp'
    }
  ];

  return (
    <section id="features" ref={sectionRef} className="py-20 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading: Coffeena - XIN CHÀO! COFFEE LOVER with Red Accent Bar */}
        <div className={`text-center mb-14 sm:mb-16 transition-all duration-700 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-[#C45A38] font-bold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">
            Coffeena
          </p>
          <h2 className="font-display text-[39px] font-extrabold font-[800] text-[#3E3B3B] tracking-normal uppercase leading-tight">
            XIN CHÀO! COFFEE LOVER
          </h2>
          {/* Thanh gạch đỏ đặc trưng giống mẫu chuẩn */}
          <div className="w-16 sm:w-20 h-1 bg-[#E51E25] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Column (4 items with text aligned right and icon on the right, căn giữa thẳng hàng) */}
          <div className="lg:col-span-4 space-y-8 sm:space-y-10">
            {leftServices.map((item, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-end gap-4 sm:gap-5 transition-all duration-700 ease-out transform ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12 sm:-translate-x-16'
                }`}
                style={{
                  transitionDelay: isVisible ? `${idx * 150}ms` : '0ms'
                }}
              >
                {/* Text Block */}
                <div className="text-right flex-1">
                  {/* Tiêu đề in đậm 23px dải màu #3E3B3B, đã xóa hover */}
                  <h3 className="font-display font-black text-lg sm:text-xl lg:text-[23px] text-[#3E3B3B] uppercase leading-snug tracking-tight">
                    {item.title}
                  </h3>
                  {/* Chữ mô tả làm mờ đi (màu xám nhạt dịu text-neutral-400) */}
                  <p className="text-sm sm:text-[14px] text-neutral-400 font-normal mt-2 leading-relaxed max-w-sm ml-auto">
                    {item.desc}
                  </p>
                </div>

                {/* Black Icon kích thước to hơn, căn giữa với title, đã xóa hover */}
                <div className="w-14 sm:w-16 h-14 sm:h-16 shrink-0 flex items-center justify-center">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-11 sm:w-13 h-11 sm:h-13 object-contain"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Center Column: The Tilted Cup Image with Milk Splash */}
          <div className="lg:col-span-4 flex items-center justify-center py-4 lg:py-0">
            <div 
              className={`relative group/cup transition-all duration-1000 ease-out transform ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
              style={{
                transitionDelay: isVisible ? '200ms' : '0ms'
              }}
            >
              <img
                src="/img/home_service_img.webp"
                alt="COFFEENA XIN CHÀO! Coffee lovers"
                className="w-56 sm:w-68 md:w-76 lg:w-[340px] h-auto object-contain animate-float hover:scale-105 transition-transform duration-500 ease-out filter drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Right Column (4 items with icon on the left and text aligned left, căn giữa thẳng hàng) */}
          <div className="lg:col-span-4 space-y-8 sm:space-y-10">
            {rightServices.map((item, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-start gap-4 sm:gap-5 transition-all duration-700 ease-out transform ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 sm:translate-x-16'
                }`}
                style={{
                  transitionDelay: isVisible ? `${idx * 150}ms` : '0ms'
                }}
              >
                {/* Black Icon kích thước to hơn, căn giữa với title, đã xóa hover */}
                <div className="w-14 sm:w-16 h-14 sm:h-16 shrink-0 flex items-center justify-center">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-11 sm:w-13 h-11 sm:h-13 object-contain"
                  />
                </div>

                {/* Text Block */}
                <div className="text-left flex-1">
                  {/* Tiêu đề in đậm 23px dải màu #3E3B3B, đã xóa hover */}
                  <h3 className="font-display font-black text-lg sm:text-xl lg:text-[23px] text-[#3E3B3B] uppercase leading-snug tracking-tight">
                    {item.title}
                  </h3>
                  {/* Chữ mô tả làm mờ đi (màu xám nhạt dịu text-neutral-400) */}
                  <p className="text-sm sm:text-[14px] text-neutral-400 font-normal mt-2 leading-relaxed max-w-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
