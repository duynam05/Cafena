import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Mr. John Lee',
    role: 'Manager',
    image: '/img/about_us_team_2_img.webp'
  },
  {
    id: 2,
    name: 'Mr. Peter Pan',
    role: 'Chairmen',
    image: '/img/about_us_team_3_img.webp'
  },
  {
    id: 3,
    name: 'Mike Banding',
    role: 'Pha chế',
    image: '/img/about_us_team_4_img.webp'
  },
  {
    id: 4,
    name: 'Ms. Sophia',
    role: 'Phục vụ',
    image: '/img/about_us_team_5_img.webp'
  },
  {
    id: 5,
    name: 'Mike Banding',
    role: 'Pha chế',
    image: '/img/about_us_team_1_img.webp'
  }
];

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Single Gallery Name',
    category: 'Italian Rosted Coffee',
    image: '/img/home_gallery_1_img.webp'
  },
  {
    id: 2,
    title: 'Single Gallery Name',
    category: 'Italian Rosted Coffee',
    image: '/img/home_gallery_2_img.webp'
  },
  {
    id: 3,
    title: 'Single Gallery Name',
    category: 'Italian Rosted Coffee',
    image: '/img/home_gallery_3_img.webp'
  },
  {
    id: 4,
    title: 'Single Gallery Name',
    category: 'Italian Rosted Coffee',
    image: '/img/home_gallery_4_img.webp'
  },
  {
    id: 5,
    title: 'Single Gallery Name',
    category: 'Italian Rosted Coffee',
    image: '/img/home_gallery_5_img.webp'
  },
  {
    id: 6,
    title: 'Single Gallery Name',
    category: 'Italian Rosted Coffee',
    image: '/img/home_gallery_6_img.webp'
  }
];

