import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const CUSTOMER_REVIEWS = [
  {
    id: 1,
    name: 'Kevin Pham',
    role: 'Khách hàng',
    avatar: '/img/home_review_img_1.webp',
    rating: 5,
    comment:
      'Tôi đã uống cà phê trong nhiều năm và tôi có thể thành thật nói rằng cà phê là sản phẩm tốt nhất hiện nay. Cà phê có hương vị hoàn hảo và đánh thức tôi vào buổi sáng. Nó cũng thực sự phải chăng.'
  },
  {
    id: 2,
    name: 'Phu Tran',
    role: 'Khách hàng',
    avatar: '/img/home_review_img_2.webp',
    rating: 5,
    comment:
      'Mục tiêu của tôi khi đến quán cà phê này là có thể uống cà phê và tiếp tục ngày làm việc của mình. Hôm nay là sáng thứ năm và tôi đang vội vã giữa các cuộc họp. Tôi cần uống cà phê, nhưng không có thời gian để ngồi ở quán cà phê trong mười lăm phút.'
  }
];

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play review slider every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CUSTOMER_REVIEWS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CUSTOMER_REVIEWS.length) % CUSTOMER_REVIEWS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CUSTOMER_REVIEWS.length);
  };

  const activeReview = CUSTOMER_REVIEWS[currentIndex];

  return (
    <section
      id="reviews"
      className="relative py-16 sm:py-20 lg:py-24 min-h-[560px] sm:min-h-[600px] flex flex-col justify-center bg-cover bg-center bg-no-repeat overflow-hidden border-t border-gray-100"
      style={{
        backgroundImage: 'url(/img/home_review_banner.webp)',
        backgroundColor: '#F8F9FA'
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Section Heading: Khách hàng nói về Coffeena (chuẩn theo ảnh tham chiếu) */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="font-condensed font-bold text-3xl sm:text-4xl lg:text-[44px] text-[#3E3B3B] tracking-normal leading-tight">
            Khách hàng nói về Coffeena
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-normal mt-2">
            Chia sẻ của khách hàng đã trải nghiệm sản phẩm của chúng tôi.
          </p>
        </div>

        {/* Review Carousel Container */}
        <div className="relative max-w-3xl mx-auto text-center">
          
          {/* Review Card: Cố định chiều cao tuyệt đối để không bao giờ bị nhảy layout/background */}
          <div className="flex flex-col justify-center items-center min-h-[310px] sm:min-h-[290px]">
            
            {/* Avatar tròn nằm ngay dưới tiêu đề */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white shadow-md mb-4 shrink-0">
              <img
                src={activeReview.avatar}
                alt={activeReview.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* 5 Rating Stars */}
            <div className="flex items-center justify-center gap-1 mb-4 text-[#E51E25] shrink-0">
              {[...Array(activeReview.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" />
              ))}
            </div>

            {/* Comment Quote: Cố định min-height của phần chữ để 3 dòng hay 4 dòng chiều cao vẫn hoàn toàn bất biến */}
            <div className="min-h-[96px] sm:min-h-[84px] flex items-center justify-center w-full">
              <p className="text-base sm:text-lg md:text-[18px] text-[#3E3B3B] leading-relaxed italic max-w-2xl px-4 sm:px-6 font-normal">
                "{activeReview.comment}"
              </p>
            </div>

            {/* Reviewer Name & Role */}
            <div className="mt-4 shrink-0">
              <h4 className="font-display font-bold text-base sm:text-lg text-[#3E3B3B] uppercase tracking-wide">
                {activeReview.name}
              </h4>
              <span className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5 block">
                {activeReview.role}
              </span>
            </div>
          </div>

          {/* Navigation Arrows (Desktop / Tablet) */}
          <button
            type="button"
            onClick={handlePrev}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 lg:-translate-x-12 w-11 h-11 items-center justify-center rounded-full bg-white/90 hover:bg-[#E51E25] text-neutral-700 hover:text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            aria-label="Đánh giá trước"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2]" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 lg:translate-x-12 w-11 h-11 items-center justify-center rounded-full bg-white/90 hover:bg-[#E51E25] text-neutral-700 hover:text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            aria-label="Đánh giá tiếp theo"
          >
            <ChevronRight className="w-6 h-6 stroke-[2]" />
          </button>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2.5 mt-8">
            {CUSTOMER_REVIEWS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-7 h-2.5 bg-[#E51E25]'
                    : 'w-2.5 h-2.5 bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`Chuyển tới đánh giá ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
