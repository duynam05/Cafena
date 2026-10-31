import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Minus, X, ChevronDown, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatVND } from '../data/products';

export const ORDER_CAFE_ITEMS = [
  {
    id: 'sig-1',
    slug: 'cafe-den-nong',
    name: 'Cafe đen nóng',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: null,
    image: '/img/cafe_den_nong_c53df31dd7bc4f23967e2a09eaf96ae9_0b832f13c2d246329e3fe1bed0627a9b_large.png',
    category: 'menu',
    categoryName: 'Menu'
  },
  {
    id: 'sig-4',
    slug: 'cafe-muoi',
    name: 'Cafe muối',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 30000,
    originalPrice: null,
    image: '/img/cafe_muoi_c4c5f099cbc248679335eba5fcbfdf0b_48fc9609567d4a7bb32467069dd60bcd_large.webp',
    category: 'menu',
    categoryName: 'Menu'
  },
  {
    id: 'sig-2',
    slug: 'cafe-sua-da',
    name: 'Cafe sữa đá',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: 30000,
    image: '/img/cafe_sua_da_ee2490f7d7dc47748ae88e323b31fa2b_eab075b7a57149fe80a152ade1b9cbc3_large.png',
    category: 'menu',
    categoryName: 'Menu'
  },
  {
    id: 'sig-5',
    slug: 'cafe-sua-nong',
    name: 'Cafe sữa nóng',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: null,
    image: '/img/cafe_sua_nong_65937f23b853420080a8190e972d3e9a_a9a31b27d34c489a972023b6d21e54ec_large.webp',
    category: 'menu',
    categoryName: 'Menu'
  },
  {
    id: 'sig-3',
    slug: 'capuchino',
    name: 'Capuchino',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 38000,
    originalPrice: null,
    image: '/img/capuchino_2_0f38ce14337b400783e7fa3222ec7129_a7b20c54d10648e190a5dd5aff7d871f_large.png',
    category: 'menu',
    categoryName: 'Menu'
  },
  {
    id: 'sig-6',
    slug: 'cookie-da-xay',
    name: 'Cookie đá xay',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 45000,
    originalPrice: null,
    image: '/img/cookie_da_xay_6a17637f63bd4be2ab93b9e75b99e014_4807fca8cd5840fa80e1dc310ef80089_large.webp',
    category: 'menu',
    categoryName: 'Menu'
  }
];

export const ORDER_CAFE2_ITEMS = [
  {
    id: 'packaged-1',
    slug: 'cafe-1',
    name: 'Cafe 1',
    price: 410000,
    originalPrice: null,
    image: '/img/1_53dca42ae400412e9993f78087279535_large.webp',
    isOutOfStock: true,
    category: 'packaged',
    categoryName: 'Sản phẩm đóng gói'
  },
  {
    id: 'packaged-2',
    slug: 'cafe-2',
    name: 'Cafe 2',
    price: 250000,
    originalPrice: 290000,
    image: '/img/2_2cc8af50a4674fe6ab472435d334e18e_large.webp',
    isOutOfStock: false,
    category: 'packaged',
    categoryName: 'Sản phẩm đóng gói'
  },
  {
    id: 'packaged-3',
    slug: 'cafe-3',
    name: 'Cafe 3',
    price: 355000,
    originalPrice: null,
    image: '/img/3_81820de77c0f4c62966c026b9639c292_large.webp',
    isOutOfStock: false,
    category: 'packaged',
    categoryName: 'Sản phẩm đóng gói'
  },
  {
    id: 'packaged-4',
    slug: 'cafe-4',
    name: 'Cafe 4',
    price: 320000,
    originalPrice: null,
    image: '/img/4_94490edda70148eda96ac41fb39e288f_large.webp',
    isOutOfStock: false,
    category: 'packaged',
    categoryName: 'Sản phẩm đóng gói'
  },
  {
    id: 'packaged-5',
    slug: 'cafe-5',
    name: 'Cafe 5',
    price: 290000,
    originalPrice: null,
    image: '/img/1_53dca42ae400412e9993f78087279535_large.webp',
    isOutOfStock: false,
    category: 'packaged',
    categoryName: 'Sản phẩm đóng gói'
  },
  {
    id: 'packaged-6',
    slug: 'cafe-6',
    name: 'Cafe 6',
    price: 320000,
    originalPrice: null,
    image: '/img/4_94490edda70148eda96ac41fb39e288f_large.webp',
    isOutOfStock: false,
    category: 'packaged',
    categoryName: 'Sản phẩm đóng gói'
  }
];

