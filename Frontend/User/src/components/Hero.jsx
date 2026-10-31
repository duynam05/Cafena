import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // High-resolution banners directly from the /img folder
  const banners = [
    {
      id: 1,
      image: '/img/home1.webp',
      alt: 'Organic Coffee Khuyến Mãi Lên Đến 50%',
      link: '#menu'
    },
    {
      id: 2,
      image: '/img/home2.webp',
      alt: 'Coffeena - Thế hệ cà phê Đam mê & Sáng tạo',
      link: '#menu'
    },
    {
      id: 3,
      image: '/img/home3.webp',
      alt: 'Quầy pha chế Barista chuyên nghiệp',
      link: '#about'
    },
    {
      id: 4,
      image: '/img/home4.webp',
      alt: 'Không gian trải nghiệm quán cà phê hiện đại',
      link: '#about'
    }
  ];

  // Auto transition every 5 seconds when not hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, banners.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  return (
    <section id="home" className="w-full bg-white relative z-0 select-none">
      {/* 
        Hero Banner Carousel Container:
        - Uses original high-res images from /img (home1, home2, home3, home4)
        - Perfectly positioned below the header
      */}
      <div 
        className="relative w-full overflow-hidden aspect-[1024/346] min-h-[300px] sm:min-h-[440px] md:min-h-[540px] lg:min-h-[620px] xl:min-h-[660px] bg-neutral-100 group shadow-inner"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slides Stack with Smooth Crossfade Dissolve */}
        {banners.map((banner, index) => {
          const isActive = currentSlide === index;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out gpu-layer ${
                isActive
                  ? 'opacity-100 z-10 scale-100'
                  : 'opacity-0 z-0 scale-[1.01] pointer-events-none'
              }`}
            >
              <a href={banner.link} className="block w-full h-full cursor-pointer">
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="w-full h-full object-cover object-top sm:object-center"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                />
              </a>
            </div>
          );
        })}

        {/* Left Navigation Arrow (<) */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 sm:w-14 h-11 sm:h-14 rounded-full bg-white/80 hover:bg-[#E51E25] text-neutral-800 hover:text-white shadow-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm cursor-pointer hover:scale-110 active:scale-90"
          aria-label="Slide trước"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 -translate-x-0.5" />
        </button>

        {/* Right Navigation Arrow (>) - Turns solid red on hover matching video & screenshot */}
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 sm:w-14 h-11 sm:h-14 rounded-full bg-white/80 hover:bg-[#E51E25] text-neutral-800 hover:text-white shadow-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm cursor-pointer hover:scale-110 active:scale-90"
          aria-label="Slide tiếp theo"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 translate-x-0.5" />
        </button>

        {/* Dots Pagination Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out cursor-pointer ${
                currentSlide === idx 
                  ? 'w-7 sm:w-9 bg-[#E51E25] shadow-lg scale-105' 
                  : 'w-2 sm:w-2.5 bg-white/80 hover:bg-white shadow-sm'
              }`}
              aria-label={`Chuyển đến banner ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
