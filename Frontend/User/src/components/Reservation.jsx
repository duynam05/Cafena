import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { MapPin, Link2, Check, RotateCcw, X, ExternalLink } from 'lucide-react';

/**
 * ============================================================================
 * LINK GOOGLE MAPS MẶC ĐỊNH CHO COFFEENA (184 Lê Đại Hành, Quận 11, TP.HCM):
 * Bạn có thể thay đổi link trực tiếp ở biến này HOẶC dán trên giao diện web.
 * Hỗ trợ cả link thường hoặc toàn bộ đoạn mã iframe: <iframe src="..."></iframe>
 * ============================================================================
 */
export const DEFAULT_GOOGLE_MAP_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.651037568166!2d106.65345731533423!3d10.761358992331825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752eececf5b5e7%3A0xb35a588b56087796!2zMTg0IEzDqiDEkOG6oWkgSMOgbmgsIFBoxrDhu51uZyAxNSwgUXXhuq1uIDExLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2svn!4v1714000000000!5m2!1svi!2svn';

/**
 * Trích xuất đường link src từ mã nhúng iframe hoặc url Google Maps
 */
export function extractMapSrc(input) {
  if (!input) return DEFAULT_GOOGLE_MAP_URL;
  const trimmed = input.trim();
  
  // Trường hợp người dùng dán nguyên đoạn mã <iframe src="..."></iframe>
  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    return iframeMatch[1];
  }
  
  // Trường hợp người dùng dán link thông thường, kiểm tra embed
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return DEFAULT_GOOGLE_MAP_URL;
}