export default function OrderPage({ onSelectProduct, navigateTo }) {
  const { cart, addToCart, updateQuantity, removeFromCart, subTotal, addToast, setIsCheckoutOpen } = useCart();
  const [activeCategory, setActiveCategory] = useState('cafe');
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('immediate');
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const sectionCafeRef = useRef(null);
  const sectionCafe2Ref = useRef(null);

  // Smooth scroll to section when category is clicked
  const scrollToSection = (cat) => {
    setActiveCategory(cat);
    const targetRef = cat === 'cafe' ? sectionCafeRef : sectionCafe2Ref;
    if (targetRef.current) {
      const topOffset = targetRef.current.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  // Scrollspy: update active category on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionCafeRef.current || !sectionCafe2Ref.current) return;
      const cafe2Top = sectionCafe2Ref.current.getBoundingClientRect().top;
      if (cafe2Top <= 200) {
        setActiveCategory('cafe-2');
      } else {
        setActiveCategory('cafe');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter items by search query
  const normalize = (str) =>
    (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd');

  const filteredCafe = ORDER_CAFE_ITEMS.filter((item) =>
    normalize(item.name).includes(normalize(searchQuery))
  );

  const filteredCafe2 = ORDER_CAFE2_ITEMS.filter((item) =>
    normalize(item.name).includes(normalize(searchQuery))
  );

  const handleCheckout = () => {
    if (cart.length === 0) {
      addToast('Giỏ hàng của bạn đang trống!', 'error');
      return;
    }
    if (subTotal < 400000) {
      addToast('Đơn hàng chưa đạt mức tối thiểu 400.000đ để thanh toán!', 'error');
      return;
    }
    if (navigateTo) {
      navigateTo('cart');
    } else if (setIsCheckoutOpen) {
      setIsCheckoutOpen(true);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-6 sm:py-8 font-sans">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 3-Column Layout matching cafena.myharavan.com/pages/order */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* =========================================================================
              CỘT TRÁI (3 cols): Sidebar Danh mục (Cafe, Cafe 2)
              ========================================================================= */}
          <aside className="lg:col-span-2 hidden lg:block sticky top-28">
            <div className="bg-white border border-gray-200/90 rounded-sm p-4 text-left shadow-sm">
              <button
                type="button"
                onClick={() => scrollToSection('cafe')}
                className={`w-full text-left font-bold text-sm tracking-wide transition-colors py-1 cursor-pointer ${
                  activeCategory === 'cafe'
                    ? 'text-[#E51E25]'
                    : 'text-neutral-500 hover:text-[#E51E25]'
                }`}
              >
                Cafe
              </button>

              {/* Dashed line under Cafe matching video */}
              <div className="border-b border-dashed border-gray-300 my-2" />

              <button
                type="button"
                onClick={() => scrollToSection('cafe-2')}
                className={`w-full text-left font-bold text-sm tracking-wide transition-colors py-1 cursor-pointer ${
                  activeCategory === 'cafe-2'
                    ? 'text-[#E51E25]'
                    : 'text-neutral-500 hover:text-[#E51E25]'
                }`}
              >
                Cafe 2
              </button>
            </div>
          </aside>

          {/* Mobile Category Bar (Horizontal Tabs) */}
          <div className="lg:hidden col-span-1 flex items-center gap-2 sticky top-20 z-30 bg-[#FAF9F6] py-2">
            <button
              type="button"
              onClick={() => scrollToSection('cafe')}
              className={`flex-1 py-2 px-3 rounded-sm font-bold text-xs uppercase tracking-wider transition ${
                activeCategory === 'cafe'
                  ? 'bg-[#E51E25] text-white shadow-sm'
                  : 'bg-white text-neutral-700 border border-gray-200'
              }`}
            >
              Cafe
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('cafe-2')}
              className={`flex-1 py-2 px-3 rounded-sm font-bold text-xs uppercase tracking-wider transition ${
                activeCategory === 'cafe-2'
                  ? 'bg-[#E51E25] text-white shadow-sm'
                  : 'bg-white text-neutral-700 border border-gray-200'
              }`}
            >
              Cafe 2
            </button>
          </div>

          {/* =========================================================================
              CỘT GIỮA (7 cols): Thanh tìm kiếm & Danh sách sản phẩm (CAFE & CAFE 2)
              ========================================================================= */}
          <main className="lg:col-span-7 space-y-6">
            
            {/* Thanh tìm kiếm sản phẩm matching video */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm"
                className="w-full h-11 pl-10 pr-10 bg-white border border-gray-300 rounded-sm text-sm text-neutral-800 focus:outline-none focus:border-[#E51E25] focus:ring-1 focus:ring-[#E51E25] placeholder:text-neutral-400 shadow-sm transition"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* SECTION 1: CAFE */}
            <section ref={sectionCafeRef} id="section-cafe" className="bg-white border border-gray-200/90 rounded-sm shadow-sm overflow-hidden">
              {/* Header Bar: CAFE */}
              <div className="bg-[#3E3B3B] text-white font-bold text-center py-2.5 uppercase tracking-wider text-sm sm:text-base select-none">
                CAFE
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100">
                {filteredCafe.length > 0 ? (
                  filteredCafe.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors"
                    >
                      {/* Left: Image */}
                      <div
                        onClick={() => onSelectProduct && onSelectProduct(item)}
                        className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center overflow-hidden cursor-pointer group"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 ease-out"
                          loading="lazy"
                        />
                      </div>

                      {/* Middle: Details */}
                      <div className="flex-1 text-left min-w-0 pr-2">
                        <h3
                          onClick={() => onSelectProduct && onSelectProduct(item)}
                          className="font-bold text-base sm:text-[17px] text-neutral-900 hover:text-[#E51E25] transition-colors cursor-pointer leading-snug"
                        >
                          {item.name}
                        </h3>
                        <p className="text-xs sm:text-[13px] text-neutral-400 font-normal mt-1 leading-relaxed line-clamp-2">
                          {item.desc}
                        </p>
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="font-bold text-base sm:text-lg text-[#E51E25]">
                            {formatVND(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="line-through text-xs sm:text-sm text-neutral-400 font-medium">
                              {formatVND(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Add (+) Button */}
                      <div className="shrink-0">
                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#E51E25] text-[#E51E25] hover:bg-[#E51E25] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                          title={`Thêm ${item.name} vào đơn`}
                          aria-label={`Thêm ${item.name}`}
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-neutral-400 text-sm">
                    Không tìm thấy món nào trong mục Cafe
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 2: CAFE 2 */}
            <section ref={sectionCafe2Ref} id="section-cafe-2" className="bg-white border border-gray-200/90 rounded-sm shadow-sm overflow-hidden">
              {/* Header Bar: CAFE 2 */}
              <div className="bg-[#3E3B3B] text-white font-bold text-center py-2.5 uppercase tracking-wider text-sm sm:text-base select-none">
                CAFE 2
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100">
                {filteredCafe2.length > 0 ? (
                  filteredCafe2.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors"
                    >
                      {/* Left: Image */}
                      <div
                        onClick={() => onSelectProduct && onSelectProduct(item)}
                        className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center overflow-hidden cursor-pointer group"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 ease-out"
                          loading="lazy"
                        />
                      </div>

                      {/* Middle: Details */}
                      <div className="flex-1 text-left min-w-0 pr-2">
                        <h3
                          onClick={() => onSelectProduct && onSelectProduct(item)}
                          className="font-bold text-base sm:text-[17px] text-neutral-900 hover:text-[#E51E25] transition-colors cursor-pointer leading-snug"
                        >
                          {item.name}
                        </h3>
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="font-bold text-base sm:text-lg text-[#E51E25]">
                            {formatVND(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="line-through text-xs sm:text-sm text-neutral-400 font-medium">
                              {formatVND(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Add (+) Button or "Hết món" Badge */}
                      <div className="shrink-0">
                        {item.isOutOfStock ? (
                          <span className="bg-[#EBEBEB] text-[#888888] text-xs font-semibold px-3 py-1.5 rounded select-none">
                            Hết món
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#E51E25] text-[#E51E25] hover:bg-[#E51E25] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                            title={`Thêm ${item.name} vào đơn`}
                            aria-label={`Thêm ${item.name}`}
                          >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-neutral-400 text-sm">
                    Không tìm thấy món nào trong mục Cafe 2
                  </div>
                )}
              </div>
            </section>

          </main>

          {/* =========================================================================
              CỘT PHẢI (3 cols): Mini Cart & Thanh toán (Sticky)
              ========================================================================= */}
          <aside className="lg:col-span-3 hidden lg:block sticky top-28">
            <div className="bg-white border border-gray-200/90 rounded-sm shadow-sm overflow-hidden text-left">
              
              {/* Dropdown Thời gian giao matching video */}
              <div className="relative border-b border-gray-200 p-3 bg-white">
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full text-xs font-bold text-neutral-800 bg-transparent cursor-pointer appearance-none uppercase tracking-wider pr-6 focus:outline-none"
                >
                  <option value="immediate">THỜI GIAN GIAO: Giao ngay khi có hàng</option>
                  <option value="08:00 - 10:00">THỜI GIAN GIAO: 08:00 - 10:00</option>
                  <option value="10:00 - 12:00">THỜI GIAN GIAO: 10:00 - 12:00</option>
                  <option value="13:00 - 15:00">THỜI GIAN GIAO: 13:00 - 15:00</option>
                  <option value="15:00 - 17:00">THỜI GIAN GIAO: 15:00 - 17:00</option>
                  <option value="17:00 - 19:00">THỜI GIAN GIAO: 17:00 - 19:00</option>
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Button Thanh toán matching video */}
              <div className="p-3 border-b border-gray-100">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full bg-[#D35147] hover:bg-[#C9141A] text-white font-bold py-3 px-4 rounded text-sm uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  Thanh toán
                </button>
              </div>

              {/* Danh sách món trong giỏ */}
              <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto px-3">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div key={item.cartItemId} className="py-3 flex items-start gap-3 relative group">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-contain bg-white border border-gray-100 rounded shrink-0 p-1"
                      />
                      <div className="flex-1 min-w-0 pr-5 text-left">
                        <h4 className="text-xs font-bold text-neutral-900 uppercase truncate">
                          {item.name}
                        </h4>
                        
                        <div className="flex items-center justify-between mt-2">
                          {/* Stepper [- 1 +] */}
                          <div className="inline-flex items-center border border-gray-200 rounded bg-white overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, -1)}
                              className="px-2 py-0.5 text-xs text-neutral-600 hover:text-black hover:bg-gray-100 transition cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-bold text-neutral-900 select-none">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, 1)}
                              className="px-2 py-0.5 text-xs text-neutral-600 hover:text-black hover:bg-gray-100 transition cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          {/* Giá món */}
                          <span className="text-xs font-bold text-neutral-800">
                            {formatVND(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>

                      {/* Nút xóa X */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="absolute top-2.5 right-0 text-neutral-400 hover:text-red-600 p-1 transition cursor-pointer"
                        title="Xóa món"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-neutral-400 text-xs space-y-2">
                    <ShoppingBag className="w-8 h-8 mx-auto stroke-[1.5] text-neutral-300" />
                    <p>Chưa có món nào trong đơn hàng</p>
                  </div>
                )}
              </div>

              {/* Tổng tiền & Cảnh báo đơn tối thiểu matching video */}
              <div className="p-3.5 border-t border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                    TỔNG TIỀN:
                  </span>
                  <span className="font-bold text-base text-[#E51E25]">
                    {formatVND(subTotal)}
                  </span>
                </div>

                {subTotal < 400000 && cart.length > 0 && (
                  <div className="mt-3 p-2.5 bg-[#FFF0F0] border border-[#FFD6D6] rounded text-[11px] text-[#E51E25] text-left leading-relaxed">
                    Giỏ hàng của bạn hiện chưa đạt mức tối thiểu để thanh toán.
                  </div>
                )}
              </div>

            </div>
          </aside>

        </div>

        {/* Mobile Floating Cart Summary Button */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            type="button"
            onClick={() => setMobileCartOpen(!mobileCartOpen)}
            className="w-full bg-[#D35147] hover:bg-[#C9141A] text-white font-bold py-3.5 px-5 rounded-xl shadow-xl flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Đơn hàng ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            </div>
            <span className="font-bold text-base">{formatVND(subTotal)}</span>
          </button>
        </div>

        {/* Mobile Cart Drawer Modal */}
        {mobileCartOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
            <div className="bg-white rounded-t-2xl max-h-[80vh] flex flex-col overflow-hidden animate-slideUp">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-base text-neutral-900">Chi tiết đơn hàng</h3>
                <button
                  type="button"
                  onClick={() => setMobileCartOpen(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 divide-y divide-gray-100 overflow-y-auto flex-1">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="py-3 flex items-center justify-between gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">{item.name}</p>
                      <p className="text-xs text-[#E51E25] font-bold mt-0.5">{formatVND(item.price)}</p>
                    </div>
                    <div className="inline-flex items-center border border-gray-200 rounded">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="px-2 py-0.5 text-xs"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="px-2 py-0.5 text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between font-bold">
                  <span>Tổng tiền:</span>
                  <span className="text-[#E51E25] text-lg">{formatVND(subTotal)}</span>
                </div>
                {subTotal < 400000 && cart.length > 0 && (
                  <p className="text-xs text-[#E51E25]">
                    Giỏ hàng của bạn hiện chưa đạt mức tối thiểu để thanh toán (400.000đ).
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full bg-[#D35147] hover:bg-[#C9141A] text-white font-bold py-3 rounded-lg text-sm uppercase"
                >
                  Thanh toán ngay
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
