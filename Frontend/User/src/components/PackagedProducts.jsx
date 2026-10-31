import React, { useState } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const PACKAGED_PRODUCTS = [
  {
    id: 'packaged-1',
    name: 'Cafe 1',
    price: 410000,
    originalPrice: null,
    image: '/img/1_53dca42ae400412e9993f78087279535_large.webp',
    gallery: [
      '/img/1_53dca42ae400412e9993f78087279535_large.webp',
      '/img/2_2cc8af50a4674fe6ab472435d334e18e_large.webp',
      '/img/3_81820de77c0f4c62966c026b9639c292_large.webp'
    ],
    isOutOfStock: true,
    badge: 'HẾT HÀNG',
    description: '100% hạt cà phê mộc nguyên chất, rang đậm theo công thức truyền thống, hương vị thơm nồng nàn.'
  },
  {
    id: 'packaged-2',
    name: 'Cafe 2',
    price: 250000,
    originalPrice: 290000,
    discountPercent: 14,
    image: '/img/2_2cc8af50a4674fe6ab472435d334e18e_large.webp',
    gallery: [
      '/img/2_2cc8af50a4674fe6ab472435d334e18e_large.webp',
      '/img/3_81820de77c0f4c62966c026b9639c292_large.webp',
      '/img/4_94490edda70148eda96ac41fb39e288f_large.webp'
    ],
    isOutOfStock: false,
    badges: ['SALE', '-14%'],
    description: 'Sự kết hợp hoàn hảo giữa Arabica và Robusta hảo hạng, vị đắng dịu êm ái cùng hậu ngọt sâu.'
  },
  {
    id: 'packaged-3',
    name: 'Cafe 3',
    price: 355000,
    originalPrice: null,
    image: '/img/3_81820de77c0f4c62966c026b9639c292_large.webp',
    gallery: [
      '/img/3_81820de77c0f4c62966c026b9639c292_large.webp',
      '/img/2_2cc8af50a4674fe6ab472435d334e18e_large.webp',
      '/img/4_94490edda70148eda96ac41fb39e288f_large.webp'
    ],
    isOutOfStock: false,
    description: 'Cà phê rang mộc thượng hạng hạt Arabica Cầu Đất, hương vị trái cây tự nhiên tinh tế.'
  },
  {
    id: 'packaged-4',
    name: 'Cafe 4',
    price: 320000,
    originalPrice: null,
    image: '/img/4_94490edda70148eda96ac41fb39e288f_large.webp',
    gallery: [
      '/img/4_94490edda70148eda96ac41fb39e288f_large.webp',
      '/img/1_53dca42ae400412e9993f78087279535_large.webp',
      '/img/3_81820de77c0f4c62966c026b9639c292_large.webp'
    ],
    isOutOfStock: false,
    description: 'Dòng cà phê cao cấp Specialty Roasting thơm ngát, đánh thức mọi giác quan của người sành cà phê.'
  },
  {
    id: 'packaged-5',
    name: 'Cafe 5',
    price: 290000,
    originalPrice: null,
    image: '/img/1_53dca42ae400412e9993f78087279535_large.webp',
    gallery: [
      '/img/1_53dca42ae400412e9993f78087279535_large.webp',
      '/img/2_2cc8af50a4674fe6ab472435d334e18e_large.webp',
      '/img/4_94490edda70148eda96ac41fb39e288f_large.webp'
    ],
    isOutOfStock: false,
    description: 'Hạt cà phê nguyên chất đóng túi cao cấp giữ trọn vẹn hương vị tự nhiên tươi mới.'
  },
  {
    id: 'packaged-6',
    name: 'Cafe 6',
    price: 320000,
    originalPrice: null,
    image: '/img/4_94490edda70148eda96ac41fb39e288f_large.webp',
    gallery: [
      '/img/4_94490edda70148eda96ac41fb39e288f_large.webp',
      '/img/3_81820de77c0f4c62966c026b9639c292_large.webp',
      '/img/2_2cc8af50a4674fe6ab472435d334e18e_large.webp'
    ],
    isOutOfStock: false,
    description: 'Phiên bản cà phê thượng hạng với hương thơm quyến rũ và vị đắng đậm đà khó quên.'
  }
];

export function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

