import React, { useState } from 'react';
import { ZoomIn, X } from 'lucide-react';

export const GALLERY_ITEMS = [
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

export default function Gallery() {
  const [lightboxImage, setLightboxImage] = useState(null);

  return (
    <section id="gallery" className="py-20 sm:py-24 bg-white relative border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading: Những điều thú vị - HOẠT ĐỘNG CỦA COFFEENA */}
        <div className="text-center mb-14 sm:mb-16">
          <p className="text-[#C45A38] font-bold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">
            Những điều thú vị
          </p>
          <h2 className="font-display text-[39px] font-extrabold font-[800] text-[#3E3B3B] tracking-normal uppercase leading-tight">
            HOẠT ĐỘNG CỦA COFFEENA
          </h2>
        </div>

        {/* 6 Images Grid: 3 columns x 2 rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square w-full overflow-hidden bg-neutral-100 group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image with Zoom Scale on Hover (0.4s) */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-[400ms] ease-out"
                loading="lazy"
              />

              {/* White Overlay Drawer at the Bottom: bám sát đáy, trượt lên trong 0.4s */}
              <div className="absolute bottom-0 left-0 right-0 bg-white px-5 py-4 sm:px-6 sm:py-4.5 shadow-md flex items-center justify-between z-20 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[400ms] ease-out pointer-events-none group-hover:pointer-events-auto">
                {/* Title & Subtitle on the left: font chuẩn mẫu, chạm vào chuyển màu đỏ */}
                <div className="text-left pr-3">
                  <h4 className="font-sans font-bold text-[18px] sm:text-[19px] text-[#3E3B3B] hover:text-[#E51E25] transition-colors duration-200 cursor-pointer leading-snug">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxImage(item);
                      }}
                      className="text-left hover:text-[#E51E25] transition-colors duration-200 cursor-pointer"
                    >
                      {item.title}
                    </button>
                  </h4>
                  <p className="text-[13px] text-neutral-500 font-normal mt-0.5">
                    {item.category}
                  </p>
                </div>

                {/* Zoom Button on the right */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage(item);
                  }}
                  className="w-10 h-10 shrink-0 border border-neutral-200 rounded flex items-center justify-center text-neutral-800 hover:bg-[#E51E25] hover:text-white hover:border-[#E51E25] transition-colors duration-200 cursor-pointer shadow-sm"
                  title="Phóng to ảnh"
                  aria-label="Phóng to ảnh"
                >
                  <ZoomIn className="w-5 h-5 stroke-[1.8]" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal when Clicking Zoom */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white p-2 rounded-sm shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/70 hover:bg-[#E51E25] text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Modal Image */}
            <img
              src={lightboxImage.image}
              alt={lightboxImage.title}
              className="w-full max-h-[80vh] object-contain"
            />

            {/* Info Footer */}
            <div className="p-3 text-left bg-white">
              <h3 className="font-condensed font-bold text-lg text-[#3E3B3B]">
                {lightboxImage.title}
              </h3>
              <p className="text-xs text-neutral-500">
                {lightboxImage.category}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

