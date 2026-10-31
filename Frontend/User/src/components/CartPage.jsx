import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  Search, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Truck, 
  Copy, 
  Check, 
  Info, 
  ShoppingBag, 
  Eye, 
  AlertCircle 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatVND } from '../data/products';

export default function CartPage({ navigateTo, onSelectProduct }) {
  const {
    cart,
    cartCount,
    subTotal,
    discountCode,
    discountAmount,
    shippingFee,
    finalTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyVoucher,
    setIsCheckoutOpen,
    setQuickViewProduct,
    addToCart,
    addToast
  } = useCart();

  // Delivery options state
  const [deliveryType, setDeliveryType] = useState('asap'); // 'asap' | 'schedule'
  const [deliveryDate, setDeliveryDate] = useState('2026-10-28');
  const [deliveryTime, setDeliveryTime] = useState('09:00 - 11:00');

  // Search input in empty cart
  const [emptySearch, setEmptySearch] = useState('');

  // Voucher copy state
  const [copiedCode, setCopiedCode] = useState(null);

  // Suggested products slider state & responsive visible count
  const [sliderIndex, setSliderIndex] = useState(0);
  const [suggestVisibleCount, setSuggestVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisible = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth >= 768) {
        setSuggestVisibleCount(3);
      } else if (window.innerWidth >= 640) {
        setSuggestVisibleCount(2);
      } else {
        setSuggestVisibleCount(1);
      }
    };
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  // Suggested items matching the video with large images
  const suggestedProducts = [
    {
      id: 'sug-1',
      name: 'Cafe đen nóng',
      price: 25000,
      image: '/img/cafe_den_nong_c53df31dd7bc4f23967e2a09eaf96ae9_0b832f13c2d246329e3fe1bed0627a9b_large.png',
      category: 'menu',
      description: 'Hương vị cafe đen nguyên chất thơm nồng truyền thống.'
    },
    {
      id: 'sug-2',
      name: 'Cafe muối',
      price: 30000,
      image: '/img/cafe_muoi_c4c5f099cbc248679335eba5fcbfdf0b_48fc9609567d4a7bb32467069dd60bcd_large.webp',
      category: 'menu',
      description: 'Vị đậm đà của cafe hòa quyện cùng lớp kem muối béo ngậy.'
    },
    {
      id: 'sug-3',
      name: 'Cafe sữa đá',
      price: 25000,
      originalPrice: 30000,
      discountBadge: '-17%',
      image: '/img/cafe_sua_da_ee2490f7d7dc47748ae88e323b31fa2b_eab075b7a57149fe80a152ade1b9cbc3_large.png',
      category: 'menu',
      description: 'Cafe sữa đá ngọt ngào mát lạnh đậm chất Sài Gòn.'
    },
    {
      id: 'sug-4',
      name: 'Cafe sữa nóng',
      price: 25000,
      image: '/img/cafe_sua_nong_65937f23b853420080a8190e972d3e9a_a9a31b27d34c489a972023b6d21e54ec_large.webp',
      category: 'menu',
      description: 'Ly cafe sữa ấm áp cho ngày mới tràn đầy hứng khởi.'
    },
    {
      id: 'sug-5',
      name: 'Capuchino',
      price: 38000,
      image: '/img/capuchino_2_0f38ce14337b400783e7fa3222ec7129_a7b20c54d10648e190a5dd5aff7d871f_large.png',
      category: 'menu',
      description: 'Lớp bọt sữa bồng bềnh mịn màng cùng nghệ thuật tạo hình tinh tế.'
    },
    {
      id: 'sug-6',
      name: 'Cookie đá xay',
      price: 45000,
      image: '/img/cookie_da_xay_6a17637f63bd4be2ab93b9e75b99e014_4807fca8cd5840fa80e1dc310ef80089_large.webp',
      category: 'menu',
      description: 'Đá xay xay nhuyễn cùng bánh Oreo giòn tan thơm béo.'
    }
  ];

  // Vouchers matching video
  const vouchers = [
    {
      code: 'A87TYRT55',
      title: 'Miễn phí vận chuyển',
      condition: 'Đơn hàng từ 300k',
      expiry: '10/04/2022',
      type: 'shipping',
      icon: 'truck'
    },
    {
      code: 'FT45YUO8H',
      title: 'Giảm 50k',
      condition: 'Đơn hàng từ 500k',
      expiry: '10/05/2022',
      type: 'discount',
      icon: 'coins'
    }
  ];

  // Free shipping threshold logic (200.000đ from video or 500.000đ)
  const freeShipThreshold = 200000;
  const remainingForFreeShip = Math.max(0, freeShipThreshold - subTotal);

  // Minimum order rule (400.000đ from video policy box)
  const minOrderAmount = 400000;
  const isBelowMinOrder = subTotal < minOrderAmount;

  const handleCopyVoucher = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    applyVoucher(code);
    addToast(`Đã sao chép & áp dụng mã ${code}!`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleEmptySearchSubmit = (e) => {
    e.preventDefault();
    if (emptySearch.trim()) {
      if (navigateTo) {
        navigateTo('menu');
      }
    }
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      addToast('Giỏ hàng của bạn đang trống!', 'error');
      return;
    }
    if (isBelowMinOrder) {
      addToast('Giỏ hàng chưa đạt mức tối thiểu 400.000đ để thanh toán.', 'error');
      return;
    }
    setIsCheckoutOpen(true);
  };

  // Calculate max slider index so that items always fill all visible slots completely
  const maxSuggestIndex = Math.max(0, suggestedProducts.length - suggestVisibleCount);

  useEffect(() => {
    if (sliderIndex > maxSuggestIndex) {
      setSliderIndex(maxSuggestIndex);
    }
  }, [maxSuggestIndex, sliderIndex]);

  // Shift by exactly 1 item at a time with smooth transition
  const handlePrevSuggest = () => {
    if (maxSuggestIndex === 0) return;
    setSliderIndex((prev) => (prev > 0 ? prev - 1 : maxSuggestIndex));
  };

  const handleNextSuggest = () => {
    if (maxSuggestIndex === 0) return;
    setSliderIndex((prev) => (prev < maxSuggestIndex ? prev + 1 : 0));
  };

  return (
    <div className="bg-white min-h-[75vh] py-8 sm:py-12 border-t border-gray-100 font-sans">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Breadcrumbs */}
        <nav className="text-xs sm:text-sm text-neutral-500 mb-6 flex items-center gap-1.5">
          <button 
            type="button"
            onClick={() => navigateTo && navigateTo('home')} 
            className="hover:text-[#E51E25] transition-colors cursor-pointer"
          >
            Trang chủ
          </button>
          <span>/</span>
          <span className="text-neutral-800 font-semibold">Giỏ hàng ({cartCount})</span>
        </nav>

        {/* 2. Page Title & Free Shipping Info Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-gray-200 gap-3">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1E1E1E] uppercase tracking-tight">
            Giỏ hàng của bạn
          </h1>

          <div className="text-sm sm:text-base text-neutral-700">
            {remainingForFreeShip > 0 ? (
              <p>
                Bạn cần mua thêm{' '}
                <strong className="text-[#E51E25] font-bold">
                  {formatVND(remainingForFreeShip)}
                </strong>{' '}
                để được <strong>MIỄN PHÍ VẬN CHUYỂN</strong>
              </p>
            ) : (
              <p className="text-emerald-600 font-bold">
                Đơn hàng của bạn đã được MIỄN PHÍ VẬN CHUYỂN toàn quốc! 🎉
              </p>
            )}
          </div>
        </div>

        {/* 3. Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: Empty state or Table + "Có thể bạn sẽ thích" (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Case A: Cart is Empty */}
            {cart.length === 0 ? (
              <div className="text-center py-10 px-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
                
                {/* SVG Cute Purple Bag with Confetti matching Screenshot */}
                <div className="w-52 h-44 sm:w-60 sm:h-52 relative flex items-center justify-center select-none">
                  <svg viewBox="0 0 240 200" className="w-full h-full">
                    {/* Clouds */}
                    <path d="M40 70 Q55 55 70 70 Q85 60 95 75 Q105 90 90 95 L40 95 Z" fill="#F3F4F6" opacity="0.8" />
                    <path d="M150 60 Q165 45 180 60 Q195 50 205 65 Q215 80 200 85 L150 85 Z" fill="#F3F4F6" opacity="0.8" />

                    {/* Floating Confetti Shapes */}
                    <circle cx="55" cy="50" r="3" fill="#60A5FA" />
                    <circle cx="175" cy="45" r="4" fill="#3B82F6" />
                    <circle cx="85" cy="35" r="2.5" fill="#A855F7" />
                    <circle cx="150" cy="115" r="3" fill="#06B6D4" />
                    
                    {/* Plus signs */}
                    <path d="M60 115 L66 115 M63 112 L63 118" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
                    <path d="M185 110 L191 110 M188 107 L188 113" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" />

                    {/* Diamonds */}
                    <polygon points="175,75 180,82 175,89 170,82" fill="#0EA5E9" />
                    <polygon points="60,140 65,145 60,150 55,145" fill="#38BDF8" />
                    <polygon points="187,135 192,140 187,145 182,140" fill="#CBD5E1" />

                    {/* Shopping Bag Shadow */}
                    <ellipse cx="120" cy="175" rx="50" ry="8" fill="#E2E8F0" />

                    {/* Purple Shopping Bag Body */}
                    <rect x="80" y="70" width="80" height="95" rx="10" fill="#8B7FB8" />
                    <polygon points="80,70 160,70 152,62 88,62" fill="#786B9C" />

                    {/* Handles */}
                    <path d="M100 70 C100 45, 140 45, 140 70" fill="none" stroke="#6D618E" strokeWidth="4" strokeLinecap="round" />

                    {/* Tag hanging */}
                    <polygon points="152,72 165,65 170,75 157,82" fill="#4C3F6E" />

                    {/* Cute Sad Face */}
                    <circle cx="106" cy="118" r="3.5" fill="#2E234A" />
                    <circle cx="134" cy="118" r="3.5" fill="#2E234A" />
                    {/* Sad mouth curve */}
                    <path d="M113 138 Q120 130 127 138" fill="none" stroke="#2E234A" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>

                <h3 className="font-bold text-lg sm:text-xl text-neutral-800 mt-2">
                  Chưa có sản phẩm trong giỏ hàng...
                </h3>
                
                <p className="text-sm text-neutral-500 mt-1.5 max-w-md">
                  Bạn có thể quay về{' '}
                  <button
                    type="button"
                    onClick={() => navigateTo && navigateTo('home')}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    trang chủ
                  </button>{' '}
                  hoặc nhập từ khoá sản phẩm bạn cần tìm ở đây:
                </p>

                {/* Search Bar in Empty Cart */}
                <form 
                  onSubmit={handleEmptySearchSubmit} 
                  className="mt-5 w-full max-w-md flex items-center relative"
                >
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={emptySearch}
                    onChange={(e) => setEmptySearch(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg pl-4 pr-11 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#E51E25] focus:ring-1 focus:ring-[#E51E25] shadow-sm transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 p-1.5 text-neutral-400 hover:text-[#E51E25] transition-colors cursor-pointer"
                    aria-label="Tìm kiếm"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>

              </div>
            ) : (
              /* Case B: Cart Has Items Table */
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-neutral-600 uppercase tracking-wider">
                        <th className="py-3.5 px-4 sm:px-6">Sản phẩm</th>
                        <th className="py-3.5 px-4 text-center">Đơn giá</th>
                        <th className="py-3.5 px-4 text-center">Số lượng</th>
                        <th className="py-3.5 px-4 text-right">Tổng cộng</th>
                        <th className="py-3.5 px-4 text-center">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {cart.map((item) => (
                        <tr key={item.key} className="hover:bg-gray-50/50 transition">
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center gap-3.5">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 rounded-lg object-contain bg-neutral-50 border border-gray-100 shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-neutral-900 hover:text-[#E51E25] transition-colors cursor-pointer">
                                  {item.name}
                                </h4>
                                {item.selectedOptions && (
                                  <p className="text-xs text-neutral-500 mt-0.5">
                                    {item.selectedOptions.size && `Size: ${item.selectedOptions.size}`}
                                    {item.selectedOptions.sugar && ` • ${item.selectedOptions.sugar}`}
                                    {item.selectedOptions.ice && ` • ${item.selectedOptions.ice}`}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-center font-semibold text-neutral-800">
                            {formatVND(item.price)}
                          </td>

                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.key, item.quantity - 1)}
                                className="p-1.5 text-neutral-500 hover:text-[#E51E25] hover:bg-gray-50 transition cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-9 text-center text-xs font-bold text-neutral-800">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.key, item.quantity + 1)}
                                className="p-1.5 text-neutral-500 hover:text-[#E51E25] hover:bg-gray-50 transition cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-right font-bold text-[#E51E25]">
                            {formatVND(item.price * item.quantity)}
                          </td>

                          <td className="py-4 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.key)}
                              className="p-1.5 text-neutral-400 hover:text-red-600 transition cursor-pointer"
                              title="Xóa món này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bottom of cart table: Clear cart & Continue shopping */}
                <div className="p-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => navigateTo && navigateTo('menu')}
                    className="text-sm font-semibold text-neutral-700 hover:text-[#E51E25] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Tiếp tục chọn món</span>
                  </button>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-neutral-500 hover:text-red-600 transition cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                </div>
              </div>
            )}

            {/* "Có thể bạn sẽ thích" Product Recommendations Slider matching Video */}
            <div className="pt-6 border-t border-gray-100">
              <div className="mb-4">
                <h2 className="font-display font-bold text-xl sm:text-[22px] text-[#1E1E1E]">
                  Có thể bạn sẽ thích
                </h2>
              </div>

              {/* Slider with Smooth Horizontal Sliding Animation */}
              <div className="relative group/slider">
                {/* Left navigation arrow button */}
                <button
                  type="button"
                  onClick={handlePrevSuggest}
                  disabled={maxSuggestIndex === 0}
                  className={`absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all cursor-pointer ${
                    maxSuggestIndex === 0
                      ? 'opacity-40 cursor-not-allowed text-neutral-300'
                      : 'text-neutral-600 hover:text-[#E51E25] hover:border-[#E51E25] hover:scale-105 active:scale-95'
                  }`}
                  aria-label="Xem sản phẩm trước"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Right navigation arrow button */}
                <button
                  type="button"
                  onClick={handleNextSuggest}
                  disabled={maxSuggestIndex === 0}
                  className={`absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all cursor-pointer ${
                    maxSuggestIndex === 0
                      ? 'opacity-40 cursor-not-allowed text-neutral-300'
                      : 'text-neutral-600 hover:text-[#E51E25] hover:border-[#E51E25] hover:scale-105 active:scale-95'
                  }`}
                  aria-label="Xem sản phẩm kế tiếp"
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Viewport: hides horizontal overflow */}
                <div className="overflow-hidden -mx-2 sm:-mx-2.5 py-2">
                  {/* Sliding Track with smooth CSS transform */}
                  <div
                    className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
                    style={{
                      transform: `translateX(-${sliderIndex * (100 / suggestVisibleCount)}%)`,
                    }}
                  >
                    {suggestedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="w-full sm:w-1/2 md:w-1/3 shrink-0 px-2 sm:px-2.5"
                      >
                        <div className="bg-white border border-gray-200 rounded-none sm:rounded-sm p-4 sm:p-5 transition-all duration-300 hover:shadow-lg relative group flex flex-col justify-between h-full">
                          {/* Sale Badge if any */}
                          {prod.discountBadge && (
                            <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1 pointer-events-none">
                              <span className="bg-[#1E1E1E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                SALE
                              </span>
                              <span className="bg-[#1E1E1E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {prod.discountBadge}
                              </span>
                            </div>
                          )}

                          {/* Image Area */}
                          <div 
                            onClick={() => (onSelectProduct ? onSelectProduct(prod) : setQuickViewProduct(prod))}
                            className="relative aspect-square flex items-center justify-center p-3 overflow-hidden mb-3 cursor-pointer"
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
                              loading="lazy"
                            />

                            {/* Hover action overlay */}
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuickViewProduct(prod);
                                }}
                                className="w-9 h-9 rounded-full bg-white text-neutral-800 hover:bg-[#E51E25] hover:text-white transition shadow-md flex items-center justify-center cursor-pointer"
                                title="Xem nhanh"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(prod);
                                }}
                                className="w-9 h-9 rounded-full bg-white text-neutral-800 hover:bg-[#E51E25] hover:text-white transition shadow-md flex items-center justify-center cursor-pointer"
                                title="Thêm vào giỏ"
                              >
                                <ShoppingBag className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Details */}
                          <div>
                            <h4
                              onClick={() => (onSelectProduct ? onSelectProduct(prod) : setQuickViewProduct(prod))}
                              className="font-bold text-[15px] sm:text-base text-neutral-900 hover:text-[#E51E25] transition-colors leading-snug cursor-pointer line-clamp-1"
                            >
                              {prod.name}
                            </h4>
                            <div className="flex items-baseline gap-2 mt-1.5">
                              <span className="text-[#E51E25] font-extrabold text-base">
                                {formatVND(prod.price)}
                              </span>
                              {prod.originalPrice && (
                                <span className="text-neutral-400 text-xs line-through">
                                  {formatVND(prod.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary & Vouchers (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Order Summary Box matching Screenshot */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5 text-left">
              
              {/* Header with highlight */}
              <div className="border-b border-gray-200 pb-3">
                <h3 className="font-display font-extrabold text-xl text-[#1E1E1E] tracking-tight">
                  Thông tin đơn hàng
                </h3>
              </div>

              {/* Delivery Time Radio */}
              <div className="space-y-3 text-xs sm:text-sm text-neutral-700">
                <p className="font-bold text-neutral-900 uppercase text-[11px] tracking-wider">
                  THỜI GIAN GIAO HÀNG
                </p>

                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="asap"
                      checked={deliveryType === 'asap'}
                      onChange={() => setDeliveryType('asap')}
                      className="accent-[#E51E25] w-4 h-4 cursor-pointer"
                    />
                    <span>Giao khi có hàng</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="schedule"
                      checked={deliveryType === 'schedule'}
                      onChange={() => setDeliveryType('schedule')}
                      className="accent-[#E51E25] w-4 h-4 cursor-pointer"
                    />
                    <span className="flex items-center gap-1.5 text-neutral-800">
                      <Clock className="w-4 h-4 text-[#E51E25]" />
                      <span>Chọn thời gian</span>
                    </span>
                  </label>
                </div>

                {/* Sub schedule picker if active */}
                {deliveryType === 'schedule' && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2 mt-2 animate-fadeIn text-xs">
                    <div>
                      <label className="block text-neutral-600 mb-1">Ngày giao:</label>
                      <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-neutral-800"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-600 mb-1">Khung giờ:</label>
                      <select
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-neutral-800"
                      >
                        <option value="08:00 - 10:00">08:00 - 10:00</option>
                        <option value="10:00 - 12:00">10:00 - 12:00</option>
                        <option value="13:00 - 15:00">13:00 - 15:00</option>
                        <option value="15:00 - 17:00">15:00 - 17:00</option>
                        <option value="17:00 - 19:00">17:00 - 19:00</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Total Row */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <span className="font-bold text-neutral-800 text-base">Tổng tiền:</span>
                <span className="font-display font-extrabold text-2xl text-[#E51E25]">
                  {formatVND(subTotal)}
                </span>
              </div>

              {/* Bullets */}
              <ul className="space-y-1.5 text-xs text-neutral-500 leading-relaxed list-disc list-inside">
                <li>Phí vận chuyển sẽ được tính ở trang thanh toán.</li>
                <li>Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.</li>
              </ul>

              {/* Minimum order pink alert matching Screenshot */}
              {isBelowMinOrder && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-[#E51E25] font-medium leading-relaxed">
                  Giỏ hàng của bạn hiện chưa đạt mức tối thiểu để thanh toán.
                </div>
              )}

              {/* Big Checkout CTA */}
              <button
                type="button"
                onClick={handleCheckoutClick}
                className="w-full bg-[#3E3B3B] hover:bg-[#E51E25] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-lg uppercase tracking-wider transition-colors duration-200 shadow-sm cursor-pointer"
              >
                THANH TOÁN
              </button>
            </div>

            {/* Policy Box (Light Cyan) matching Screenshot */}
            <div className="bg-[#EAF6F8] border border-[#D5EEF2] rounded-xl p-4.5 text-left text-neutral-700 space-y-1.5">
              <h4 className="font-bold text-sm text-neutral-900">
                Chính sách mua hàng:
              </h4>
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed">
                Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá trị tối thiểu <strong className="text-neutral-900 font-bold">400.000đ</strong> trở lên.
              </p>
            </div>

            {/* "Khuyến mãi dành cho bạn" Box matching Screenshot */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm sm:text-base text-neutral-900">
                  Khuyến mãi dành cho bạn
                </h4>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <ArrowLeft className="w-4 h-4 cursor-pointer hover:text-neutral-700" />
                  <ArrowRight className="w-4 h-4 cursor-pointer hover:text-neutral-700" />
                </div>
              </div>

              {/* Vouchers List */}
              <div className="space-y-3">
                {vouchers.map((v) => (
                  <div
                    key={v.code}
                    className="p-3.5 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 flex items-center justify-between gap-3 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Red Icon Graphic */}
                      <div className="w-10 h-10 rounded-lg bg-red-100/70 text-[#E51E25] flex items-center justify-center shrink-0">
                        {v.icon === 'truck' ? (
                          <Truck className="w-5 h-5" />
                        ) : (
                          <span className="font-black text-sm">50k</span>
                        )}
                      </div>

                      <div className="min-w-0 text-xs">
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-neutral-900 truncate">
                            {v.title}
                          </p>
                          <Info className="w-3 h-3 text-neutral-400 shrink-0" />
                        </div>
                        <p className="text-neutral-500 text-[11px] mt-0.5">
                          {v.condition}
                        </p>
                        <p className="text-neutral-400 text-[10px] mt-0.5">
                          Mã: <span className="font-semibold text-neutral-700">{v.code}</span> • HSD: {v.expiry}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyVoucher(v.code)}
                      className="px-3 py-1.5 bg-[#E51E25] hover:bg-[#C9141A] text-white text-xs font-bold rounded-full shrink-0 shadow-sm transition cursor-pointer"
                    >
                      {copiedCode === v.code ? 'Đã sao chép' : 'Sao chép mã'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