export default function AboutUs() {
  // Slider states
  const [teamIndex, setTeamIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Lightbox for gallery
  const [lightboxImage, setLightboxImage] = useState(null);

  // Responsive visible count (4 on desktop, 3 on tablet, 2 on small tablet, 1 on mobile)
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const updateVisible = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth >= 1024) {
        setVisibleCount(4);
      } else if (window.innerWidth >= 768) {
        setVisibleCount(3);
      } else if (window.innerWidth >= 640) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  // Team bounds & handlers (shift by 1 item smoothly)
  const maxTeamIndex = Math.max(0, TEAM_MEMBERS.length - visibleCount);

  useEffect(() => {
    if (teamIndex > maxTeamIndex) {
      setTeamIndex(maxTeamIndex);
    }
  }, [maxTeamIndex, teamIndex]);

  const handlePrevTeam = () => {
    if (maxTeamIndex === 0) return;
    setTeamIndex((prev) => (prev > 0 ? prev - 1 : maxTeamIndex));
  };
  const handleNextTeam = () => {
    if (maxTeamIndex === 0) return;
    setTeamIndex((prev) => (prev < maxTeamIndex ? prev + 1 : 0));
  };

  // Gallery bounds & handlers (shift by 1 item smoothly)
  const maxGalleryIndex = Math.max(0, GALLERY_ITEMS.length - visibleCount);

  useEffect(() => {
    if (galleryIndex > maxGalleryIndex) {
      setGalleryIndex(maxGalleryIndex);
    }
  }, [maxGalleryIndex, galleryIndex]);

  const handlePrevGallery = () => {
    if (maxGalleryIndex === 0) return;
    setGalleryIndex((prev) => (prev > 0 ? prev - 1 : maxGalleryIndex));
  };
  const handleNextGallery = () => {
    if (maxGalleryIndex === 0) return;
    setGalleryIndex((prev) => (prev < maxGalleryIndex ? prev + 1 : 0));
  };

  return (
    <div className="bg-white">
      {/* 1. Bố cục 2 cột giới thiệu chính */}
      <section className="py-16 sm:py-24 bg-white relative border-t border-gray-100">
        <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Cột trái: Hình ảnh cốc cà phê sóng sánh kèm hạt cà phê */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-[480px]">
                <img
                  src="/img/about_us_about_img.webp"
                  alt="Giới thiệu về Coffeena"
                  className="w-full h-auto object-contain hover:scale-103 transition-transform duration-500 ease-out select-none"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Cột phải: 3 khối nội dung */}
            <div className="lg:col-span-7 space-y-7 sm:space-y-9 text-left">
              <div>
                <h1 className="font-condensed font-bold text-2xl sm:text-3xl lg:text-[34px] text-[#2D2D2D] uppercase tracking-wide leading-tight">
                  GIỚI THIỆU VỀ <span className="text-[#E51E25]">COFFEENA</span>
                </h1>
                <p className="text-neutral-600 text-sm sm:text-[15px] font-normal mt-3 leading-relaxed">
                  Quán cà phê là một doanh nghiệp nhỏ bán cà phê, bánh ngọt và các mặt hàng buổi sáng khác. Có nhiều loại quán cà phê khác nhau trên thế giới. Một số có nhân viên pha chế, trong khi một số chỉ có nhân viên thu ngân.
                </p>
              </div>

              <div>
                <h2 className="font-condensed font-bold text-xl sm:text-2xl lg:text-[24px] text-[#2D2D2D] uppercase tracking-wide leading-tight">
                  KHỞI ĐẦU TỪ 2018
                </h2>
                <p className="text-neutral-600 text-sm sm:text-[15px] font-normal mt-3 leading-relaxed">
                  Một số quán cà phê có khu vực ngồi, trong khi một số chỉ có một chỗ để gọi đồ uống rồi đi đến nơi khác để ngồi. Quán cà phê mà tôi sẽ mô tả là một nơi có khu vực ngồi và nhân viên pha chế.
                </p>
              </div>

              <div>
                <h2 className="font-condensed font-bold text-xl sm:text-2xl lg:text-[24px] text-[#2D2D2D] uppercase tracking-wide leading-tight">
                  COFFEENA VÀ CẢM HỨNG PHÁT TRIỂN
                </h2>
                <p className="text-neutral-600 text-sm sm:text-[15px] font-normal mt-3 leading-relaxed">
                  Mục tiêu của tôi khi đến quán cà phê này là có thể uống cà phê và tiếp tục ngày làm việc của mình. Hôm nay là sáng thứ năm và tôi đang vội vã giữa các cuộc họp. Tôi cần uống cà phê, nhưng không có thời gian để ngồi ở quán cà phê trong mười lăm phút.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Phần THÀNH VIÊN CỦA CHÚNG TÔI (Slider lướt từng người mượt mà theo video) */}
      <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header section */}
          <div className="text-center mb-12 sm:mb-14">
            <p className="text-[#E51E25] font-bold text-xs sm:text-sm tracking-widest uppercase mb-2">
              Nghệ nhân pha chế
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-[#2D2D2D] uppercase tracking-tight">
              THÀNH VIÊN CỦA CHÚNG TÔI
            </h2>
          </div>

          {/* Carousel container with relative buttons */}
          <div className="relative group/slider">
            
            {/* Left Button */}
            <button
              type="button"
              onClick={handlePrevTeam}
              disabled={maxTeamIndex === 0}
              className={`absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all cursor-pointer ${
                maxTeamIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-neutral-300'
                  : 'text-neutral-700 hover:text-[#E51E25] hover:border-[#E51E25] hover:scale-105 active:scale-95'
              }`}
              aria-label="Xem thành viên trước"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Right Button */}
            <button
              type="button"
              onClick={handleNextTeam}
              disabled={maxTeamIndex === 0}
              className={`absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all cursor-pointer ${
                maxTeamIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-neutral-300'
                  : 'text-neutral-700 hover:text-[#E51E25] hover:border-[#E51E25] hover:scale-105 active:scale-95'
              }`}
              aria-label="Xem thành viên kế tiếp"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Viewport */}
            <div className="overflow-hidden -mx-3 py-2">
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
                style={{
                  transform: `translateX(-${teamIndex * (100 / visibleCount)}%)`,
                }}
              >
                {TEAM_MEMBERS.map((member, idx) => (
                  <div
                    key={`${member.id}-${idx}`}
                    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 shrink-0 px-3"
                  >
                    <div className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
                      {/* Image container */}
                      <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-100 relative">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out select-none"
                          loading="lazy"
                        />
                      </div>

                      {/* Info footer box matching Video */}
                      <div className="bg-[#FBFBFB] py-5 px-3 text-center border-t border-gray-50 flex-1 flex flex-col justify-center">
                        <h3 className="font-display font-bold text-lg text-[#2D2D2D] group-hover:text-[#E51E25] transition-colors leading-tight">
                          {member.name}
                        </h3>
                        <p className="italic text-xs sm:text-sm text-neutral-500 mt-1">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Phần TỪ COFFEENA (Gallery Slider lướt từng ảnh mượt mà theo video) */}
      <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header section */}
          <div className="text-center mb-12 sm:mb-14">
            <p className="text-[#E51E25] font-bold text-xs sm:text-sm tracking-widest uppercase mb-2">
              Hình ảnh
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-[#2D2D2D] uppercase tracking-tight">
              TỪ COFFEENA
            </h2>
          </div>

          {/* Carousel container with relative buttons */}
          <div className="relative group/slider">
            
            {/* Left Button */}
            <button
              type="button"
              onClick={handlePrevGallery}
              disabled={maxGalleryIndex === 0}
              className={`absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all cursor-pointer ${
                maxGalleryIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-neutral-300'
                  : 'text-neutral-700 hover:text-[#E51E25] hover:border-[#E51E25] hover:scale-105 active:scale-95'
              }`}
              aria-label="Xem ảnh trước"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Right Button */}
            <button
              type="button"
              onClick={handleNextGallery}
              disabled={maxGalleryIndex === 0}
              className={`absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all cursor-pointer ${
                maxGalleryIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-neutral-300'
                  : 'text-neutral-700 hover:text-[#E51E25] hover:border-[#E51E25] hover:scale-105 active:scale-95'
              }`}
              aria-label="Xem ảnh kế tiếp"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Viewport */}
            <div className="overflow-hidden -mx-3 py-2">
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
                style={{
                  transform: `translateX(-${galleryIndex * (100 / visibleCount)}%)`,
                }}
              >
                {GALLERY_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 shrink-0 px-3"
                  >
                    <div 
                      onClick={() => setLightboxImage(item)}
                      className="relative aspect-square w-full overflow-hidden bg-neutral-100 group shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                      {/* Image with zoom on hover */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out select-none"
                        loading="lazy"
                      />

                      {/* Hover Overlay drawer matching frame_08 */}
                      <div className="absolute bottom-0 left-0 right-0 bg-[#EFEFEF]/95 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-3.5 shadow-md flex items-center justify-between z-20 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <div className="text-left pr-2">
                          <h4 className="font-sans font-bold text-sm sm:text-base text-[#2D2D2D] hover:text-[#E51E25] transition-colors leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {item.category}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxImage(item);
                          }}
                          className="w-8 h-8 rounded-full bg-white text-neutral-700 hover:text-[#E51E25] hover:scale-110 shadow flex items-center justify-center transition cursor-pointer"
                          title="Xem phóng to"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-smoothFadeIn cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden shadow-2xl p-2 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#E51E25] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage.image}
              alt={lightboxImage.title}
              className="w-full max-h-[80vh] object-contain mx-auto"
            />
            <div className="p-4 text-left">
              <h3 className="font-bold text-lg text-neutral-900">{lightboxImage.title}</h3>
              <p className="text-sm text-neutral-500">{lightboxImage.category}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
