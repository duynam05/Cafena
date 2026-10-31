import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Plus, Minus, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatVND } from '../data/products';

export default function QuickViewModal({ onSelectProduct }) {
  const { quickViewProduct, setQuickViewProduct, addToCart, wishlist, toggleWishlist } = useCart();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedSugar, setSelectedSugar] = useState('');
  const [selectedIce, setSelectedIce] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      if (quickViewProduct.packageSizes && quickViewProduct.packageSizes.length > 0) {
        setSelectedSize(quickViewProduct.packageSizes[0]);
      } else if (quickViewProduct.options?.sizes && quickViewProduct.options.sizes.length > 0) {
        setSelectedSize(quickViewProduct.options.sizes[0]);
      } else {
        setSelectedSize('');
      }

      if (quickViewProduct.options?.sugarLevels) {
        setSelectedSugar(quickViewProduct.options.sugarLevels[0]);
      } else {
        setSelectedSugar('');
      }

      if (quickViewProduct.options?.iceLevels) {
        setSelectedIce(quickViewProduct.options.iceLevels[0]);
      } else {
        setSelectedIce('');
      }

      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.includes(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, {
      size: selectedSize,
      sugar: selectedSugar,
      ice: selectedIce,
      quantity
    });
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      <div className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl z-10 my-8 border border-gray-100">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-neutral-500 hover:text-neutral-900 shadow-sm transition-colors"
          aria-label="Đóng popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Image */}
          <div 
            onClick={() => {
              if (onSelectProduct) {
                setQuickViewProduct(null);
                onSelectProduct(quickViewProduct);
              }
            }}
            className="relative aspect-square md:aspect-auto overflow-hidden bg-gray-50 cursor-pointer group/img"
            title="Bấm để xem chi tiết sản phẩm"
          >
            <img
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
            />
            {quickViewProduct.discountPercent && (
              <span className="absolute top-4 left-4 text-xs font-black text-white bg-[#E51E25] px-3 py-1 rounded-md shadow-md uppercase tracking-wider">
                -{quickViewProduct.discountPercent}%
              </span>
            )}
          </div>

          {/* Right: Info & Selectors */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
            
            <div className="space-y-4">
              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-neutral-800">{quickViewProduct.rating}</span>
                  <span className="text-neutral-400">({quickViewProduct.reviewsCount} đánh giá)</span>
                </div>

                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`p-2 rounded-full transition-colors ${
                    isWishlisted ? 'text-[#E51E25] bg-red-50' : 'text-neutral-400 hover:text-[#E51E25]'
                  }`}
                  title="Yêu thích"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Title & Price */}
              <div>
                <h3 
                  onClick={() => {
                    if (onSelectProduct) {
                      setQuickViewProduct(null);
                      onSelectProduct(quickViewProduct);
                    }
                  }}
                  className="font-display text-xl sm:text-2xl font-bold text-neutral-900 hover:text-[#E51E25] cursor-pointer transition-colors"
                  title="Bấm để xem trang chi tiết"
                >
                  {quickViewProduct.name}
                </h3>
                <div className="flex items-baseline gap-2.5 mt-2">
                  <span className="font-display text-2xl font-extrabold text-[#E51E25]">
                    {formatVND(quickViewProduct.price)}
                  </span>
                  {quickViewProduct.originalPrice && quickViewProduct.originalPrice > quickViewProduct.price && (
                    <span className="text-sm text-neutral-400 line-through">
                      {formatVND(quickViewProduct.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {quickViewProduct.description}
              </p>

              {/* Flavor notes & Origin */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1 text-xs text-neutral-600">
                <p>
                  <strong className="text-neutral-900">Xuất xứ:</strong> {quickViewProduct.origin}
                </p>
                {quickViewProduct.roastLevel && (
                  <p>
                    <strong className="text-neutral-900">Mức độ rang:</strong> {quickViewProduct.roastLevel}
                  </p>
                )}
                {quickViewProduct.flavorNotes && (
                  <p>
                    <strong className="text-neutral-900">Hương vị đặc trưng:</strong> {quickViewProduct.flavorNotes}
                  </p>
                )}
              </div>

              {/* Package Size / Cup Size Selection */}
              {(quickViewProduct.packageSizes || quickViewProduct.options?.sizes) && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                    Kích cỡ / Định lượng:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(quickViewProduct.packageSizes || quickViewProduct.options?.sizes).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`text-xs px-3.5 py-1.5 rounded-xl border font-semibold transition-all ${
                          selectedSize === size
                            ? 'bg-[#E51E25] text-white border-[#E51E25] shadow-sm'
                            : 'bg-white text-neutral-700 border-gray-200 hover:border-[#E51E25]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sugar Level */}
              {quickViewProduct.options?.sugarLevels && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                    Độ ngọt:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.options.sugarLevels.map((sugar) => (
                      <button
                        key={sugar}
                        onClick={() => setSelectedSugar(sugar)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all ${
                          selectedSugar === sugar
                            ? 'bg-[#E51E25] text-white border-[#E51E25]'
                            : 'bg-white text-neutral-700 border-gray-200 hover:border-[#E51E25]'
                        }`}
                      >
                        {sugar}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ice Level */}
              {quickViewProduct.options?.iceLevels && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                    Lượng đá:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.options.iceLevels.map((ice) => (
                      <button
                        key={ice}
                        onClick={() => setSelectedIce(ice)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all ${
                          selectedIce === ice
                            ? 'bg-[#E51E25] text-white border-[#E51E25]'
                            : 'bg-white text-neutral-700 border-gray-200 hover:border-[#E51E25]'
                        }`}
                      >
                        {ice}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions: Quantity & Add to Cart */}
            <div className="pt-4 border-t border-gray-100 flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-neutral-600 hover:text-black p-1"
                  aria-label="Giảm"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-neutral-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-neutral-600 hover:text-black p-1"
                  aria-label="Tăng"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {quickViewProduct.inStock !== false ? (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#E51E25] hover:bg-[#D3171D] text-white font-extrabold py-3 px-5 rounded-xl shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Thêm Vào Giỏ • {formatVND(quickViewProduct.price * quantity)}</span>
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-neutral-200 text-neutral-500 font-extrabold py-3 px-5 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                >
                  <span>Sản phẩm tạm hết hàng</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
