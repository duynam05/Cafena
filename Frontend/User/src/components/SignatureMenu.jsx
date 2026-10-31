import React from 'react';
import { useCart } from '../context/CartContext';

export const SIGNATURE_DRINKS_LEFT = [
  {
    id: 'sig-1',
    name: 'Cafe đen nóng',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: null,
    image: '/img/cafe_den_nong_c53df31dd7bc4f23967e2a09eaf96ae9_0b832f13c2d246329e3fe1bed0627a9b_small.webp',
    link: '#product-cafe-den-nong'
  },
  {
    id: 'sig-2',
    name: 'Cafe sữa đá',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: 30000,
    image: '/img/cafe_sua_da_ee2490f7d7dc47748ae88e323b31fa2b_eab075b7a57149fe80a152ade1b9cbc3_small.webp',
    link: '#product-cafe-sua-da'
  },
  {
    id: 'sig-3',
    name: 'Capuchino',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 38000,
    originalPrice: null,
    image: '/img/capuchino_2_0f38ce14337b400783e7fa3222ec7129_a7b20c54d10648e190a5dd5aff7d871f_small.webp',
    link: '#product-capuchino'
  }
];

export const SIGNATURE_DRINKS_RIGHT = [
  {
    id: 'sig-4',
    name: 'Cafe muối',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 30000,
    originalPrice: null,
    image: '/img/cafe_muoi_c4c5f099cbc248679335eba5fcbfdf0b_48fc9609567d4a7bb32467069dd60bcd_small.webp',
    link: '#product-cafe-muoi'
  },
  {
    id: 'sig-5',
    name: 'Cafe sữa nóng',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: null,
    image: '/img/cafe_sua_nong_65937f23b853420080a8190e972d3e9a_a9a31b27d34c489a972023b6d21e54ec_small.webp',
    link: '#product-cafe-sua-nong'
  },
  {
    id: 'sig-6',
    name: 'Cookie đá xay',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 45000,
    originalPrice: null,
    image: '/img/cookie_da_xay_6a17637f63bd4be2ab93b9e75b99e014_4807fca8cd5840fa80e1dc310ef80089_small.webp',
    link: '#product-cookie-da-xay'
  }
];

export function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

export default function SignatureMenu({ onSelectProduct }) {
  const { setQuickViewProduct } = useCart();

  const renderCard = (item) => (
    <a
      key={item.id}
      href={item.link}
      onClick={(e) => {
        e.preventDefault();
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
    >
      {/* Drink Image on the left */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 ease-out"
          loading="lazy"
        />
      </div>

      {/* Drink Title & Description in the middle */}
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

      {/* Drink Price on the right */}
      <div className="text-right shrink-0">
        <span className="font-display font-bold text-base sm:text-lg text-[#E51E25] block">
          {formatVND(item.price)}
        </span>
        {item.originalPrice && (
          <span className="line-through text-xs sm:text-sm text-neutral-400 block mt-0.5 font-medium">
            {formatVND(item.originalPrice)}
          </span>
        )}
      </div>
    </a>
  );

  return (
    <section id="signature-menu" className="py-20 sm:py-24 bg-white relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading: Menu đặc trưng - ƯA THÍCH TẠI COFFEENA */}
        <div className="text-center mb-14 sm:mb-16">
          <p className="text-[#C45A38] font-bold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">
            Menu đặc trưng
          </p>
          <h2 className="font-display text-[39px] font-extrabold font-[800] text-[#3E3B3B] tracking-normal uppercase leading-tight">
            ƯA THÍCH TẠI COFFEENA
          </h2>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Left Column (Cafe đen nóng, Cafe sữa đá, Capuchino) */}
          <div className="space-y-5 sm:space-y-6">
            {SIGNATURE_DRINKS_LEFT.map(renderCard)}
          </div>

          {/* Right Column (Cafe muối, Cafe sữa nóng, Cookie đá xay) */}
          <div className="space-y-5 sm:space-y-6">
            {SIGNATURE_DRINKS_RIGHT.map(renderCard)}
          </div>
        </div>

      </div>
    </section>
  );
}

