import React, { useState, useMemo } from 'react';
import {
  Printer,
  Calendar,
  CreditCard,
  DollarSign,
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Coffee,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Eye,
  FileText,
  Building2,
  Smartphone,
  ChevronDown,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { formatVND } from '../data/products';
import InvoiceModal from './InvoiceModal';
import DailyInvoiceModal from './DailyInvoiceModal';

export default function RevenueReport({ orders = [] }) {
  // Bộ chọn ngày đang xem (Mặc định: Hôm nay 30/10/2026)
  const [selectedDateKey, setSelectedDateKey] = useState('2026-10-30');
  const [activeTableTab, setActiveTableTab] = useState('bank'); // 'bank' (Bảng Chuyển Khoản) | 'cash' (Bảng Tiền Mặt) | 'all' (Tất Cả)
  const [searchQuery, setSearchQuery] = useState('');
  const [bankFilter, setBankFilter] = useState('all');

  // Modal in hóa đơn
  const [isDailyInvoiceOpen, setIsDailyInvoiceOpen] = useState(false);
  const [singleOrderForInvoice, setSingleOrderForInvoice] = useState(null);
  const [isSingleInvoiceOpen, setIsSingleInvoiceOpen] = useState(false);

  // =========================================================================
  // DỮ LIỆU ĐỐI SOÁT THEO CÁC NGÀY (CASH vs BANK TRANSFERS BY HOUR)
  // =========================================================================
  const dailyReportsData = {
    '2026-10-30': {
      date: '30/10/2026',
      dayLabel: 'Hôm nay (Thứ 6)',
      cashTotal: 3520000,
      cashOrdersCount: 7,
      bankTotal: 5960000,
      bankOrdersCount: 11,
      dailyTotal: 9480000,
      totalOrders: 18,
      transfers: [
        {
          id: 'TR-101',
          time: '07:45',
          code: 'CFN-910248',
          customerName: 'Lê Thuỳ Linh',
          phone: '0938 987 654',
          bank: 'Vietcombank',
          bankAccount: '1029384756',
          note: 'CK CFN910248 LE THUY LINH',
          itemSummary: 'Ấm Bialetti Brikka cảm ứng 4 cốc',
          amount: 4539040,
          status: 'verified'
        },
        {
          id: 'TR-102',
          time: '08:30',
          code: 'CFN-842915',
          customerName: 'Trần Quốc Bảo',
          phone: '0903 456 789',
          bank: 'MB Bank',
          bankAccount: '0903456789',
          note: 'CFN842915 TRAN QUOC BAO',
          itemSummary: 'Cafe đóng gói 2 + Phễu V60',
          amount: 316000,
          status: 'verified'
        },
        {
          id: 'TR-103',
          time: '09:15',
          code: 'CFN-773120',
          customerName: 'Nguyễn Mai Phương',
          phone: '0918 234 567',
          bank: 'Techcombank',
          bankAccount: '1903847589201',
          note: 'CK TIEN CAFE MAI PHUONG',
          itemSummary: 'Bình Bodum Chambord',
          amount: 1284000,
          status: 'verified'
        },
        {
          id: 'TR-104',
          time: '10:20',
          code: 'CFN-664219',
          customerName: 'Hoàng Minh Trí',
          phone: '0976 112 233',
          bank: 'VietinBank',
          bankAccount: '711A938201',
          note: 'CFN664219 HOANG MINH TRI',
          itemSummary: 'Cafe đóng gói 3 (x2)',
          amount: 710000,
          status: 'verified'
        },
        {
          id: 'TR-105',
          time: '11:35',
          code: 'CFN-581903',
          customerName: 'Đặng Thanh Tùng',
          phone: '0905 889 900',
          bank: 'MB Bank',
          bankAccount: '8899002233',
          note: 'DANG THANH TUNG CK 581903',
          itemSummary: 'Cối xay Timemore C3 ESP PRO',
          amount: 1890000,
          status: 'verified'
        },
        {
          id: 'TR-106',
          time: '13:10',
          code: 'CFN-492108',
          customerName: 'Vũ Bích Ngọc',
          phone: '0932 778 899',
          bank: 'Vietcombank',
          bankAccount: '004100029384',
          note: 'VU BICH NGOC THANH TOAN CAFENA',
          itemSummary: 'Phễu pha Hario + Giấy lọc 40 cái',
          amount: 121000,
          status: 'verified'
        },
        {
          id: 'TR-107',
          time: '14:40',
          code: 'CFN-381024',
          customerName: 'Phan Văn Hưng',
          phone: '0919 665 544',
          bank: 'Techcombank',
          bankAccount: '1902837465920',
          note: 'PHAN VAN HUNG 381024',
          itemSummary: 'Tamper inox 58mm + Miếng lót',
          amount: 275000,
          status: 'verified'
        },
        {
          id: 'TR-108',
          time: '15:55',
          code: 'CFN-290184',
          customerName: 'Bùi Thị Thanh',
          phone: '0908 334 455',
          bank: 'VietQR (Napas 247)',
          bankAccount: '9908334455',
          note: 'BUI THI THANH CK CAFE 290184',
          itemSummary: 'Cafe đóng gói 1',
          amount: 410000,
          status: 'verified'
        },
        {
          id: 'TR-109',
          time: '17:20',
          code: 'CFN-182947',
          customerName: 'Ngô Gia Huy',
          phone: '0988 554 433',
          bank: 'MB Bank',
          bankAccount: '0988554433',
          note: 'NGO GIA HUY CK DON HANG',
          itemSummary: 'Cọ họng máy + Chổi vệ sinh',
          amount: 68000,
          status: 'verified'
        },
        {
          id: 'TR-110',
          time: '19:15',
          code: 'CFN-093821',
          customerName: 'Trịnh Đình Khang',
          phone: '0972 998 877',
          bank: 'Vietcombank',
          bankAccount: '001100998877',
          note: 'TRINH DINH KHANG THANH TOAN',
          itemSummary: 'Cối xay 1Zpresso Q Air 7 cánh',
          amount: 1600000,
          status: 'verified'
        },
        {
          id: 'TR-111',
          time: '20:40',
          code: 'CFN-018293',
          customerName: 'Phạm Quỳnh Nga',
          phone: '0945 667 788',
          bank: 'Techcombank',
          bankAccount: '190473829104',
          note: 'QUYNH NGA CK CAFENA 018293',
          itemSummary: 'Cafe đóng gói 4 (x1)',
          amount: 320000,
          status: 'verified'
        }
      ],
      cashOrders: [
        { id: 'CS-01', time: '08:10', code: 'CFN-842918', customerName: 'Trần Minh Hoàng', phone: '0908 123 456', itemSummary: 'Cafe 6 + Chổi vệ sinh cán gỗ', amount: 676000, status: 'collected' },
        { id: 'CS-02', time: '09:40', code: 'CFN-740192', customerName: 'Nguyễn Văn Đức', phone: '0912 345 678', itemSummary: 'Ấm Moka nhôm kiểu Ý + Cọ họng máy', amount: 300000, status: 'collected' },
        { id: 'CS-03', time: '10:50', code: 'CFN-650281', customerName: 'Đỗ Thị Lan', phone: '0935 223 344', itemSummary: 'Cafe đóng gói 1', amount: 410000, status: 'collected' },
        { id: 'CS-04', time: '12:30', code: 'CFN-540192', customerName: 'Trương Gia Bảo', phone: '0909 887 766', itemSummary: 'Cafe đóng gói 2 (x2 gói)', amount: 500000, status: 'collected' },
        { id: 'CS-05', time: '14:15', code: 'CFN-430182', customerName: 'Huỳnh Tấn Đạt', phone: '0913 776 655', itemSummary: 'Bình French Press + Giấy lọc', amount: 890000, status: 'collected' },
        { id: 'CS-06', time: '16:30', code: 'CFN-320194', customerName: 'Trần Văn Lâm', phone: '0982 114 455', itemSummary: 'Cafe đóng gói 1', amount: 410000, status: 'collected' },
        { id: 'CS-07', time: '18:45', code: 'CFN-210492', customerName: 'Mai Kim Oanh', phone: '0904 556 677', itemSummary: 'Bộ phụ kiện vệ sinh máy', amount: 334000, status: 'collected' }
      ]
    },
    '2026-10-29': {
      date: '29/10/2026',
      dayLabel: 'Hôm qua (Thứ 5)',
      cashTotal: 3100000,
      cashOrdersCount: 6,
      bankTotal: 5180000,
      bankOrdersCount: 10,
      dailyTotal: 8280000,
      totalOrders: 16,
      transfers: [
        { id: 'TR-201', time: '08:20', code: 'CFN-881920', customerName: 'Phạm Hải Đăng', phone: '0977 444 888', bank: 'Techcombank', bankAccount: '19038291029', note: 'CFN881920 PHAM HAI DANG', itemSummary: 'Timemore C3 ESP PRO + Giấy lọc', amount: 1945000, status: 'verified' },
        { id: 'TR-202', time: '10:05', code: 'CFN-881921', customerName: 'Lương Hoài Nam', phone: '0903 112 233', bank: 'Vietcombank', bankAccount: '001100293847', note: 'LUONG HOAI NAM CK CAFE', itemSummary: 'Ấm pha Moka nhôm kiểu Ý', amount: 225000, status: 'verified' },
        { id: 'TR-203', time: '11:40', code: 'CFN-881922', customerName: 'Võ Thị Hồng', phone: '0918 334 455', bank: 'MB Bank', bankAccount: '0918334455', note: 'VO THI HONG THANH TOAN', itemSummary: 'Cafe đóng gói 3 + Phễu V60', amount: 421000, status: 'verified' },
        { id: 'TR-204', time: '14:15', code: 'CFN-881923', customerName: 'Nguyễn Tấn Phát', phone: '0937 665 544', bank: 'Techcombank', bankAccount: '19029384758', note: 'CK DON HANG 881923', itemSummary: 'Cối xay MONGDIO quay tay', amount: 450000, status: 'verified' },
        { id: 'TR-205', time: '16:30', code: 'CFN-881924', customerName: 'Bùi Anh Khoa', phone: '0989 778 899', bank: 'VietQR (Napas 247)', bankAccount: '9989778899', note: 'BUI ANH KHOA CK CAFENA', itemSummary: 'Cối xay 1Zpresso Q Air', amount: 1600000, status: 'verified' },
        { id: 'TR-206', time: '19:10', code: 'CFN-881925', customerName: 'Đoàn Thu Hà', phone: '0908 990 011', bank: 'Vietcombank', bankAccount: '002100394857', note: 'DOAN THU HA CK 881925', itemSummary: 'Cafe đóng gói 2 + Tamper inox', amount: 440000, status: 'verified' },
        { id: 'TR-207', time: '20:25', code: 'CFN-881926', customerName: 'Tô Vĩnh Diện', phone: '0975 223 311', bank: 'MB Bank', bankAccount: '0975223311', note: 'TO VINH DIEN THANH TOAN', itemSummary: 'Giấy lọc Hario V60 V01 (x1)', amount: 115000, status: 'verified' }
      ],
      cashOrders: [
        { id: 'CS-21', time: '09:00', code: 'CFN-881910', customerName: 'Trịnh Văn Quý', phone: '0912 889 900', itemSummary: 'Cafe đóng gói 1', amount: 410000, status: 'collected' },
        { id: 'CS-22', time: '11:15', code: 'CFN-881911', customerName: 'Nguyễn Thị Hiền', phone: '0905 443 322', itemSummary: 'Bình French Press Bodum', amount: 1284000, status: 'collected' },
        { id: 'CS-23', time: '15:20', code: 'CFN-881912', customerName: 'Trần Văn Mạnh', phone: '0933 556 677', itemSummary: 'Cafe đóng gói 4', amount: 320000, status: 'collected' },
        { id: 'CS-24', time: '17:40', code: 'CFN-881913', customerName: 'Lê Minh Tâm', phone: '0984 667 788', itemSummary: 'Bộ cọ vệ sinh họng máy + chổi', amount: 68000, status: 'collected' },
        { id: 'CS-25', time: '18:50', code: 'CFN-881914', customerName: 'Phan Thị Yến', phone: '0907 889 911', itemSummary: 'Cafe đóng gói 3', amount: 355000, status: 'collected' },
        { id: 'CS-26', time: '20:10', code: 'CFN-881915', customerName: 'Hoàng Văn Thái', phone: '0919 112 244', itemSummary: 'Cafe đóng gói 2', amount: 250000, status: 'collected' }
      ]
    },
    '2026-10-28': {
      date: '28/10/2026',
      dayLabel: '28/10/2026 (Thứ 4)',
      cashTotal: 2850000,
      cashOrdersCount: 6,
      bankTotal: 4800000,
      bankOrdersCount: 9,
      dailyTotal: 7650000,
      totalOrders: 15,
      transfers: [
        { id: 'TR-301', time: '08:45', code: 'CFN-771801', customerName: 'Vũ Quốc Huy', phone: '0908 112 233', bank: 'Vietcombank', bankAccount: '001100293847', note: 'VU QUOC HUY CK CAFENA', itemSummary: 'Ấm Moka Bialetti Brikka', amount: 4739040, status: 'verified' },
        { id: 'TR-302', time: '13:20', code: 'CFN-771802', customerName: 'Đặng Mai Lan', phone: '0919 445 566', bank: 'MB Bank', bankAccount: '0919445566', note: 'DANG MAI LAN CK 771802', itemSummary: 'Giấy lọc Hario 40 cái (x2)', amount: 110000, status: 'verified' }
      ],
      cashOrders: [
        { id: 'CS-31', time: '09:10', code: 'CFN-771701', customerName: 'Lê Văn An', phone: '0934 556 677', itemSummary: 'Cafe đóng gói 1', amount: 410000, status: 'collected' }
      ]
    }
  };

  const currentReport = dailyReportsData[selectedDateKey] || dailyReportsData['2026-10-30'];

  // Filter transfers based on search & bank dropdown
  const filteredTransfers = useMemo(() => {
    return currentReport.transfers.filter((item) => {
      const matchSearch =
        searchQuery === '' ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.includes(searchQuery) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.note.toLowerCase().includes(searchQuery.toLowerCase());

      const matchBank =
        bankFilter === 'all' || item.bank.toLowerCase().includes(bankFilter.toLowerCase());

      return matchSearch && matchBank;
    });
  }, [currentReport, searchQuery, bankFilter]);

  // Handle single invoice open
  const handleOpenSingleInvoice = (orderLike) => {
    setSingleOrderForInvoice({
      id: orderLike.code,
      code: orderLike.code,
      customerName: orderLike.customerName,
      phone: orderLike.phone,
      address: 'Nhận tại quầy hoặc giao hàng theo địa chỉ lưu trữ',
      paymentMethod: orderLike.bank ? 'bank' : 'cod',
      items: [
        {
          name: orderLike.itemSummary,
          price: orderLike.amount,
          quantity: 1,
          image: '/img/1_53dca42ae400412e9993f78087279535_large.webp'
        }
      ],
      finalTotal: orderLike.amount,
      createdAt: new Date().toISOString()
    });
    setIsSingleInvoiceOpen(true);
  };

  return (
    <div className="space-y-6 animate-smoothFadeIn">
      
      {/* =========================================================================
          TOP BANNER: Tiêu đề, Chọn Ngày & NÚT IN HÓA ĐƠN TỔNG TIỀN NGÀY
          ========================================================================= */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-amber-600" />
                Báo Cáo Doanh Thu & Đối Soát Trong Ngày
              </span>
              <span className="text-xs text-slate-500">Khóa sổ ngày & chuyển khoản ngân hàng</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
              Hạch Toán Doanh Thu Ngày {currentReport.date}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Phân tách minh bạch: <strong className="text-emerald-700 font-bold">Tổng tiền mặt</strong>, <strong className="text-blue-700 font-bold">Tổng chuyển khoản</strong>, <strong className="text-amber-700 font-bold">Tổng tiền ngày</strong> và <strong className="text-slate-900 font-bold">Tổng đơn hàng</strong>.
            </p>
          </div>

          {/* ACTION BUTTON: IN HÓA ĐƠN TỔNG TIỀN CỦA NGÀY (CỰC KỲ NỔI BẬT) */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDailyInvoiceOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm shadow-md shadow-red-600/25 hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2.5 transform active:scale-95 ring-2 ring-red-400/40"
            >
              <Printer className="w-5 h-5 text-white" />
              <span>In Hóa Đơn Tổng Tiền Ngày ({currentReport.date})</span>
            </button>
          </div>
        </div>

        {/* Date Selector Pills */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-slate-500 font-bold mr-1 shrink-0 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              Chọn ngày xem:
            </span>
            {Object.keys(dailyReportsData).map((key) => {
              const r = dailyReportsData[key];
              const isSelected = selectedDateKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDateKey(key)}
                  className={`px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <span>{r.dayLabel}</span>
                  <span className="font-mono text-[11px] opacity-85">({formatVND(r.dailyTotal)})</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500">
            Trạng thái két tiền: <strong className="text-emerald-600 font-bold">✓ Đã khớp 100%</strong>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4 THẺ CHỈ SỐ CỐT LÕI (THEO ĐÚNG YÊU CẦU CỦA USER):
          1. Tổng tiền tiền mặt là bao nhiêu
          2. Chuyển khoản là bao nhiêu
          3. Tổng tiền của ngày
          4. Tổng đơn hàng
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* THẺ 1: TỔNG DOANH THU CỦA NGÀY (TIỀN MẶT + CHUYỂN KHOẢN) */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/50 p-5 rounded-2xl border-2 border-amber-400 shadow-sm relative overflow-hidden group hover:border-amber-500 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              TỔNG TIỀN CỦA NGÀY
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-sm">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-amber-700 font-mono tracking-tight">
              {formatVND(currentReport.dailyTotal)}
            </p>
            <p className="text-xs text-slate-600 mt-2 flex items-center gap-1.5">
              <span>Bao gồm:</span>
              <strong className="text-emerald-700 font-mono">{formatVND(currentReport.cashTotal)} TM</strong>
              <span>+</span>
              <strong className="text-blue-700 font-mono">{formatVND(currentReport.bankTotal)} CK</strong>
            </p>
          </div>
        </div>

        {/* THẺ 2: TỔNG TIỀN TIỀN MẶT */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              TỔNG TIỀN TIỀN MẶT (CASH)
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
              {formatVND(currentReport.cashTotal)}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Thu tại quầy: <strong className="text-slate-800 font-mono">{currentReport.cashOrdersCount}</strong> đơn hàng ({Math.round((currentReport.cashTotal / currentReport.dailyTotal) * 100)}%)
            </p>
          </div>
        </div>

        {/* THẺ 3: TỔNG TIỀN CHUYỂN KHOẢN */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-blue-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              TỔNG CHUYỂN KHOẢN (BANK)
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-blue-600 font-mono">
              {formatVND(currentReport.bankTotal)}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Qua Ngân hàng / QR: <strong className="text-slate-800 font-mono">{currentReport.bankOrdersCount}</strong> giao dịch ({Math.round((currentReport.bankTotal / currentReport.dailyTotal) * 100)}%)
            </p>
          </div>
        </div>

        {/* THẺ 4: TỔNG SỐ ĐƠN HÀNG */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-purple-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              TỔNG ĐƠN HÀNG TRONG NGÀY
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {currentReport.totalOrders} <span className="text-sm font-normal text-slate-500">đơn</span>
            </p>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
              <span className="text-emerald-600 font-bold">✓ 100% Giao xong</span>
              <span>•</span>
              <span className="text-slate-700 font-semibold">{currentReport.bankOrdersCount} CK + {currentReport.cashOrdersCount} TM</span>
            </p>
          </div>
        </div>

      </div>

      {/* =========================================================================
          TRỌNG TÂM: BẢNG CHUYỂN KHOẢN THÔNG TIN KHÁCH HÀNG THEO GIỜ
          ========================================================================= */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
        
        {/* Table Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-black text-slate-900">
                Bảng Thông Tin Khách Hàng Chuyển Khoản Theo Giờ
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Chi tiết từng khung giờ khách chuyển khoản, tên khách, số điện thoại, ngân hàng thụ hưởng và nội dung giao dịch
            </p>
          </div>

          {/* Table Tab Filter: Chuyển Khoản vs Tiền Mặt */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex text-xs">
              <button
                type="button"
                onClick={() => setActiveTableTab('bank')}
                className={`px-3.5 py-1.5 rounded-lg font-black transition cursor-pointer flex items-center gap-1.5 ${
                  activeTableTab === 'bank'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Chuyển Khoản ({currentReport.bankOrdersCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTableTab('cash')}
                className={`px-3.5 py-1.5 rounded-lg font-black transition cursor-pointer flex items-center gap-1.5 ${
                  activeTableTab === 'cash'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Tiền Mặt ({currentReport.cashOrdersCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTableTab('all')}
                className={`px-3.5 py-1.5 rounded-lg font-black transition cursor-pointer flex items-center gap-1.5 ${
                  activeTableTab === 'all'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Tất Cả ({currentReport.totalOrders})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsDailyInvoiceOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              title="In phiếu kết ca tổng tiền ngày"
            >
              <Printer className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">In Tổng Tiền Ngày</span>
            </button>
          </div>
        </div>

        {/* Search & Bank Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm theo tên khách, số điện thoại, mã đơn, nội dung CK..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            />
          </div>

          {activeTableTab !== 'cash' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Lọc ngân hàng:</span>
              <select
                value={bankFilter}
                onChange={(e) => setBankFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:bg-white focus:outline-none focus:border-amber-500 cursor-pointer transition"
              >
                <option value="all">Tất cả ngân hàng</option>
                <option value="Vietcombank">Vietcombank</option>
                <option value="MB Bank">MB Bank</option>
                <option value="Techcombank">Techcombank</option>
                <option value="VietinBank">VietinBank</option>
                <option value="VietQR">VietQR (Napas 247)</option>
              </select>
            </div>
          )}
        </div>

        {/* =========================================================================
            TAB CONTENT 1: BẢNG CHUYỂN KHOẢN THEO GIỜ
            ========================================================================= */}
        {(activeTableTab === 'bank' || activeTableTab === 'all') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-blue-700 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Giao Dịch Khách Chuyển Khoản Theo Giờ ({filteredTransfers.length} Giao Dịch)
              </span>
              <span className="text-xs font-mono font-bold text-slate-700">
                Tổng CK: <strong className="text-blue-600 text-base sm:text-lg font-black">{formatVND(currentReport.bankTotal)}</strong>
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 text-left border-b border-slate-200 font-black text-xs sm:text-sm uppercase tracking-wide">
                    <th className="py-3 px-3 w-20">Giờ</th>
                    <th className="py-3 px-3 w-28">Mã Đơn</th>
                    <th className="py-3 px-3">Khách Hàng & Số ĐT</th>
                    <th className="py-3 px-3">Ngân Hàng Nhận</th>
                    <th className="py-3 px-3">Nội Dung Chuyển Khoản</th>
                    <th className="py-3 px-3 text-right">Số Tiền CK</th>
                    <th className="py-3 px-2 text-center w-28">Trạng Thái</th>
                    <th className="py-3 px-3 text-center w-28">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransfers.length > 0 ? (
                    filteredTransfers.map((tr) => (
                      <tr key={tr.id} className="hover:bg-slate-50/80 transition">
                        {/* Giờ */}
                        <td className="py-3 px-3 font-mono font-black text-amber-700 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-300 text-xs sm:text-sm font-mono font-black">
                            {tr.time}
                          </span>
                        </td>

                        {/* Mã đơn */}
                        <td className="py-3.5 px-3 font-mono font-black text-slate-900 whitespace-nowrap text-sm sm:text-base">
                          #{tr.code}
                        </td>

                        {/* Khách hàng & SĐT */}
                        <td className="py-3 px-3">
                          <p className="font-black text-slate-900 text-base sm:text-lg">{tr.customerName}</p>
                          <p className="text-xs sm:text-sm text-slate-600 font-mono font-semibold flex items-center gap-1.5 mt-0.5">
                            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                            {tr.phone}
                          </p>
                        </td>

                        {/* Ngân hàng nhận */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="font-bold text-slate-900 text-sm sm:text-base">{tr.bank}</span>
                          </div>
                          <p className="text-xs text-slate-500 font-mono font-semibold mt-0.5">
                            STK: {tr.bankAccount}
                          </p>
                        </td>

                        {/* Nội dung chuyển khoản */}
                        <td className="py-3 px-3">
                          <div className="font-mono text-xs sm:text-sm text-slate-800 font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 inline-block max-w-[240px] truncate" title={tr.note}>
                            {tr.note}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[240px] font-medium">
                            {tr.itemSummary}
                          </p>
                        </td>

                        {/* Số tiền CK */}
                        <td className="py-3.5 px-3 text-right font-mono font-black text-base sm:text-lg text-blue-600 whitespace-nowrap">
                          {formatVND(tr.amount)}
                        </td>

                        {/* Trạng thái */}
                        <td className="py-3 px-2 text-center whitespace-nowrap">
                          <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Khớp lệnh
                          </span>
                        </td>

                        {/* Thao tác */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOpenSingleInvoice(tr)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-black text-xs sm:text-sm transition cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                            title="In hóa đơn đơn này"
                          >
                            <Printer className="w-3 h-3 text-amber-600" />
                            <span>In Phiếu</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Không tìm thấy giao dịch chuyển khoản nào khớp với từ khóa tìm kiếm.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB CONTENT 2: BẢNG THU TIỀN MẶT THEO GIỜ (CASH ORDERS)
            ========================================================================= */}
        {(activeTableTab === 'cash' || activeTableTab === 'all') && (
          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                Giao Dịch Khách Trả Tiền Mặt Tại Quầy / COD Theo Giờ ({currentReport.cashOrders.length} Giao Dịch)
              </span>
              <span className="text-xs font-mono font-bold text-slate-700">
                Tổng Tiền Mặt: <strong className="text-emerald-600 text-sm">{formatVND(currentReport.cashTotal)}</strong>
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 text-left border-b border-slate-200 font-black text-xs sm:text-sm uppercase tracking-wide">
                    <th className="py-3 px-3 w-20">Giờ</th>
                    <th className="py-3 px-3 w-28">Mã Đơn</th>
                    <th className="py-3 px-3">Khách Hàng & Số ĐT</th>
                    <th className="py-3 px-3">Sản Phẩm Đã Mua</th>
                    <th className="py-3 px-3 text-right">Tiền Mặt Thu</th>
                    <th className="py-3 px-2 text-center w-28">Trạng Thái</th>
                    <th className="py-3 px-3 text-center w-28">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentReport.cashOrders.map((cs) => (
                    <tr key={cs.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-mono font-black text-emerald-700 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs sm:text-sm font-mono font-black">
                          {cs.time}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                        #{cs.code}
                      </td>

                      <td className="py-3 px-3">
                        <p className="font-black text-slate-900 text-base sm:text-lg">{cs.customerName}</p>
                        <p className="text-xs sm:text-sm text-slate-600 font-mono font-semibold flex items-center gap-1.5 mt-0.5">
                          <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                          {cs.phone}
                        </p>
                      </td>

                      <td className="py-3.5 px-3 text-slate-800 font-medium text-xs sm:text-sm">
                        {cs.itemSummary}
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono font-black text-base sm:text-lg text-emerald-700 whitespace-nowrap">
                        {formatVND(cs.amount)}
                      </td>

                      <td className="py-3 px-2 text-center whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đã thu tiền
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenSingleInvoice(cs)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-[11px] transition cursor-pointer inline-flex items-center gap-1 shadow-xs"
                        >
                          <Printer className="w-3 h-3 text-amber-600" />
                          <span>In Phiếu</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BAR */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-xs text-slate-500 space-y-0.5">
            <p>
              Đối soát ngày: <strong className="text-slate-900 font-bold">{currentReport.date}</strong> • Tổng thu: <strong className="text-amber-700 font-mono text-sm">{formatVND(currentReport.dailyTotal)}</strong>
            </p>
            <p className="text-[11px] text-slate-400">
              Đã kiểm đếm đầy đủ <strong>{currentReport.cashOrdersCount}</strong> đơn tiền mặt và <strong>{currentReport.bankOrdersCount}</strong> đơn chuyển khoản ngân hàng.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsDailyInvoiceOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-xs shadow-md shadow-red-600/20 transition cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>In Hóa Đơn Tổng Tiền Ngày ({currentReport.date})</span>
          </button>
        </div>

      </div>

      {/* =========================================================================
          MODALS IN HÓA ĐƠN
          ========================================================================= */}
      {/* 1. Modal In Hóa Đơn Tổng Tiền Của Ngày (Daily Settlement Report) */}
      <DailyInvoiceModal
        isOpen={isDailyInvoiceOpen}
        onClose={() => setIsDailyInvoiceOpen(false)}
        reportData={currentReport}
      />

      {/* 2. Modal In Hóa Đơn Đơn Lẻ Khi Khách Cần */}
      <InvoiceModal
        isOpen={isSingleInvoiceOpen}
        onClose={() => setIsSingleInvoiceOpen(false)}
        order={singleOrderForInvoice}
      />

    </div>
  );
}
