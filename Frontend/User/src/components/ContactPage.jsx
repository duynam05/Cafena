import React, { useState } from 'react';
import { MapPin, Mail, Phone, Calendar, Send, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ContactPage() {
  const { addToast } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    content: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Vui lòng nhập tên của bạn', 'error');
      return;
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      addToast('Vui lòng nhập email hoặc số điện thoại để chúng tôi liên hệ', 'error');
      return;
    }
    if (!formData.content.trim()) {
      addToast('Vui lòng nhập nội dung thắc mắc', 'error');
      return;
    }

    setIsSubmitted(true);
    addToast('Gửi thắc mắc thành công! Chúng tôi sẽ liên lạc với bạn sớm nhất.', 'success');
    setFormData({
      name: '',
      email: '',
      phone: '',
      content: ''
    });

    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="bg-white min-h-[75vh] flex flex-col justify-start">
      {/* Khối chính 2 cột: Thông tin liên hệ (trái) & Biểu mẫu gửi thắc mắc (phải) */}
      <section className="py-12 sm:py-16 lg:py-20 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Cột trái: Thông tin liên hệ */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8 text-left">
              <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-[32px] text-[#1E1E1E] uppercase tracking-tight">
                Thông tin liên hệ
              </h1>

              <div className="space-y-5 sm:space-y-6 text-[#1E1E1E]">
                {/* Địa chỉ */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-neutral-800" />
                  </div>
                  <span className="text-[15px] sm:text-base text-neutral-700 leading-relaxed font-normal pt-1">
                    1234 Nguyễn Thị Minh Khai, phường 2, quận 3, Tp Hồ Chí Minh
                  </span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-neutral-800" />
                  </div>
                  <a 
                    href="mailto:hi@coffeena.abc" 
                    className="text-[15px] sm:text-base text-neutral-700 hover:text-[#E51E25] transition-colors duration-200 font-normal"
                  >
                    hi@coffeena.abc
                  </a>
                </div>

                {/* Số điện thoại */}
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-neutral-800" />
                  </div>
                  <a 
                    href="tel:1900000XXX" 
                    className="text-[15px] sm:text-base text-neutral-700 hover:text-[#E51E25] transition-colors duration-200 font-normal"
                  >
                    1900.000.XXX
                  </a>
                </div>

                {/* Giờ mở cửa */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-5 h-5 text-neutral-800" />
                  </div>
                  <div className="text-[15px] sm:text-base text-neutral-700 leading-relaxed font-normal pt-1">
                    <p>Thứ 2 đến Thứ 6: từ 8h đến 18h;</p>
                    <p>Thứ 7 và Chủ nhật: từ 8h00 đến 17h00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Gửi thắc mắc cho chúng tôi */}
            <div className="lg:col-span-7 bg-white rounded-xl p-6 sm:p-8 sm:border sm:border-gray-100 sm:shadow-sm">
              <div className="text-center mb-6">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1E1E1E] mb-2 tracking-tight">
                  Gửi thắc mắc cho chúng tôi
                </h2>
                <p className="text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
                  Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi, và chúng tôi sẽ liên lạc lại với bạn sớm nhất có thể .
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center animate-fadeIn my-4">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <h3 className="font-bold text-green-800 text-lg">Đã gửi thắc mắc thành công!</h3>
                  <p className="text-green-700 text-sm mt-1">
                    Cảm ơn bạn đã liên hệ với Coffeena. Đội ngũ chăm sóc khách hàng sẽ phản hồi bạn trong thời gian sớm nhất.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  {/* Tên của bạn */}
                  <div>
                    <label htmlFor="contact-name" className="sr-only">Tên của bạn</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tên của bạn"
                      className="w-full px-4 py-3 text-sm text-neutral-800 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#E51E25] focus:ring-1 focus:ring-[#E51E25] placeholder:text-neutral-400 transition"
                      required
                    />
                  </div>

                  {/* 2 Cột: Email của bạn & Số điện thoại của bạn */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-email" className="sr-only">Email của bạn</label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email của bạn"
                        className="w-full px-4 py-3 text-sm text-neutral-800 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#E51E25] focus:ring-1 focus:ring-[#E51E25] placeholder:text-neutral-400 transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="sr-only">Số điện thoại của bạn</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Số điện thoại của bạn"
                        className="w-full px-4 py-3 text-sm text-neutral-800 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#E51E25] focus:ring-1 focus:ring-[#E51E25] placeholder:text-neutral-400 transition"
                      />
                    </div>
                  </div>

                  {/* Nội dung */}
                  <div>
                    <label htmlFor="contact-content" className="sr-only">Nội dung</label>
                    <textarea
                      id="contact-content"
                      name="content"
                      rows={4}
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Nội dung"
                      className="w-full px-4 py-3 text-sm text-neutral-800 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#E51E25] focus:ring-1 focus:ring-[#E51E25] placeholder:text-neutral-400 transition resize-y"
                      required
                    />
                  </div>

                  {/* reCAPTCHA Notice */}
                  <p className="text-xs text-neutral-400 leading-relaxed pt-1">
                    This site is protected by reCAPTCHA and the Google{' '}
                    <a 
                      href="https://policies.google.com/privacy" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[#0070F3] hover:underline"
                    >
                      Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a 
                      href="https://policies.google.com/terms" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[#0070F3] hover:underline"
                    >
                      Terms of Service
                    </a>{' '}
                    apply.
                  </p>

                  {/* Nút gửi đỏ đặc trưng */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#E51E25] hover:bg-[#C9141A] active:bg-[#B01016] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-md transition duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wide"
                    >
                      <Send className="w-4 h-4" />
                      <span>Gửi cho chúng tôi</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Bản đồ Google Maps cửa hàng 1234 Nguyễn Thị Minh Khai, Quận 3, TP.HCM */}
      <section className="w-full pb-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full h-[380px] sm:h-[450px] rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
            <iframe
              title="Coffeena Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.494668199738!2d106.68536831533418!3d10.77336936219808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f241a2731c3%3A0x6b4f728c792372d8!2zMTIzNCBOZ3V54buFbiBUaOG7iyBNaW5oIEtoYWksIFBoxrDhu51uZyA1LCBRdeG6rW4gMywgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1650000000000!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale-[15%] contrast-105"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

