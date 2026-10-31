import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
  Gift,
  Sparkles,
  Coffee,
  Star,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    loginUser,
    registerUser,
    addToast
  } = useCart();

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
    receiveOffers: true
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [forgotEmail, setForgotEmail] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Loading indicator for submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAuthModal();
      }
    };
    if (isAuthModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  // Tính toán độ mạnh mật khẩu (0 -> 4)
  const calculateStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordStrength = calculateStrength(formData.password);

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 1:
        return { text: 'Yếu - Nên thêm số hoặc chữ hoa', color: 'text-red-500', barColor: 'bg-red-500' };
      case 2:
        return { text: 'Trung bình - Thêm ký tự đặc biệt', color: 'text-amber-500', barColor: 'bg-amber-500' };
      case 3:
        return { text: 'Mạnh - Mật khẩu an toàn', color: 'text-blue-500', barColor: 'bg-blue-500' };
      case 4:
        return { text: 'Rất mạnh - Độ bảo mật tối ưu', color: 'text-emerald-600', barColor: 'bg-emerald-500' };
      default:
        return { text: 'Tối thiểu 6 ký tự', color: 'text-neutral-400', barColor: 'bg-neutral-200' };
    }
  };

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;
  const passwordsMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  // Xử lý submit đăng ký
  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (!formData.firstName.trim()) {
      addToast('Vui lòng nhập tên của bạn', 'error');
      return;
    }
    if (!formData.email.trim()) {
      addToast('Vui lòng nhập email hợp lệ', 'error');
      return;
    }
    if (formData.password.length < 6) {
      addToast('Mật khẩu phải chứa ít nhất 6 ký tự', 'error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      addToast('Mật khẩu xác nhận không trùng khớp', 'error');
      return;
    }
    if (!formData.agreeTerms) {
      addToast('Vui lòng đồng ý với điều khoản dịch vụ để tiếp tục', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const fullName = `${formData.lastName} ${formData.firstName}`.trim();
      registerUser({
        email: formData.email,
        name: fullName,
        phone: formData.phone
      });
      closeAuthModal();
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: true,
        receiveOffers: true
      });
    }, 600);
  };

  // Xử lý submit đăng nhập
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginData.email.trim() || !loginData.password.trim()) {
      addToast('Vui lòng nhập đầy đủ Email và Mật khẩu', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      loginUser(loginData.email, loginData.password);
      closeAuthModal();
      setLoginData({ email: '', password: '', rememberMe: true });
    }, 500);
  };

  // Đăng ký 1-chạm Google Demo
  const handleSocialRegister = (provider) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (provider === 'Google') {
        registerUser({
          email: 'khachhang.google@gmail.com',
          name: 'Nguyễn Văn Minh (Google)',
          phone: '0909123456'
        });
      } else {
        registerUser({
          email: 'khachhang.facebook@gmail.com',
          name: 'Trần Thu Hà (Facebook)',
          phone: '0912345678'
        });
      }
      closeAuthModal();
    }, 600);
  };

  // Quên mật khẩu submit
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      addToast('Vui lòng nhập email của bạn', 'error');
      return;
    }
    addToast('Mã khôi phục đã được gửi về email của bạn! Vui lòng kiểm tra hộp thư.', 'success');
    setForgotEmail('');
    setAuthModalMode('login');
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={closeAuthModal}
      />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 z-10 my-auto animate-scaleUp">
        {/* Close Button Top Right */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black flex items-center justify-center shadow-md transition-all cursor-pointer border border-neutral-200"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* ============================================================== */}
          {/* LEFT PANEL: BRANDING & VIP MEMBER PERKS (5 Cột trên Desktop)   */}
          {/* ============================================================== */}
          <div
            className="lg:col-span-5 relative p-7 sm:p-8 lg:p-10 text-white flex flex-col justify-between overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: 'url(/img/background-footer.jpg)',
              backgroundColor: '#1E140F'
            }}
          >
            {/* Dark warm overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-[#1f130c]/90 to-black/95 pointer-events-none" />

            {/* Glowing ambient light */}
            <div className="absolute -top-16 -left-16 w-56 h-56 bg-[#E51E25]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand Header */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E51E25] to-[#FF4D4D] flex items-center justify-center shadow-lg shadow-red-900/40">
                  <Coffee className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-condensed font-black text-xl tracking-wider uppercase text-white">
                    CAFENA COFFEE
                  </h3>
                  <p className="text-[11px] font-semibold tracking-widest uppercase text-amber-400">
                    Roastery & Specialty Bar
                  </p>
                </div>
              </div>

              {/* VIP Club Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>ĐẶC QUYỀN HỘI VIÊN CAFENA CLUB</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                Gia nhập Ngôi nhà của những Tín đồ Cà phê Thượng hạng
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Đăng ký chỉ mất 30 giây để tận hưởng trọn vẹn những ưu đãi độc quyền dành riêng cho bạn.
              </p>
            </div>

            {/* Perks List */}
            <div className="relative z-10 py-6 space-y-3.5">
              {[
                {
                  icon: Gift,
                  title: 'Tặng ngay E-Voucher 50.000đ',
                  desc: 'Áp dụng cho đơn hàng đầu tiên tại quán & online'
                },
                {
                  icon: Star,
                  title: 'Tặng 100 Điểm Thưởng nạp ví',
                  desc: 'Tích luỹ 5% - 10% mỗi lần order để đổi đồ uống free'
                },
                {
                  icon: Sparkles,
                  title: 'Quà tặng ngày Sinh Nhật',
                  desc: 'Tặng miễn phí món nước hoặc bánh ngọt yêu thích'
                },
                {
                  icon: ShieldCheck,
                  title: 'Freeship & Ưu tiên giao hàng',
                  desc: 'Miễn phí vận chuyển toàn thành phố cho hóa đơn từ 200k'
                }
              ].map((perk, idx) => {
                const IconComponent = perk.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 transition duration-200">
                    <div className="w-8 h-8 rounded-lg bg-red-600/30 border border-red-500/40 flex items-center justify-center shrink-0 text-red-400 mt-0.5">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                        {perk.title}
                      </p>
                      <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                        {perk.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Social Proof */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['/img/review-1.jpg', '/img/review-2.jpg', '/img/review-3.jpg'].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="User avatar"
                      className="w-7 h-7 rounded-full border-2 border-neutral-900 object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ))}
                  <div className="w-7 h-7 rounded-full bg-[#E51E25] text-white text-[10px] font-bold flex items-center justify-center border-2 border-neutral-900">
                    +18k
                  </div>
                </div>
                <div>
                  <div className="flex text-amber-400 text-xs">
                    {'★'.repeat(5)}
                  </div>
                  <p className="text-[11px] text-neutral-300 font-medium">
                    18.500+ tín đồ đã tham gia
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                100% Free
              </span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT PANEL: DYNAMIC AUTH FORMS (7 Cột trên Desktop)           */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white max-h-[85vh] overflow-y-auto">
            
            <div>
              {/* Tab Switcher: ĐĂNG KÝ vs ĐĂNG NHẬP */}
              <div className="flex items-center bg-neutral-100 p-1 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => setAuthModalMode('register')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                    authModalMode === 'register'
                      ? 'bg-white text-[#E51E25] shadow-sm'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <Gift className="w-4 h-4 text-[#E51E25]" />
                  <span>Đăng ký Tài khoản</span>
                  <span className="hidden sm:inline-block text-[10px] bg-red-100 text-[#E51E25] px-1.5 py-0.5 rounded font-extrabold ml-1">
                    +50K
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                    authModalMode === 'login'
                      ? 'bg-white text-[#E51E25] shadow-sm'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </button>
              </div>

              {/* ========================================================== */}
              {/* MODE 1: FORM ĐĂNG KÝ THÀNH VIÊN                            */}
              {/* ========================================================== */}
              {authModalMode === 'register' && (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Title & Badge */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                        Tạo Tài Khoản Mới
                      </h3>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        ✨ Miễn phí 100%
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                      Trở thành hội viên Cafena để tích lũy điểm và nhận ưu đãi riêng.
                    </p>
                  </div>

                  {/* 1-Click Social Sign-Up Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSocialRegister('Google')}
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 shadow-sm transition cursor-pointer"
                    >
                      {/* Google G Logo SVG */}
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialRegister('Facebook')}
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#1877F2]/30 hover:border-[#1877F2] bg-[#1877F2]/5 hover:bg-[#1877F2]/10 rounded-xl text-xs sm:text-sm font-semibold text-[#1877F2] transition cursor-pointer"
                    >
                      {/* Facebook Logo SVG */}
                      <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Facebook</span>
                    </button>
                  </div>

                  {/* Or Divider */}
                  <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-neutral-200"></div>
                    <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                      Hoặc điền thông tin đăng ký
                    </span>
                    <div className="flex-grow border-t border-neutral-200"></div>
                  </div>

                  {/* Register Form Inputs */}
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    
                    {/* Name: Họ và Tên */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Họ & Tên đệm
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Nguyễn Văn"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-neutral-50/70 focus:bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#E51E25] focus:ring-2 focus:ring-[#E51E25]/20 text-neutral-800 transition"
                          />
                          <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Tên <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Hoàng"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                            className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-neutral-50/70 focus:bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#E51E25] focus:ring-2 focus:ring-[#E51E25]/20 text-neutral-800 transition"
                          />
                          <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Số điện thoại */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Số điện thoại <span className="text-neutral-400 font-normal">(nhận voucher SMS)</span>
                      </label>
                      <div className="relative flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-neutral-200 bg-neutral-100 text-neutral-600 text-xs font-semibold">
                          🇻🇳 +84
                        </span>
                        <input
                          type="tel"
                          placeholder="0912 345 678"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-3 pr-3 py-2.5 text-xs sm:text-sm bg-neutral-50/70 focus:bg-white border border-neutral-200 rounded-r-xl focus:outline-none focus:border-[#E51E25] focus:ring-2 focus:ring-[#E51E25]/20 text-neutral-800 transition"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Địa chỉ Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="tenban@gmail.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-neutral-50/70 focus:bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#E51E25] focus:ring-2 focus:ring-[#E51E25]/20 text-neutral-800 transition"
                        />
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    {/* Mật khẩu & Thước đo độ mạnh */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Tối thiểu 6 ký tự"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-neutral-50/70 focus:bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#E51E25] focus:ring-2 focus:ring-[#E51E25]/20 text-neutral-800 transition"
                        />
                        <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {formData.password.length > 0 && (
                        <div className="mt-2 space-y-1 animate-fadeIn">
                          <div className="grid grid-cols-4 gap-1.5 h-1.5">
                            {[1, 2, 3, 4].map((step) => (
                              <div
                                key={step}
                                className={`rounded-full transition-all duration-300 ${
                                  passwordStrength >= step
                                    ? getStrengthText().barColor
                                    : 'bg-neutral-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className={`text-[11px] font-medium ${getStrengthText().color}`}>
                            {getStrengthText().text}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Nhập lại mật khẩu */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Xác nhận Mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Nhập lại mật khẩu vừa tạo"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          required
                          className={`w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-neutral-50/70 focus:bg-white border rounded-xl focus:outline-none transition ${
                            passwordsMatch
                              ? 'border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                              : passwordsMismatch
                              ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                              : 'border-neutral-200 focus:border-[#E51E25] focus:ring-2 focus:ring-[#E51E25]/20'
                          }`}
                        />
                        <ShieldCheck className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Trùng khớp status */}
                      {passwordsMatch && (
                        <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mật khẩu trùng khớp chính xác
                        </p>
                      )}
                      {passwordsMismatch && (
                        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Mật khẩu chưa trùng khớp
                        </p>
                      )}
                    </div>

                    {/* Checkboxes: Điều khoản & Khuyến mãi */}
                    <div className="pt-1 space-y-2 text-xs text-neutral-600">
                      <label className="flex items-start gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.agreeTerms}
                          onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                          className="mt-0.5 w-4 h-4 rounded text-[#E51E25] focus:ring-[#E51E25] accent-[#E51E25] cursor-pointer"
                        />
                        <span>
                          Tôi đồng ý với{' '}
                          <a href="#about" onClick={(e) => e.preventDefault()} className="text-[#E51E25] font-semibold hover:underline">
                            Điều khoản dịch vụ
                          </a>{' '}
                          và{' '}
                          <a href="#about" onClick={(e) => e.preventDefault()} className="text-[#E51E25] font-semibold hover:underline">
                            Chính sách bảo mật
                          </a>{' '}
                          của Cafena.
                        </span>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.receiveOffers}
                          onChange={(e) => setFormData({ ...formData, receiveOffers: e.target.checked })}
                          className="mt-0.5 w-4 h-4 rounded text-[#E51E25] focus:ring-[#E51E25] accent-[#E51E25] cursor-pointer"
                        />
                        <span className="text-neutral-500">
                          Nhận mã giảm giá độc quyền, voucher sinh nhật và sự kiện thử cà phê qua Email.
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#E51E25] via-[#D31920] to-[#B01016] hover:from-[#C9141A] hover:to-[#960B10] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base tracking-wide shadow-lg shadow-red-600/30 hover:shadow-red-600/40 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang tạo tài khoản...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 text-amber-300" />
                          <span>ĐĂNG KÝ & NHẬN VOUCHER 50.000Đ</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* ========================================================== */}
              {/* MODE 2: FORM ĐĂNG NHẬP                                     */}
              {/* ========================================================== */}
              {authModalMode === 'login' && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                      Chào Mừng Trở Lại!
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                      Đăng nhập để xem điểm thưởng và lịch sử đơn hàng của bạn.
                    </p>
                  </div>

                  {/* 1-Click Social Sign-In */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSocialRegister('Google')}
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 shadow-sm transition cursor-pointer"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialRegister('Facebook')}
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#1877F2]/30 hover:border-[#1877F2] bg-[#1877F2]/5 hover:bg-[#1877F2]/10 rounded-xl text-xs sm:text-sm font-semibold text-[#1877F2] transition cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Facebook</span>
                    </button>
                  </div>

                  <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-neutral-200"></div>
                    <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                      Hoặc tài khoản cá nhân
                    </span>
                    <div className="flex-grow border-t border-neutral-200"></div>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Email đăng nhập
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="tenban@gmail.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          required
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-neutral-50/70 focus:bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#E51E25] focus:ring-2 focus:ring-[#E51E25]/20 text-neutral-800 transition"
                        />
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-neutral-700">
                          Mật khẩu
                        </label>
                        <button
                          type="button"
                          onClick={() => setAuthModalMode('forgot')}
                          className="text-xs text-[#E51E25] font-semibold hover:underline cursor-pointer"
                        >
                          Quên mật khẩu?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          placeholder="Nhập mật khẩu"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          required
                          className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-neutral-50/70 focus:bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#E51E25] focus:ring-2 focus:ring-[#E51E25]/20 text-neutral-800 transition"
                        />
                        <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={loginData.rememberMe}
                          onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                          className="w-4 h-4 rounded text-[#E51E25] focus:ring-[#E51E25] accent-[#E51E25] cursor-pointer"
                        />
                        <span>Ghi nhớ đăng nhập</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#E51E25] via-[#D31920] to-[#B01016] hover:from-[#C9141A] hover:to-[#960B10] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base tracking-wide shadow-lg shadow-red-600/30 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang đăng nhập...</span>
                        </>
                      ) : (
                        <>
                          <span>ĐĂNG NHẬP VÀO TÀI KHOẢN</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* ========================================================== */}
              {/* MODE 3: QUÊN MẬT KHẨU                                      */}
              {/* ========================================================== */}
              {authModalMode === 'forgot' && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                      Khôi Phục Mật Khẩu
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                      Nhập địa chỉ email đăng ký, Cafena sẽ gửi hướng dẫn khôi phục mật khẩu cho bạn.
                    </p>
                  </div>

                  <form onSubmit={handleForgotSubmit} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Địa chỉ Email của bạn
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="tenban@gmail.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          required
                          autoFocus
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-neutral-50/70 focus:bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#E51E25] focus:ring-2 focus:ring-[#E51E25]/20 text-neutral-800 transition"
                        />
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl bg-[#E51E25] hover:bg-[#C9141A] text-white font-extrabold text-sm sm:text-base tracking-wide shadow-md transition cursor-pointer"
                    >
                      GỬI MÃ KHÔI PHỤC
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setAuthModalMode('login')}
                        className="text-xs font-semibold text-neutral-600 hover:text-[#E51E25] transition cursor-pointer"
                      >
                        ← Quay lại trang Đăng nhập
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>

            {/* Bottom Quick Switch Link */}
            <div className="pt-5 border-t border-neutral-100 text-center text-xs text-neutral-600 mt-4">
              {authModalMode === 'register' ? (
                <p>
                  Bạn đã có tài khoản Cafena?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('login')}
                    className="text-[#E51E25] font-bold hover:underline cursor-pointer ml-1"
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              ) : (
                <p>
                  Chưa có tài khoản Cafena?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('register')}
                    className="text-[#E51E25] font-bold hover:underline cursor-pointer ml-1"
                  >
                    Đăng ký nhận quà 50K ngay
                  </button>
                </p>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

