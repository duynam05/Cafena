import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Banknote, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatVND } from '../data/products';

export default function CheckoutModal() {
  const {
    cart,
    cartCount,
    finalTotal,
    discountAmount,
    shippingFee,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    addToast
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'cod'
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState('');

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      addToast('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng', 'error');
      return;
    }

    const generatedCode = 'CFN-' + Math.floor(100000 + Math.random() * 900000);
    setOrderCode(generatedCode);
    setIsSuccess(true);

    // Save order into localStorage for Admin Dashboard real-time tracking
    try {
      const newOrder = {
        id: generatedCode,
        code: generatedCode,
        customerName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        note: formData.note || '',
        paymentMethod: formData.paymentMethod || 'cod',
        items: [...cart],
        itemCount: cartCount,
        discountAmount,
        shippingFee,
        finalTotal,
        status: 'pending', // 'pending' | 'shipping' | 'completed' | 'cancelled'
        createdAt: new Date().toISOString()
      };
      const existing = JSON.parse(localStorage.getItem('cafena_orders') || '[]');
      localStorage.setItem('cafena_orders', JSON.stringify([newOrder, ...existing]));
    } catch (err) {
      console.error('Error saving order for admin:', err);
    }

    clearCart();
    addToast(`Đặt hàng thành công! Mã đơn: #${generatedCode}`, 'success');
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl z-10 p-6 sm:p-8 my-8 text-neutral-900 border border-gray-100">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 text-neutral-500 hover:text-neutral-900 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs uppercase tracking-widest font-extrabold text-[#E51E25] bg-red-50 px-2.5 py-0.5 rounded-full">
                XÁC NHẬN ĐƠN HÀNG
              </span>
            </div>
            <h3 className="font-display text-2xl font-black text-neutral-900 mt-2">
              Thông Tin Giao Hàng & Thanh Toán
            </h3>
            <p className="text-xs text-neutral-500 mt-1 mb-6">
              Bạn đang đặt ({cartCount}) món với tổng giá trị <strong className="text-[#E51E25] font-bold">{formatVND(finalTotal)}</strong>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Họ và tên người nhận *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#E51E25]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#E51E25]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Địa chỉ giao hàng chi tiết *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#E51E25]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Ghi chú cho Barista / Shipper
                </label>
                <textarea
                  rows="2"
                  placeholder="Giao giờ hành chính, gọi trước khi đến..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#E51E25]"
                />
              </div>

              {/* Payment Methods */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-neutral-700 mb-2">
                  Phương thức thanh toán:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'cod', name: 'COD (Tiền mặt)', icon: Banknote },
                    { id: 'vnpay', name: 'VNPAY QR', icon: CreditCard },
                    { id: 'zalopay', name: 'Ví ZaloPay', icon: CreditCard },
                    { id: 'momo', name: 'Ví MoMo', icon: CreditCard }
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = formData.paymentMethod === method.id;
                    return (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between text-xs transition-all ${
                          isSelected
                            ? 'bg-red-50 border-[#E51E25] text-[#E51E25] font-bold shadow-sm'
                            : 'bg-white border-gray-200 text-neutral-600 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-[#E51E25]' : 'text-neutral-400'}`} />
                        <span>{method.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1.5 text-xs text-neutral-600 mt-4">
                <div className="flex justify-between">
                  <span>Phí ship:</span>
                  <span className={shippingFee === 0 ? 'text-emerald-600 font-bold' : 'text-neutral-900 font-medium'}>
                    {shippingFee === 0 ? 'Freeship 0đ' : formatVND(shippingFee)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#E51E25] font-semibold">
                    <span>Đã giảm giá:</span>
                    <span>-{formatVND(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-gray-200">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-[#E51E25] font-display text-base font-black">{formatVND(finalTotal)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full mt-4 py-3.5 bg-[#E51E25] hover:bg-[#D3171D] text-white font-extrabold text-xs rounded-xl uppercase tracking-wider shadow-lg shadow-red-500/25 transition-all"
              >
                Xác Nhận Đặt Hàng Ngay
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-8 space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-extrabold">
                <Sparkles className="w-3.5 h-3.5" /> ĐẶT HÀNG THÀNH CÔNG
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-neutral-900">
                Cảm Ơn Bạn Đã Chọn Cafena!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                Đơn hàng của bạn đã được tiếp nhận và nhân viên pha chế đang chuẩn bị những mẻ cà phê tươi ngon nhất cho bạn.
              </p>
            </div>

            {/* Order Code Card */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 max-w-sm mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-neutral-500">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-[#E51E25]">{orderCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Khách hàng:</span>
                <span className="text-neutral-900 font-bold">{formData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Số điện thoại:</span>
                <span className="text-neutral-900 font-medium">{formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Thời gian giao:</span>
                <span className="text-emerald-700 font-bold">30 - 45 phút</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-8 py-3 bg-[#E51E25] hover:bg-[#D3171D] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
            >
              Tiếp Tục Mua Sắm
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