export default function Reservation({ defaultMapUrl = DEFAULT_GOOGLE_MAP_URL }) {
  const { addToast } = useCart();

  // Quản lý link Google Map (lưu localStorage để khi reload trang không bị mất)
  const [mapUrl, setMapUrl] = useState(() => {
    try {
      const saved = localStorage.getItem('coffeena_map_url');
      return saved ? saved : defaultMapUrl;
    } catch {
      return defaultMapUrl;
    }
  });

  // Modal / popover để người dùng tự nhập link Google Maps bất kỳ lúc nào
  const [showMapModal, setShowMapModal] = useState(false);
  const [inputMapUrl, setInputMapUrl] = useState(mapUrl);

  // Form đặt bàn
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: '',
    date: '2026-10-28',
    time: '07:43',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveMapUrl = (e) => {
    e.preventDefault();
    const cleanUrl = extractMapSrc(inputMapUrl);
    setMapUrl(cleanUrl);
    try {
      localStorage.setItem('coffeena_map_url', cleanUrl);
    } catch (err) {
      console.warn('Cannot save to localStorage', err);
    }
    setShowMapModal(false);
    if (addToast) {
      addToast('Đã cập nhật link Google Maps thành công!', 'success');
    }
  };

  const handleResetMapUrl = () => {
    setMapUrl(DEFAULT_GOOGLE_MAP_URL);
    setInputMapUrl(DEFAULT_GOOGLE_MAP_URL);
    try {
      localStorage.removeItem('coffeena_map_url');
    } catch (err) {
      console.warn('Cannot clear localStorage', err);
    }
    setShowMapModal(false);
    if (addToast) {
      addToast('Đã khôi phục link bản đồ gốc!', 'info');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      if (addToast) {
        addToast('Vui lòng điền Họ tên và Số điện thoại để đặt bàn!', 'error');
      }
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedBooking({
        ...formData,
        code: 'CFN-' + Math.floor(1000 + Math.random() * 9000)
      });

      if (addToast) {
        addToast(
          `Đặt bàn thành công! Coffeena đã nhận thông tin và sẽ gọi xác nhận đến SĐT ${formData.phone}`,
          'success'
        );
      }

      // Reset form sau khi gửi
      setFormData({
        name: '',
        phone: '',
        guests: '',
        date: '2026-10-28',
        time: '07:43',
        message: ''
      });
    }, 600);
  };

  return (
    <section id="reservation" className="py-20 sm:py-24 bg-white relative border-t border-gray-100">
      <div id="contact" className="absolute -top-12 left-0" />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading: Coffeena sẵn sàng phục vụ bạn. - ĐẶT CHỖ NGAY */}
        <div className="text-center mb-12 sm:mb-14">
          <p className="text-[#E51E25] font-semibold text-sm sm:text-base mb-2 tracking-wide">
            Coffeena sẵn sàng phục vụ bạn.
          </p>
          <h2 className="font-display text-[39px] font-extrabold font-[800] text-[#3E3B3B] tracking-normal uppercase leading-tight">
            ĐẶT CHỖ NGAY
          </h2>
        </div>

        {/* 2 Columns: Left Google Maps - Right Reservation Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          
          {/* CỘT TRÁI: GOOGLE MAPS */}
          <div className="relative w-full h-[460px] lg:h-full min-h-[460px] lg:min-h-[580px] bg-neutral-100 border border-[#EBEBEB] overflow-hidden group shadow-sm flex flex-col">
            
            {/* Nút hỗ trợ thay đổi link Google Map linh hoạt ngay trên giao diện */}
            <div className="absolute top-3 right-3 z-20">
              <button
                type="button"
                onClick={() => {
                  setInputMapUrl(mapUrl);
                  setShowMapModal(!showMapModal);
                }}
                className="bg-white/95 hover:bg-white text-neutral-800 text-xs font-semibold px-3 py-1.5 rounded shadow-md border border-gray-200 flex items-center gap-1.5 transition-all duration-200 hover:text-[#E51E25] cursor-pointer"
                title="Đổi hoặc gắn link Google Map khác"
              >
                <Link2 className="w-3.5 h-3.5 text-[#E51E25]" />
                <span>Gắn link GG Map</span>
              </button>
            </div>

            {/* Popup nhập link Google Map khi bấm nút */}
            {showMapModal && (
              <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-md w-full p-5 space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b pb-3 border-gray-200">
                    <h4 className="font-bold text-neutral-900 text-base flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#E51E25]" />
                      Cài Đặt Link Google Map
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowMapModal(false)}
                      className="text-gray-400 hover:text-neutral-800 p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveMapUrl} className="space-y-3">
                    <label className="block text-xs font-medium text-neutral-600">
                      Dán link chia sẻ hoặc mã nhúng &lt;iframe src="..."&gt; từ Google Maps:
                    </label>
                    <textarea
                      value={inputMapUrl}
                      onChange={(e) => setInputMapUrl(e.target.value)}
                      placeholder="Dán link Google Maps hoặc thẻ <iframe>..."
                      rows={3}
                      className="w-full text-xs font-mono bg-gray-50 border border-gray-300 rounded p-2.5 focus:outline-none focus:border-[#E51E25] focus:bg-white transition-colors"
                    />

                    <p className="text-[11px] text-neutral-500 leading-tight">
                      * Mẹo: Mở Google Maps &gt; Chọn địa chỉ quán &gt; Chia sẻ &gt; Nhúng bản đồ &gt; Sao chép HTML và dán vào đây.
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={handleResetMapUrl}
                        className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Mặc định
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowMapModal(false)}
                          className="text-xs px-3 py-1.5 border border-gray-200 rounded text-neutral-600 hover:bg-gray-50 cursor-pointer"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="text-xs font-bold px-3.5 py-1.5 bg-[#E51E25] text-white rounded hover:bg-[#d0171d] flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Lưu Link
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* IFRAME GOOGLE MAP CHÍNH THỨC */}
            <iframe
              src={mapUrl}
              title="Google Map Coffeena - 184 Lê Đại Hành"
              className="w-full h-full flex-1 border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* CỘT PHẢI: FORM ĐẶT BÀN */}
          <div className="bg-[#F8F8F8] border border-[#EBEBEB] p-6 sm:p-8 lg:p-10 flex flex-col justify-between shadow-sm">
            <div>
              {/* Tag #Reservation */}
              <p className="text-[#E51E25] font-semibold text-sm sm:text-base mb-1 tracking-wide">
                #Reservation
              </p>

              {/* Title: ĐẶT BÀN */}
              <h3 className="font-condensed font-bold text-3xl sm:text-[36px] text-[#2D2D2D] uppercase tracking-wide mb-6 leading-tight">
                ĐẶT BÀN
              </h3>

              {/* Form Inputs */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. Họ và tên */}
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Họ và tên"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white border border-[#E5E5E5] px-4 py-3 text-neutral-800 placeholder:text-neutral-400 text-sm sm:text-base focus:outline-none focus:border-[#E51E25] transition-colors"
                  />
                </div>

                {/* 2. Số điện thoại */}
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white border border-[#E5E5E5] px-4 py-3 text-neutral-800 placeholder:text-neutral-400 text-sm sm:text-base focus:outline-none focus:border-[#E51E25] transition-colors"
                  />
                </div>

                {/* 3. Số khách */}
                <div>
                  <input
                    type="number"
                    name="guests"
                    placeholder="Số khách"
                    min="1"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#E5E5E5] px-4 py-3 text-neutral-800 placeholder:text-neutral-400 text-sm sm:text-base focus:outline-none focus:border-[#E51E25] transition-colors"
                  />
                </div>

                {/* 4. Ngày đặt bàn */}
                <div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#E5E5E5] px-4 py-3 text-neutral-800 placeholder:text-neutral-400 text-sm sm:text-base focus:outline-none focus:border-[#E51E25] transition-colors cursor-pointer"
                  />
                </div>

                {/* 5. Giờ đặt bàn */}
                <div>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#E5E5E5] px-4 py-3 text-neutral-800 placeholder:text-neutral-400 text-sm sm:text-base focus:outline-none focus:border-[#E51E25] transition-colors cursor-pointer"
                  />
                </div>

                {/* 6. Nội dung ghi chú */}
                <div>
                  <textarea
                    name="message"
                    placeholder="Nội dung"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#E5E5E5] px-4 py-3 text-neutral-800 placeholder:text-neutral-400 text-sm sm:text-base focus:outline-none focus:border-[#E51E25] transition-colors resize-none"
                  />
                </div>

                {/* 7. Nút ĐẶT BÀN màu đỏ chuẩn theo ảnh */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#E51E25] hover:bg-[#c9181e] active:scale-[0.99] text-white font-bold py-3.5 px-6 uppercase tracking-wider text-base sm:text-lg transition-all duration-200 cursor-pointer shadow-sm mt-2 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐẶT BÀN'}
                </button>
              </form>
            </div>

            {/* Thông báo xác nhận đặt bàn thành công nếu vừa submit */}
            {submittedBooking && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-800 text-xs sm:text-sm rounded flex items-center justify-between">
                <div>
                  <span className="font-bold">Đã nhận yêu cầu đặt bàn!</span> Mã: <strong>{submittedBooking.code}</strong> ({submittedBooking.name} - {submittedBooking.phone})
                </div>
                <button
                  type="button"
                  onClick={() => setSubmittedBooking(null)}
                  className="text-green-600 hover:text-green-800 ml-2"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
