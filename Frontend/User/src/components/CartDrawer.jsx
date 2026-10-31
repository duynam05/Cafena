import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatVND } from '../data/products';

export default function CartDrawer() {
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
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  const freeShipThreshold = 200000;
  const progressPercent = Math.min(100, Math.round((subTotal / freeShipThreshold) * 100));
  const remainingForFreeShip = Math.max(0, freeShipThreshold - subTotal);

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (inputCode) {
      applyVoucher(inputCode);
      setInputCode('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isCartOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none delay-300'
      }`}
    >
      {/* Backdrop with smooth opacity transition */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        {/* Drawer panel with smooth horizontal translate */}
        <div 
          className={`w-screen max-w-md bg-white border-l border-gray-100 text-neutral-900 flex flex-col shadow-2xl transform transition-transform duration-300 ease-out gpu-layer ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-[#E51E25]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-neutral-900">Giỏ Hàng Của Bạn</h3>
                <p className="text-xs text-neutral-500">({cartCount} món đã chọn)</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Đóng giỏ hàng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Freeship Progress Bar */}
          <div className="px-5 py-3.5 bg-red-50/70 border-b border-red-100 text-xs">
            {remainingForFreeShip > 0 ? (
              <p className="text-neutral-700">
                Mua thêm <strong className="text-[#E51E25] font-bold">{formatVND(remainingForFreeShip)}</strong> để được <strong className="text-[#E51E25]">Freeship 0đ</strong>!
              </p>
            ) : (
              <p className="text-emerald-700 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bạn đủ điều kiện nhận Freeship toàn quốc!</span>
              </p>
            )}
            <div className="w-full bg-white rounded-full h-2 mt-2 overflow-hidden border border-red-200">
              <div
                className="bg-gradient-to-r from-red-500 to-[#E51E25] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-50 mx-auto flex items-center justify-center text-[#E51E25]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-display text-base font-bold text-neutral-800">Giỏ hàng đang trống</h4>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Hãy chọn cho mình những món cà phê thơm ngon với ưu đãi lên đến 50% hôm nay!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 bg-[#E51E25] hover:bg-[#D3171D] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Khám phá thực đơn ngay
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm flex gap-3.5 items-center relative group hover:border-red-200 transition-colors"
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-xs sm:text-sm font-bold text-neutral-900 truncate">
                      {item.name}
                    </h4>

                    {/* Options Tag */}
                    <div className="flex flex-wrap gap-1 mt-1 text-[11px] text-neutral-500">
                      {item.size && (
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded font-medium">
                          {item.size}
                        </span>
                      )}
                      {item.sugar && (
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded font-medium">
                          {item.sugar}
                        </span>
                      )}
                      {item.ice && (
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded font-medium">
                          {item.ice}
                        </span>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="text-xs font-bold text-[#E51E25] mt-1.5">
                      {formatVND(item.price)}
                    </div>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="flex flex-col items-end justify-between self-stretch">
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-neutral-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                      title="Xóa món"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="text-neutral-600 hover:text-black p-0.5 cursor-pointer"
                        aria-label="Giảm"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="text-neutral-600 hover:text-black p-0.5 cursor-pointer"
                        aria-label="Tăng"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-white space-y-4 shadow-lg">
              
              {/* Voucher Input */}
              <form onSubmit={handleApplyVoucher} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Nhập mã (CAFENA20)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full bg-gray-50 text-xs text-neutral-900 placeholder:text-gray-400 rounded-xl pl-9 pr-3 py-2.5 border border-gray-200 focus:border-[#E51E25] focus:outline-none uppercase font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Áp dụng
                </button>
              </form>

              {/* Price Details */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-1">
                <div className="flex justify-between">
                  <span>Tạm tính ({cartCount} món):</span>
                  <span className="text-neutral-900 font-semibold">{formatVND(subTotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#E51E25] font-semibold">
                    <span>Mã giảm giá ({discountCode}):</span>
                    <span>-{formatVND(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span className={shippingFee === 0 ? 'text-emerald-600 font-bold' : 'text-neutral-900 font-medium'}>
                    {shippingFee === 0 ? 'Freeship 0đ' : formatVND(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-2 border-t border-gray-100">
                  <span>Tổng thanh toán:</span>
                  <span className="text-[#E51E25] font-display text-lg">{formatVND(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedCheckout}
                className="w-full bg-[#E51E25] hover:bg-[#D3171D] text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                <span>Tiến Hành Đặt Hàng</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  window.location.hash = '#cart-page';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full text-center text-xs font-bold text-neutral-700 hover:text-[#E51E25] py-2.5 border border-gray-200 rounded-xl hover:border-[#E51E25] transition cursor-pointer"
              >
                Xem chi tiết giỏ hàng
              </button>

              <button
                onClick={clearCart}
                className="w-full text-center text-[11px] text-neutral-400 hover:text-red-600 transition-colors py-1 cursor-pointer"
              >
                Xóa tất cả món trong giỏ
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
