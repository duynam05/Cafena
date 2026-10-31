import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let colorClass = 'bg-white border-l-4 border-l-[#E51E25] border-gray-100 text-neutral-800 shadow-xl';
        let iconColor = 'text-[#E51E25]';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClass = 'bg-white border-l-4 border-l-red-600 border-gray-100 text-neutral-800 shadow-xl';
          iconColor = 'text-red-600';
        } else if (toast.type === 'info') {
          Icon = Info;
          colorClass = 'bg-white border-l-4 border-l-blue-600 border-gray-100 text-neutral-800 shadow-xl';
          iconColor = 'text-blue-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 animate-slideUp ${colorClass}`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
              <p className="text-xs font-semibold leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-900 p-1 ml-2"
              aria-label="Đóng"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
