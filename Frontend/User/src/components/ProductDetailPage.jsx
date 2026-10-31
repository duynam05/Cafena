import React, { useState, useEffect } from 'react';
import { 
  Minus, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  ShoppingBag, 
  Eye, 
  Share2, 
  Copy, 
  Check, 
  Tag,
  ArrowLeft,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ALL_PRODUCTS, PACKAGED_PRODUCTS, findProduct, formatVND } from '../data/products';

export default function ProductDetailPage({ product, onSelectProduct, navigateTo }) {
  const { addToCart, addToast, setQuickViewProduct, setIsCheckoutOpen } = useCart();

  // If no product provided, resolve from product prop, window hash or default
  const currentProduct = (() => {
    let p = null;
    if (product && (product.id || product.slug || product.name)) {
      p = findProduct(product.id || product.slug || product.name) || product;
    } else if (typeof window !== 'undefined' && window.location.hash.startsWith('#product-')) {
      const hashId = window.location.hash.replace('#product-', '');
      p = findProduct(hashId);
    }
    if (!p) p = findProduct('packaged-6') || PACKAGED_PRODUCTS[0];

    // Check if localStorage has updated version from Admin
    try {
      const saved = localStorage.getItem('cafena_admin_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = parsed.find(item => item.id === p.id || item.slug === p.slug);
        if (match) return match;
      }
    } catch (e) {
      console.error(e);
    }
    return p;
  })();

  const isOutOfStock = currentProduct.isOutOfStock || (currentProduct.stockQuantity !== undefined && Number(currentProduct.stockQuantity) <= 0);

  // Images gallery for current product
  const galleryImages = currentProduct.gallery && currentProduct.gallery.length > 0 
    ? currentProduct.gallery 
    : [currentProduct.image];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [relatedSliderIndex, setRelatedSliderIndex] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Keep track of recently viewed products
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('cafena_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Whenever product changes, reset active image and add to recently viewed
  useEffect(() => {
    setActiveImageIdx(0);
    setQuantity(1);
    setRelatedSliderIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== currentProduct.id);
      const updated = [currentProduct, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('cafena_recently_viewed', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  }, [currentProduct.id]);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      addToast('Sản phẩm hiện đang tạm hết hàng!', 'error');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(currentProduct);
    }
    addToast(`Đã thêm ${quantity} x ${currentProduct.name} vào giỏ hàng!`, 'success');
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      addToast('Sản phẩm hiện đang tạm hết hàng!', 'error');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(currentProduct);
    }
    if (navigateTo) {
      navigateTo('cart');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    addToast('Đã sao chép liên kết sản phẩm!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Filter out current product from related products list (match category)
  const relatedCandidates = ALL_PRODUCTS.filter(
    (p) => p.id !== currentProduct.id && p.category === currentProduct.category
  );

  const relatedProducts = relatedCandidates.length >= 4
    ? relatedCandidates
    : [
        ...relatedCandidates,
        ...ALL_PRODUCTS.filter((p) => p.id !== currentProduct.id && !relatedCandidates.some((r) => r.id === p.id))
      ];

  // Responsive visible count for related products carousel (4 desktop, 3 tablet, 2 small tablet, 1 mobile)
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

  // Max index so that visible slots are always fully populated without blank space
  const maxRelatedIndex = Math.max(0, relatedProducts.length - visibleCount);

  useEffect(() => {
    if (relatedSliderIndex > maxRelatedIndex) {
      setRelatedSliderIndex(maxRelatedIndex);
    }
  }, [maxRelatedIndex, relatedSliderIndex]);

  // Shift by exactly 1 item at a time with smooth transition
  const handlePrevRelated = () => {
    if (maxRelatedIndex === 0) return;
    setRelatedSliderIndex((prev) => (prev > 0 ? prev - 1 : maxRelatedIndex));
  };
  const handleNextRelated = () => {
    if (maxRelatedIndex === 0) return;
    setRelatedSliderIndex((prev) => (prev < maxRelatedIndex ? prev + 1 : 0));
  };

  return (
    <div className="bg-white min-h-screen py-6 sm:py-10 border-t border-gray-100 font-sans">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Breadcrumbs */}
        <nav className="text-xs sm:text-sm text-neutral-500 mb-8 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateTo && navigateTo('home')}
            className="hover:text-[#E51E25] transition-colors cursor-pointer"
          >
            Trang chủ
          </button>
          <span>/</span>
          {currentProduct.category === 'menu' ? (
            <button
              type="button"
              onClick={() => navigateTo && navigateTo('menu')}
              className="hover:text-[#E51E25] transition-colors cursor-pointer"
            >
              Menu
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (navigateTo) {
                  navigateTo('products', `#products-${currentProduct.category || 'page'}`);
                }
              }}
              className="hover:text-[#E51E25] transition-colors cursor-pointer"
            >
              {currentProduct.categoryName || 'Sản phẩm đóng gói'}
            </button>
          )}
          <span>/</span>
          <span className="text-neutral-800 font-semibold">{currentProduct.name}</span>
        </nav>

        {/* 2. Main Product Info Layout (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          
          {/* LEFT: Product Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Big Image Preview */}
            <div className="relative aspect-square w-full bg-white border border-gray-200 rounded-none sm:rounded-sm flex items-center justify-center p-6 overflow-hidden group select-none">
              
              {/* Badges on Top Right */}
              {isOutOfStock ? (
                <div className="absolute top-3 right-3 z-20 pointer-events-none">
                  <span className="bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md animate-pulse">
                    HẾT HÀNG
                  </span>
                </div>
              ) : currentProduct.badges ? (
                <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1 pointer-events-none">
                  {currentProduct.badges.map((b, idx) => (
                    <span 
                      key={idx}
                      className="bg-[#2D2D2D] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              ) : null}

              {/* Main Image with Zoom on hover */}
              <img
                src={galleryImages[activeImageIdx] || currentProduct.image}
                alt={currentProduct.name}
                className="w-full h-full object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
              />

              {/* Prev Image Arrow */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-gray-200 shadow flex items-center justify-center text-neutral-700 hover:text-[#E51E25] hover:border-[#E51E25] transition cursor-pointer opacity-80 group-hover:opacity-100"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Next Image Arrow */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-gray-200 shadow flex items-center justify-center text-neutral-700 hover:text-[#E51E25] hover:border-[#E51E25] transition cursor-pointer opacity-80 group-hover:opacity-100"
                  aria-label="Ảnh tiếp theo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Thumbnail Strip below Main Image matching Video */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-none sm:rounded-sm p-1.5 cursor-pointer transition-all duration-200 shrink-0 border-2 ${
                      activeImageIdx === idx 
                        ? 'border-[#E51E25] shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details & Purchase Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-5 text-left">
            
            {/* Title */}
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900 leading-tight">
              {currentProduct.name}
            </h1>

            {/* Stock Status matching Video */}
            <p className="text-sm text-neutral-600">
              Tình trạng:{' '}
              <span className={`font-semibold ${isOutOfStock ? 'text-red-500 font-bold' : 'text-emerald-600'}`}>
                {isOutOfStock ? 'Hết hàng' : (currentProduct.stockQuantity !== undefined ? `Còn hàng (${currentProduct.stockQuantity} sản phẩm)` : 'Còn hàng')}
              </span>
            </p>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-1 pb-2 border-b border-gray-100">
              <span className="text-[#E51E25] font-display font-extrabold text-2xl sm:text-3xl">
                {formatVND(currentProduct.price)}
              </span>
              {currentProduct.originalPrice && (
                <span className="text-neutral-400 text-base line-through">
                  {formatVND(currentProduct.originalPrice)}
                </span>
              )}
            </div>

            {/* Quantity Stepper & "Thêm vào giỏ" Button */}
            <div className="flex items-center gap-3 pt-2">
              {/* Stepper */}
              <div className="flex items-center border border-gray-300 rounded h-11 bg-white shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-gray-50 transition cursor-pointer"
                  aria-label="Giảm số lượng"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-neutral-900 select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-gray-50 transition cursor-pointer"
                  aria-label="Tăng số lượng"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 h-11 font-bold text-sm rounded transition-colors duration-200 flex items-center justify-center uppercase tracking-wider ${
                  isOutOfStock 
                    ? 'border border-gray-300 text-gray-400 bg-white cursor-not-allowed' 
                    : 'border-2 border-[#E51E25] text-[#E51E25] hover:bg-[#E51E25] hover:text-white cursor-pointer'
                }`}
              >
                {isOutOfStock ? 'HẾT HÀNG' : 'THÊM VÀO GIỎ'}
              </button>
            </div>

            {/* Buy Now Button matching Screenshot */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`w-full h-12 font-bold text-sm sm:text-base rounded uppercase tracking-wider transition-colors duration-200 shadow ${
                isOutOfStock 
                  ? 'bg-[#CBD5E1] text-white cursor-not-allowed shadow-none' 
                  : 'bg-[#E51E25] hover:bg-[#C9141A] text-white cursor-pointer'
              }`}
            >
              {isOutOfStock ? 'TẠM HẾT HÀNG' : 'MUA NGAY'}
            </button>

            {/* "Click vào đây để nhận ưu đãi" Banner Button matching Video */}
            <button
              type="button"
              onClick={() => setShowOfferModal(true)}
              className="w-full h-11 bg-[#E51E25] hover:bg-[#C9141A] text-white font-bold text-sm rounded transition-colors duration-200 shadow cursor-pointer flex items-center justify-center gap-2"
            >
              <Tag className="w-4 h-4" />
              <span>Click vào đây để nhận ưu đãi</span>
            </button>

            {/* Social Share icons matching Video */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100 text-sm text-neutral-600">
              <span className="font-medium mr-1 text-xs sm:text-sm text-neutral-700">Chia sẻ:</span>
              
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition shadow-sm"
                title="Chia sẻ lên Facebook"
              >
                <span className="font-bold text-xs sm:text-sm">f</span>
              </a>

              {/* Messenger */}
              <a
                href={`fb-messenger://share/?link=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0084FF] text-white flex items-center justify-center hover:scale-110 transition shadow-sm"
                title="Gửi qua Messenger"
              >
                <span className="font-bold text-xs">M</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(currentProduct.name)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:scale-110 transition shadow-sm"
                title="Chia sẻ lên Twitter"
              >
                <span className="font-bold text-xs">X</span>
              </a>

              {/* Pinterest */}
              <a
                href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(currentProduct.image)}&description=${encodeURIComponent(currentProduct.name)}`}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E60023] text-white flex items-center justify-center hover:scale-110 transition shadow-sm"
                title="Lưu vào Pinterest"
              >
                <span className="font-bold text-xs">P</span>
              </a>

              {/* Copy Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#14B8A6] text-white flex items-center justify-center hover:scale-110 transition shadow-sm cursor-pointer"
                title="Sao chép liên kết"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Product Description Section matching Video: "Chưa có mô tả cho sản phẩm này" */}
        <div className="border-t border-gray-200 pt-8 pb-12 text-left">
          <div className="border-b border-gray-200 mb-6">
            <span className="inline-block pb-3 border-b-2 border-neutral-900 font-display font-bold text-lg sm:text-xl text-neutral-900 uppercase tracking-wide">
              MÔ TẢ SẢN PHẨM
            </span>
          </div>

          <div className="text-neutral-600 text-sm sm:text-base leading-relaxed space-y-3">
            <p className="text-neutral-500 italic">
              {currentProduct.description || 'Chưa có mô tả cho sản phẩm này'}
            </p>
            <div className="pt-4 space-y-1.5 text-xs sm:text-sm text-neutral-700">
              <p>• <strong>Thành phần:</strong> 100% Cà phê nguyên chất tuyển chọn từ vùng nguyên liệu Cầu Đất & Buôn Ma Thuột.</p>
              <p>• <strong>Hương vị:</strong> Đậm đà, thơm nồng nàn, vị chua thanh dịu và hậu vị ngọt sâu lắng.</p>
              <p>• <strong>Bảo quản:</strong> Nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và nơi có độ ẩm cao.</p>
              <p>• <strong>Hạn sử dụng:</strong> 12 tháng kể từ ngày sản xuất.</p>
            </div>
          </div>
        </div>

        {/* 4. "Sản phẩm liên quan" Carousel matching Video */}
        <div className="border-t border-gray-200 pt-10 pb-12 text-left">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-neutral-900 uppercase tracking-tight">
              Sản phẩm liên quan
            </h2>

            {/* Carousel navigation arrows matching Video */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevRelated}
                disabled={maxRelatedIndex === 0}
                className={`w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center transition cursor-pointer ${
                  maxRelatedIndex === 0
                    ? 'opacity-40 cursor-not-allowed text-neutral-300 border-gray-200'
                    : 'text-neutral-600 hover:text-[#E51E25] hover:border-[#E51E25]'
                }`}
                aria-label="Xem sản phẩm liên quan trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextRelated}
                disabled={maxRelatedIndex === 0}
                className={`w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center transition cursor-pointer ${
                  maxRelatedIndex === 0
                    ? 'opacity-40 cursor-not-allowed text-neutral-300 border-gray-200'
                    : 'text-neutral-600 hover:text-[#E51E25] hover:border-[#E51E25]'
                }`}
                aria-label="Xem sản phẩm liên quan kế tiếp"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sliding viewport */}
          <div className="overflow-hidden -mx-3 py-2">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
              style={{
                transform: `translateX(-${relatedSliderIndex * (100 / visibleCount)}%)`,
              }}
            >
              {relatedProducts.map((item) => (
                <div
                  key={item.id}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 shrink-0 px-3"
                >
                  <div
                    onClick={() => onSelectProduct && onSelectProduct(item)}
                    className="bg-white border border-[#EBEBEB] hover:border-gray-300 hover:shadow-lg transition-all duration-300 p-5 flex flex-col justify-between group relative cursor-pointer h-full"
                  >
                    {/* Badges on Top Right */}
                    {item.badge ? (
                      <div className="absolute top-3 right-3 z-20 pointer-events-none">
                        <span className="bg-[#2D2D2D] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                          {item.badge}
                        </span>
                      </div>
                    ) : item.badges ? (
                      <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1 pointer-events-none">
                        {item.badges.map((b, idx) => (
                          <span 
                            key={idx}
                            className="bg-[#2D2D2D] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {/* Image Area with QuickView and AddToCart Hover */}
                    <div className="relative aspect-square w-full flex items-center justify-center overflow-hidden mb-4 bg-white">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
                        loading="lazy"
                      />

                      {/* Hover action overlay matching Screenshot */}
                      <div className="absolute inset-0 bg-transparent flex items-center justify-between px-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewProduct(item);
                          }}
                          className="w-10 h-10 rounded-full bg-white text-neutral-700 hover:text-[#E51E25] shadow-md flex items-center justify-center transition-transform hover:scale-110 pointer-events-auto cursor-pointer"
                          title="Xem nhanh"
                        >
                          <Search className="w-5 h-5 stroke-[1.75]" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.isOutOfStock) {
                              addToast('Sản phẩm tạm hết hàng!', 'error');
                              return;
                            }
                            addToCart(item);
                          }}
                          className="w-10 h-10 rounded-full bg-white text-neutral-700 hover:text-[#E51E25] shadow-md flex items-center justify-center transition-transform hover:scale-110 pointer-events-auto cursor-pointer"
                          title="Thêm vào giỏ"
                        >
                          <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                        </button>
                      </div>
                    </div>

                    {/* Product Title & Price matching Video & Screenshot */}
                    <div className="text-left mt-2">
                      <h3 className="font-display font-bold text-lg text-[#3E3B3B] group-hover:text-[#E51E25] transition-colors leading-tight mb-2">
                        {item.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-[#E51E25] font-extrabold text-lg sm:text-xl">
                          {formatVND(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-neutral-400 text-xs sm:text-sm line-through">
                            {formatVND(item.originalPrice)}
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

        {/* 5. "Sản phẩm đã xem" (Recently Viewed Products) matching Video */}
        {recentlyViewed.length > 0 && (
          <div className="border-t border-gray-200 pt-10 pb-16 text-left">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-neutral-900 uppercase tracking-tight mb-8">
              Sản phẩm đã xem
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.slice(0, 4).map((item) => (
                <div
                  key={`viewed-${item.id}`}
                  onClick={() => onSelectProduct && onSelectProduct(item)}
                  className="bg-white border border-[#EBEBEB] hover:border-gray-300 hover:shadow-lg transition-all duration-300 p-5 flex flex-col justify-between group relative cursor-pointer"
                >
                  <div className="relative aspect-square w-full flex items-center justify-center overflow-hidden mb-4 bg-white">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
                      loading="lazy"
                    />
                  </div>

                  <div className="text-left mt-2">
                    <h3 className="font-display font-bold text-lg text-[#3E3B3B] group-hover:text-[#E51E25] transition-colors leading-tight mb-2">
                      {item.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-[#E51E25] font-extrabold text-lg sm:text-xl">
                        {formatVND(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-neutral-400 text-xs sm:text-sm line-through">
                          {formatVND(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Offer Modal when clicking "Click vào đây để nhận ưu đãi" */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-smoothFadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-left relative shadow-2xl space-y-4">
            <button
              onClick={() => setShowOfferModal(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-[#E51E25]">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Tag className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-neutral-900">
                Ưu Đãi Đặc Biệt Cho Bạn!
              </h3>
            </div>

            <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl space-y-2 text-sm text-neutral-700">
              <p className="font-semibold text-[#E51E25]">
                Mã giảm giá: <span className="font-mono font-bold text-base bg-white px-2 py-0.5 rounded border border-red-200">COFFEENA10</span>
              </p>
              <p className="text-xs text-neutral-600">
                • Giảm ngay 10% cho đơn hàng cà phê đóng gói từ 300.000đ.
              </p>
              <p className="text-xs text-neutral-600">
                • Miễn phí giao hàng toàn quốc cho đơn từ 500.000đ.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText('COFFEENA10');
                addToast('Đã sao chép mã ưu đãi COFFEENA10!', 'success');
                setShowOfferModal(false);
              }}
              className="w-full py-3 bg-[#E51E25] hover:bg-[#c81319] text-white font-bold rounded-lg text-sm uppercase tracking-wider transition shadow cursor-pointer"
            >
              Sao chép mã & áp dụng ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

