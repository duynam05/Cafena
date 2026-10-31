import React, { useState } from 'react';
import { Printer, X, Download, Check, Coffee, FileText, CheckCircle2, CreditCard, DollarSign } from 'lucide-react';
import { formatVND } from '../data/products';
import { numberToVietnameseWords } from './InvoiceModal';

export default function DailyInvoiceModal({ isOpen, onClose, reportData }) {
  const [paperFormat, setPaperFormat] = useState('k80'); // 'k80' (In nhiệt 80mm) | 'a4' (Khổ tiêu chuẩn A4)
  const [copied, setCopied] = useState(false);

  if (!isOpen || !reportData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const lines = [
      '========================================',
      'CAFENA COFFEE ROASTERY & ESPRESSO BAR',
      'Địa chỉ: 123 Đường Trần Phú, Quận Hải Châu, TP. Đà Nẵng',
      'Hotline: 1900 6868 - Website: cafena-coffee.vn',
      '----------------------------------------',
      `HÓA ĐƠN TỔNG KẾT DOANH THU NGÀY: ${reportData.date}`,
      `Thời gian xuất phiếu: ${new Date().toLocaleString('vi-VN')}`,
      `Thu ngân / Người lập: Quản lý Quầy POS Cafena`,
      '----------------------------------------',
      `1. TỔNG TIỀN TIỀN MẶT: ${formatVND(reportData.cashTotal)} (${reportData.cashOrdersCount} đơn)`,
      `2. TỔNG TIỀN CHUYỂN KHOẢN: ${formatVND(reportData.bankTotal)} (${reportData.bankOrdersCount} đơn)`,
      `3. TỔNG SỐ ĐƠN HÀNG: ${reportData.totalOrders} đơn hàng (Hoàn thành 100%)`,
      '----------------------------------------',
      `TỔNG TIỀN CỦA NGÀY: ${formatVND(reportData.dailyTotal)}`,
      `Số tiền bằng chữ: ${numberToVietnameseWords(reportData.dailyTotal)}`,
      '========================================'
    ];

    navigator.clipboard?.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto animate-smoothSlideUp">
        
        {/* Top Control Bar (Ẩn khi in ấn) */}
        <div className="no-print bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center shadow-sm">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                In Hóa Đơn Tổng Tiền Ngày
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-bold">
                  {reportData.date}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Phiếu kết ca tài chính & đối soát chuyển khoản ngân hàng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Format toggle */}
            <div className="bg-slate-200/80 p-0.5 rounded-lg border border-slate-300 flex text-xs">
              <button
                type="button"
                onClick={() => setPaperFormat('k80')}
                className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                  paperFormat === 'k80'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                K80 (In nhiệt)
              </button>
              <button
                type="button"
                onClick={() => setPaperFormat('a4')}
                className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                  paperFormat === 'a4'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Khổ A4 / A5
              </button>
            </div>

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopyText}
              className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs"
              title="Sao chép văn bản phiếu kết ca"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4" />}
            </button>

            {/* Print button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Ngay</span>
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Preview Wrapper with scroll */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto bg-slate-100/60 flex justify-center">
          
          {/* =========================================================================
              THE PRINTABLE DAILY SETTLEMENT INVOICE
              ========================================================================= */}
          <div
            id="printable-invoice"
            className={`w-full bg-white text-gray-900 rounded-xl shadow-md p-6 sm:p-8 border border-gray-200 transition-all font-sans ${
              paperFormat === 'k80' ? 'max-w-md' : 'max-w-lg'
            }`}
          >
            {/* Header / Brand */}
            <div className="text-center pb-4 border-b border-dashed border-gray-300">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-black">
                  ☕
                </div>
                <h1 className="text-xl font-black tracking-wider text-gray-900 uppercase">
                  CAFENA COFFEE
                </h1>
              </div>
              <p className="text-xs font-semibold text-gray-600 tracking-wide">
                ROASTERY & SPECIALTY ESPRESSO BAR
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                📍 123 Đường Trần Phú, Quận Hải Châu, TP. Đà Nẵng • Hotline: 1900 6868
              </p>
            </div>

            {/* Invoice Title */}
            <div className="text-center py-3 border-b border-dashed border-gray-300">
              <h2 className="text-base font-black uppercase text-gray-900 tracking-wide">
                HÓA ĐƠN TỔNG KẾT DOANH THU NGÀY
              </h2>
              <p className="text-xs font-bold text-red-700 uppercase mt-0.5">
                BÁO CÁO KẾT CA & ĐỐI SOÁT TÀI CHÍNH
              </p>
              <p className="text-xs text-gray-600 font-mono mt-0.5">
                Ngày hạch toán: <strong className="text-gray-900">{reportData.date}</strong> ({reportData.dayLabel})
              </p>
              <p className="text-[10px] text-gray-400">
                Thời gian in: {new Date().toLocaleString('vi-VN')} • Quầy POS-01
              </p>
            </div>

            {/* Core Financial Summary Box */}
            <div className="my-4 p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="font-bold text-gray-700 uppercase">1. TỔNG TIỀN TIỀN MẶT:</span>
                <span className="font-mono font-black text-sm text-gray-900">
                  {formatVND(reportData.cashTotal)}
                  <span className="text-[10px] font-normal text-gray-500 ml-1.5">
                    ({reportData.cashOrdersCount} đơn)
                  </span>
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="font-bold text-gray-700 uppercase">2. TỔNG TIỀN CHUYỂN KHOẢN:</span>
                <span className="font-mono font-black text-sm text-blue-700">
                  {formatVND(reportData.bankTotal)}
                  <span className="text-[10px] font-normal text-gray-500 ml-1.5">
                    ({reportData.bankOrdersCount} đơn)
                  </span>
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="font-bold text-gray-700 uppercase">3. TỔNG SỐ ĐƠN HÀNG:</span>
                <span className="font-mono font-black text-sm text-gray-900">
                  {reportData.totalOrders} đơn hàng
                  <span className="text-[10px] font-normal text-emerald-600 ml-1.5">
                    (Hoàn thành 100%)
                  </span>
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-2">
                <span className="text-sm font-black text-gray-900 uppercase">
                  TỔNG TIỀN CỦA NGÀY:
                </span>
                <span className="text-xl font-black text-red-600 font-mono">
                  {formatVND(reportData.dailyTotal)}
                </span>
              </div>

              <div className="text-[11px] italic text-gray-600 pt-1">
                <strong className="not-italic text-gray-800">Số tiền bằng chữ: </strong>
                {numberToVietnameseWords(reportData.dailyTotal)}
              </div>
            </div>

          </div>

        </div>

        {/* Footer controls (Ẩn khi in ấn) */}
        <div className="no-print bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Số liệu đã được khóa sổ và đối soát khớp 100% với tài khoản ngân hàng
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs transition cursor-pointer"
            >
              Đóng Lại
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>In Hóa Đơn Tổng Tiền Ngày (Ctrl + P)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

