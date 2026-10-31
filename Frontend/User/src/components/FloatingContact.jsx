import React, { useState } from 'react';
import { MessageCircle, Phone, X, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const { addToast } = useCart();

  const handleSend = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    addToast('Tin nhắn của bạn đã được gửi đến tư vấn viên Cafena!');
    setMsg('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Quick Chat Popup */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slideUp">
          <div className="bg-[#E51E25] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                ☕
              </div>
              <div>
                <h4 className="font-bold text-sm">Hỗ Trợ Trực Tuyến</h4>
                <p className="text-[11px] text-red-100">Cafena luôn sẵn sàng phục vụ</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-gray-50 text-xs space-y-3 max-h-52 overflow-y-auto">
            <div className="bg-white p-3 rounded-xl shadow-sm text-neutral-800 border border-gray-100">
              Chào bạn! Bạn cần tư vấn về dòng cà phê rang mộc hay đồ uống giải nhiệt nào của Cafena ạ?
            </div>
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-gray-100 flex gap-2 bg-white">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-[#E51E25]"
            />
            <button
              type="submit"
              className="p-2 bg-[#E51E25] hover:bg-[#D3171D] text-white rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Main Red Floating Button (Exact design from screenshot) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 bg-[#E51E25] hover:bg-[#D3171D] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-xl shadow-red-500/40 hover:shadow-red-500/60 transform hover:scale-105 transition-all duration-300"
        aria-label="Liên hệ trực tuyến"
      >
        <span className="relative flex h-3 w-3 sm:hidden">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide uppercase">
          Liên hệ
        </span>
      </button>
    </div>
  );
}