export default function PackagedProducts({ onSelectProduct }) {
  const { addToCart, setQuickViewProduct, addToast } = useCart();
  const [showAll, setShowAll] = useState(false);

  const displayedProducts = showAll ? PACKAGED_PRODUCTS : PACKAGED_PRODUCTS.slice(0, 4);

  return (
    <section id="packaged-products" className="py-20 sm:py-24 bg-white relative border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading: Thưởng thức mọi nơi - SẢN PHẨM ĐÓNG GÓI */}
        <div className="text-center mb-14 sm:mb-16">
          <p className="text-[#C45A38] font-bold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">
            Thưởng thức mọi nơi
          </p>
          <h2 className="font-display text-[39px] font-extrabold font-[800] text-[#3E3B3B] tracking-normal uppercase leading-tight">
            SẢN PHẨM ĐÓNG GÓI
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => {
            const handleCardClick = () => {
              if (onSelectProduct) {
                onSelectProduct(product);
              } else {
                setQuickViewProduct({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  image: product.image,
                  description: product.description,
                  inStock: !product.isOutOfStock
                });
              }
            };

            return (
              <div
                key={product.id}
                onClick={handleCardClick}
                className="bg-white border border-[#EBEBEB] hover:border-gray-300 hover:shadow-lg transition-all duration-300 p-5 flex flex-col justify-between group relative cursor-pointer"
                style={{ cursor: 'pointer' }}
              >
                {/* Product Image Area with Hover Actions */}
                <div 
                  className="relative aspect-square w-full flex items-center justify-center overflow-hidden bg-white cursor-pointer"
                  style={{ cursor: 'pointer' }}
                >
                  
                  {/* Badges on Top Right */}
                  {product.badge && (
                    <div className="absolute top-2 right-2 z-20 pointer-events-none">
                      <span className="bg-[#2D2D2D] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {product.badge}
                      </span>
                    </div>
                  )}
                  {product.badges && (
                    <div className="absolute top-2 right-2 z-20 flex flex-col gap-1 items-end pointer-events-none">
                      {product.badges.map((b, i) => (
                        <span
                          key={i}
                          className="bg-[#2D2D2D] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Coffee Bag Mockup Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-6 sm:p-7 group-hover:scale-105 transition-transform duration-500 ease-out cursor-pointer"
                    style={{ cursor: 'pointer' }}
                    loading="lazy"
                  />

                  {/* Hover Icons Overlay: 2 icon đẩy ra xa hẳn mép gói cafe */}
                  <div className="absolute inset-0 flex items-center justify-between px-1.5 sm:px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                    
                    {/* Icon Tìm kiếm / Xem chi tiết bên trái */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          originalPrice: product.originalPrice,
                          image: product.image,
                          description: product.description,
                          inStock: !product.isOutOfStock
                        });
                      }}
                      className="p-2 text-neutral-800 hover:text-[#E51E25] hover:scale-120 transition-all duration-200 cursor-pointer pointer-events-auto"
                      style={{ cursor: 'pointer' }}
                      title="Xem nhanh"
                      aria-label="Xem nhanh"
                    >
                      <Search className="w-6 h-6 stroke-[1.8]" />
                    </button>

                    {/* Icon Thêm giỏ hàng bên phải (CHỈ hiện khi KHÔNG hết hàng) */}
                    {!product.isOutOfStock ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            originalPrice: product.originalPrice,
                            image: product.image,
                            inStock: true
                          });
                          addToast(`Đã thêm ${product.name} vào giỏ hàng!`);
                        }}
                        className="p-2 text-neutral-800 hover:text-[#E51E25] hover:scale-120 transition-all duration-200 cursor-pointer pointer-events-auto"
                        style={{ cursor: 'pointer' }}
                        title="Thêm vào giỏ hàng"
                        aria-label="Thêm vào giỏ hàng"
                      >
                        <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
                      </button>
                    ) : (
                      <div className="w-10 h-10 pointer-events-none" />
                    )}
                  </div>

                </div>

                {/* Product Info Below */}
                <div className="mt-4 pt-2 text-left">
                  <h3
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick();
                    }}
                    className="font-display font-bold text-base sm:text-lg text-[#3E3B3B] hover:text-[#E51E25] transition-colors duration-200 cursor-pointer leading-snug"
                    style={{ cursor: 'pointer' }}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-display font-bold text-lg text-[#E51E25]">
                      {formatVND(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="line-through text-sm text-neutral-400 font-medium">
                        {formatVND(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Button "Xem thêm" */}
        <div className="text-center mt-12 sm:mt-16">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="bg-[#D02C13] hover:bg-neutral-900 text-white font-semibold text-sm px-12 py-3.5 transition-colors duration-300 shadow-sm uppercase tracking-wide cursor-pointer"
          >
            {showAll ? 'Thu gọn' : 'Xem thêm'}
          </button>
        </div>

      </div>
    </section>
  );
}

