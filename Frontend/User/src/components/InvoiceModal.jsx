import React, { useState } from 'react';
import { Printer, X, Download, Check, Coffee, QrCode, FileText, CheckCircle2 } from 'lucide-react';
import { formatVND } from '../data/products';

// Helper chuyển đổi số tiền thành chữ Tiếng Việt chuẩn hóa đơn
export function numberToVietnameseWords(n) {
  if (!n || isNaN(n) || n === 0) return 'Không đồng';
  const units = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const scales = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ'];

  let numStr = Math.round(Math.abs(n)).toString();
  let groups = [];
  while (numStr.length > 0) {
    groups.unshift(numStr.slice(-3));
    numStr = numStr.slice(0, -3);
  }

  function readGroup(g, isHighest) {
    let num = parseInt(g, 10);
    if (num === 0) return '';
    let h = Math.floor(num / 100);
    let t = Math.floor((num % 100) / 10);
    let u = num % 10;
    let parts = [];
    if (h > 0 || !isHighest) {
      parts.push(units[h] + ' trăm');
    }
    if (t > 1) {
      parts.push(units[t] + ' mươi');
      if (u === 1) parts.push('mốt');
      else if (u === 5) parts.push('lăm');
      else if (u > 0) parts.push(units[u]);
    } else if (t === 1) {
      parts.push('mười');
      if (u === 5) parts.push('lăm');
      else if (u > 0) parts.push(units[u]);
    } else if (u > 0) {
      if (h > 0 || !isHighest) parts.push('lẻ');
      parts.push(units[u]);
    }
    return parts.join(' ');
  }

  let words = [];
  for (let i = 0; i < groups.length; i++) {
    let txt = readGroup(groups[i], i === 0);
    if (txt) {
      let scale = scales[groups.length - 1 - i];
      words.push(txt + (scale ? ' ' + scale : ''));
    }
  }
  let result = words.join(' ').trim();
  return result.charAt(0).toUpperCase() + result.slice(1) + ' đồng chẵn.';
}

export default function InvoiceModal({ isOpen, onClose, order }) {
  const [paperFormat, setPaperFormat] = useState('k80'); // 'k80' (In nhiệt 80mm) | 'a4' (Khổ tiêu chuẩn)
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

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
      `HÓA ĐƠN BÁN HÀNG: #${order.code || order.id}`,
      `Thời gian: ${new Date(order.createdAt).toLocaleString('vi-VN')}`,
      `Khách hàng: ${order.customerName}`,
      `SĐT: ${order.phone}`,
      `Địa chỉ: ${order.address}`,
      `Phương thức TT: ${order.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản ngân hàng'}`,
      '----------------------------------------',
      'DANH SÁCH MÓN:'
    ];

    order.items?.forEach((item, idx) => {
      lines.push(`${idx + 1}. ${item.name} x${item.quantity} = ${formatVND(item.price * item.quantity)}`);
    });

    lines.push('----------------------------------------');
    lines.push(`Tạm tính: ${formatVND(order.items?.reduce((s, it) => s + it.price * it.quantity, 0) || order.finalTotal)}`);
    if (order.shippingFee) lines.push(`Phí vận chuyển: ${formatVND(order.shippingFee)}`);
    if (order.discountAmount) lines.push(`Giảm giá: -${formatVND(order.discountAmount)}`);
    lines.push(`TỔNG THANH TOÁN: ${formatVND(order.finalTotal)}`);
    lines.push(`Bằng chữ: ${numberToVietnameseWords(order.finalTotal)}`);
    lines.push('========================================');
    lines.push('Cảm ơn Quý khách & Hẹn gặp lại!');

    navigator.clipboard?.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const subTotal = order.items?.reduce((s, it) => s + it.price * it.quantity, 0) || order.finalTotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto animate-smoothSlideUp">
        
        {/* Top Control Bar (Ẩn khi in ấn) */}
        <div className="no-print bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-xs">
              <Printer className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                In Hóa Đơn Bán Hàng
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                  #{order.code || order.id}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">Xem trước và xuất bản in nhiệt POS hoặc khổ A4</p>
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
                K80 (80mm)
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
                Khổ A4/A5
              </button>
            </div>

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopyText}
              className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs"
              title="Sao chép nội dung hóa đơn"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4" />}
            </button>

            {/* Print button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer"
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
              THE ACTUAL PRINTABLE INVOICE (Chỉ in vùng này khi bấm In)
              ========================================================================= */}
          <div
            id="printable-invoice"
            className={`w-full bg-white text-gray-900 rounded-xl shadow-xl p-6 sm:p-8 border border-gray-200 transition-all font-sans ${
              paperFormat === 'k80' ? 'max-w-md' : 'max-w-xl'
            }`}
          >
            {/* Header / Brand */}
            <div className="text-center pb-4 border-b border-dashed border-gray-300">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-[#1E140D] text-amber-500 flex items-center justify-center font-black">
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
                📍 123 Đường Trần Phú, Quận Hải Châu, TP. Đà Nẵng
              </p>
              <p className="text-[11px] text-gray-500">
                Hotline: <strong className="text-gray-800">1900 6868</strong> • Website: <strong className="text-gray-800">cafena-coffee.vn</strong>
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Mã số thuế: 0401892834 • Giờ mở cửa: 07:00 - 22:30
              </p>
            </div>

            {/* Invoice Title */}
            <div className="text-center py-3 border-b border-dashed border-gray-300">
              <h2 className="text-base font-black uppercase text-gray-900 tracking-wide">
                HÓA ĐƠN BÁN HÀNG
              </h2>
              <p className="text-[11px] text-gray-500">
                Phiếu thanh toán & xuất kho bán lẻ
              </p>
              <p className="text-xs font-bold font-mono text-amber-700 mt-0.5">
                Số HĐ: #{order.code || order.id}
              </p>
            </div>

            {/* Metadata (Cashier & Customer info) */}
            <div className="py-3 text-xs space-y-1 border-b border-dashed border-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày lập:</span>
                <span className="font-semibold text-gray-800">
                  {new Date(order.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Thu ngân:</span>
                <span className="font-semibold text-gray-800">Admin Cafena (Quầy POS-01)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Khách hàng:</span>
                <span className="font-bold text-gray-900">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Điện thoại:</span>
                <span className="font-mono text-gray-800">{order.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Địa chỉ nhận:</span>
                <span className="font-medium text-gray-800 text-right max-w-[65%] truncate">
                  {order.address}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500">Hình thức thanh toán:</span>
                <span className="font-bold text-emerald-700 uppercase text-[11px]">
                  {order.paymentMethod === 'cod' ? 'Thanh toán COD khi nhận hàng' : 'Chuyển khoản ngân hàng'}
                </span>
              </div>
              {order.note && (
                <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded mt-1 border border-amber-200">
                  Ghi chú: {order.note}
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="py-3 border-b border-dashed border-gray-300">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-300 text-gray-600 font-extrabold uppercase text-[10px]">
                    <th className="text-left py-1 w-6">#</th>
                    <th className="text-left py-1">Tên Hàng Hóa</th>
                    <th className="text-center py-1 w-10">SL</th>
                    <th className="text-right py-1 w-20">Đơn Giá</th>
                    <th className="text-right py-1 w-24">Thành Tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="text-gray-800">
                      <td className="py-1.5 text-gray-400 font-mono">{idx + 1}</td>
                      <td className="py-1.5 font-bold pr-2">
                        {item.name}
                        {item.size && <span className="text-[10px] text-gray-500 ml-1">({item.size})</span>}
                      </td>
                      <td className="py-1.5 text-center font-mono">{item.quantity}</td>
                      <td className="py-1.5 text-right font-mono text-gray-600">{formatVND(item.price)}</td>
                      <td className="py-1.5 text-right font-bold font-mono text-gray-900">
                        {formatVND(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment Summary */}
            <div className="py-3 text-xs space-y-1.5 border-b border-dashed border-gray-300">
              <div className="flex justify-between text-gray-600">
                <span>Cộng tiền hàng (Tạm tính):</span>
                <span className="font-mono">{formatVND(subTotal)}</span>
              </div>

              {order.shippingFee !== undefined && (
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển giao hàng:</span>
                  <span className="font-mono">
                    {order.shippingFee === 0 ? 'Miễn phí' : formatVND(order.shippingFee)}
                  </span>
                </div>
              )}

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Voucher giảm giá:</span>
                  <span className="font-mono font-bold">-{formatVND(order.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-2 border-t border-gray-300">
                <span className="text-sm font-black text-gray-900 uppercase">
                  TỔNG THANH TOÁN:
                </span>
                <span className="text-lg font-black text-red-600 font-mono">
                  {formatVND(order.finalTotal)}
                </span>
              </div>

              {/* Amount in Vietnamese Words */}
              <div className="pt-1 text-[11px] italic text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                <strong className="font-semibold text-gray-800 not-italic">Bằng chữ: </strong>
                {numberToVietnameseWords(order.finalTotal)}
              </div>
            </div>

            {/* Barcode & Footer info */}
            <div className="pt-4 text-center space-y-2">
              {/* Simulated Barcode */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-0.5 h-10 w-48 bg-white px-2">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3, 1, 2].map((w, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-900 h-full"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[10px] text-gray-500 tracking-widest mt-0.5">
                  *{order.code || order.id}*
                </span>
              </div>

              <div className="text-[11px] text-gray-600 leading-relaxed">
                <p className="font-bold text-gray-800">
                  Cảm ơn Quý khách đã tin tưởng và ủng hộ Cafena Coffee!
                </p>
                <p className="text-[10px] text-gray-500">
                  Chúc bạn có những trải nghiệm cà phê tuyệt vời mỗi ngày.
                </p>
                <p className="text-[9px] text-gray-400 mt-1 italic">
                  * Chính sách: Đổi trả dụng cụ/máy xay trong 7 ngày nếu có lỗi từ nhà sản xuất. Quý khách vui lòng giữ hóa đơn này.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Footer controls (Ẩn khi in ấn) */}
        <div className="no-print bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Hóa đơn đã được xác thực hợp lệ trên hệ thống POS
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>In Hóa Đơn (Ctrl + P)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

