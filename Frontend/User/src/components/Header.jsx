import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingBag, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Menu, 
  X,
  Gift,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PACKAGED_PRODUCTS, findProduct } from '../data/products';

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  currentPage = 'home',
  setCurrentPage,
  onSelectProduct
}) {
  const { 
    cartCount, 
    setIsCartOpen,
    currentUser,
    loginUser,
    logoutUser,
    addToast,
    openAuthModal
  } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [productMegaMenuOpen, setProductMegaMenuOpen] = useState(false);
  const [mobileProductExpanded, setMobileProductExpanded] = useState(false);

  // User Account Popover state
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');

  // Close User dropdown on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowUserMenu(false);
        setShowSearch(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showUserMenu]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      addToast('Vui lòng nhập đầy đủ Email và Mật khẩu', 'error');
      return;
    }
    loginUser(loginForm.email, loginForm.password);
    setLoginForm({ email: '', password: '' });
    setShowUserMenu(false);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registerForm.email.trim() || !registerForm.password.trim() || !registerForm.firstName.trim()) {
      addToast('Vui lòng điền đầy đủ các thông tin bắt buộc', 'error');
      return;
    }
    const fullName = `${registerForm.lastName} ${registerForm.firstName}`.trim();
    loginUser(registerForm.email, registerForm.password, fullName);
    setRegisterForm({ firstName: '', lastName: '', email: '', password: '' });
    setAuthMode('login');
    setShowUserMenu(false);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      addToast('Vui lòng nhập email của bạn', 'error');
      return;
    }
    addToast('Yêu cầu đã được ghi nhận! Vui lòng kiểm tra email của bạn.', 'success');
    setForgotEmail('');
    setAuthMode('login');
  };

  // Rotating top announcement bar messages from the actual website
  const announcements = [
    'SALE hot chào lương về - Freeship đơn 0đ',
    'Miễn phí vận chuyển với đơn hàng trên 500k',
    'Khuyến mãi khủng giảm tới 35% tất cả sản phẩm'
  ];
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Debounce timer ref: Bảng ẩn nhanh và mượt mà khi chuột rời khỏi vùng
  const closeTimeoutRef = useRef(null);

  const handleMouseEnterMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setProductMegaMenuOpen(true);
  };

  const handleMouseLeaveMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setProductMegaMenuOpen(false);
    }, 100); // Đóng nhanh chóng sau 100ms
  };

  const handleCloseMegaMenuImmediately = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setProductMegaMenuOpen(false);
  };

  const megaMenuColumns = [
    {
      title: 'Cà phê đóng gói',
      categoryKey: 'packaged',
      items: [
        { label: 'Cà phê đóng gói 1', id: 'packaged-1' },
        { label: 'Cà phê đóng gói 2', id: 'packaged-2' },
        { label: 'Cà phê đóng gói 3', id: 'packaged-3' },
      ]
    },
    {
      title: 'Dụng cụ pha cà phê',
      categoryKey: 'equipment',
      items: [
        { label: 'Bialetti Brikka cảm ứng 4 cốc', id: 'equipment-1' },
        { label: 'Ấm pha Moka Pot bằng nhôm', id: 'equipment-2' },
        { label: 'Bình Bodum cốc Chambord', id: 'equipment-3' },
        { label: 'Bình French Press Lock&Lock', id: 'equipment-4' },
      ]
    },
    {
      title: 'Phụ kiện',
      categoryKey: 'accessory',
      items: [
        { label: 'Chổi vệ sinh máy pha cán gỗ', id: 'accessory-1' },
        { label: 'Cọ vệ sinh họng máy Espresso', id: 'accessory-2' },
        { label: 'Giấy lọc cà phê Hario 40 cái', id: 'accessory-3' },
        { label: 'Phễu Lọc Cà Phê V60 Chịu Nhiệt', id: 'accessory-4' },
        { label: 'Giấy Lọc Cà Phê Không Tẩy Trắng', id: 'accessory-5' },
        { label: 'Giấy lọc Hario V60 V01', id: 'accessory-6' },
        { label: 'Miếng lót tamper silicon', id: 'accessory-7' },
        { label: 'Tamper nén cà phê inox 58mm', id: 'accessory-8' },
      ]
    },
    {
      title: 'Máy xay cafe cầm tay',
      categoryKey: 'grinder',
      items: [
        { label: 'Máy xay cổ điển SIONREAIPA', id: 'grinder-1' },
        { label: 'MONGDIO Máy xay quay tay', id: 'grinder-2' },
        { label: '1ZPRESSO Q AIR lưỡi 7 cánh', id: 'grinder-3' },
        { label: 'Timemore C3 ESP PRO', id: 'grinder-4' },
        { label: 'Timemore S3 Flagship 2025', id: 'grinder-5' },
        { label: '1Zpresso K-Plus cao cấp', id: 'grinder-6' },
      ]
    }
  ];

  const handleSelectMenuItem = (categoryKey, itemId, itemLabel) => {
    if (setSelectedCategory) setSelectedCategory(categoryKey);
    setProductMegaMenuOpen(false);
    setMobileMenuOpen(false);

    if (itemId && onSelectProduct) {
      const prod = findProduct(itemId) || (itemLabel && findProduct(itemLabel));
      if (prod) {
        onSelectProduct(prod);
        return;
      }
    }

    // Nếu bấm vào danh mục cột
    if (setCurrentPage) setCurrentPage('products');
    window.location.hash = categoryKey ? `#products-${categoryKey}` : '#products-page';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (page, anchor = '') => {
    if (setCurrentPage) {
      setCurrentPage(page);
    }
    setMobileMenuOpen(false);
    if (page === 'about') {
      window.location.hash = '#about-page';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'menu') {
      window.location.hash = '#menu-page';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'order') {
      window.location.hash = '#order-page';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'products') {
      window.location.hash = '#products-page';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'contact') {
      window.location.hash = '#contact-page';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'cart') {
      window.location.hash = '#cart-page';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'admin') {
      window.location.hash = '#admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = anchor || '#home';
      if (!anchor || anchor === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setTimeout(() => {
          const el = document.querySelector(anchor);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm transition-all duration-300">
      {/* Top Banner Bar - Red with rotating announcement text from video */}
      <div className="bg-[#E51E25] text-white text-sm sm:text-[15px] py-2 px-4 text-center font-semibold tracking-wide overflow-hidden">
        <div className="w-full flex items-center justify-center h-6">
          <span 
            key={announcementIdx}
            className="animate-smoothFadeIn transition-all duration-500 ease-in-out"
          >
            {announcements[announcementIdx]}
          </span>
        </div>
      </div>

      {/* Main Navbar: full width with logo & icons pushed to the sides */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 relative">
        <div className="flex items-center justify-between h-20 sm:h-22">
          
          {/* Logo Brand: "CAFENA" */}
          <a
            href="#home"
            onMouseEnter={handleCloseMegaMenuImmediately}
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home');
            }}
            className="flex items-center group cursor-pointer shrink-0"
          >
            <span className="font-display text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 group-hover:text-[#E51E25] transition-colors duration-300">
              CAFENA
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 h-full">
            {/* Trang chủ */}
            <a
              href="#home"
              onMouseEnter={handleCloseMegaMenuImmediately}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('home');
              }}
              className={`text-base transition-colors py-2 cursor-pointer ${
                currentPage === 'home'
                  ? 'font-bold text-[#E51E25]'
                  : 'font-semibold text-neutral-800 hover:text-[#E51E25]'
              }`}
            >
              Trang chủ
            </a>

            {/* Giới thiệu */}
            <a
              href="#about-page"
              onMouseEnter={handleCloseMegaMenuImmediately}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('about');
              }}
              className={`text-base transition-colors py-2 cursor-pointer ${
                currentPage === 'about'
                  ? 'font-bold text-[#E51E25]'
                  : 'font-semibold text-neutral-800 hover:text-[#E51E25]'
              }`}
            >
              Giới thiệu
            </a>

            {/* Sản phẩm with Hover Container & Mega Menu */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={handleMouseEnterMenu}
              onMouseLeave={handleMouseLeaveMenu}
            >
              {/* Red "Mới" Badge above "Sản phẩm" */}
              <span className="absolute top-3.5 left-1/2 -translate-x-1/2 bg-[#E51E25] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase leading-none shadow-sm animate-pulse pointer-events-none">
                Mới
              </span>

              <button
                type="button"
                className={`text-base font-semibold transition-colors duration-200 flex items-center gap-1.5 py-2 cursor-pointer ${
                  productMegaMenuOpen
                    ? 'text-[#E51E25] font-bold'
                    : 'text-neutral-800 hover:text-[#E51E25]'
                }`}
              >
                <span>Sản phẩm</span>
                <span className={`transform transition-transform duration-300 ${productMegaMenuOpen ? 'rotate-180 text-[#E51E25]' : 'rotate-0 text-neutral-500'}`}>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {/* Local bridge under Sản phẩm only so mouse can travel to menu seamlessly */}
              {productMegaMenuOpen && (
                <div className="absolute top-full -left-2 -right-2 h-6 pointer-events-auto" />
              )}

              {/* MEGA MENU: Container is pointer-events-none to prevent eating outside mouse moves */}
              <div 
                className={`fixed left-0 right-0 top-[110px] w-full flex justify-center z-50 pointer-events-none transition-all duration-150 ease-out transform gpu-layer ${
                  productMegaMenuOpen
                    ? 'opacity-100 translate-y-0 visible'
                    : 'opacity-0 -translate-y-2 invisible'
                }`}
              >
                {/* Actual white card has pointer-events-auto and active mouse listeners */}
                <div 
                  className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-200/90 p-7 sm:p-8 mx-4 pointer-events-auto"
                  onMouseEnter={handleMouseEnterMenu}
                  onMouseLeave={handleMouseLeaveMenu}
                >
                  
                  {/* 4 Columns */}
                  <div className="grid grid-cols-4 gap-8">
                    {megaMenuColumns.map((col, idx) => (
                      <div key={idx} className="space-y-3.5">
                        <div className="border-b border-gray-200 pb-2.5">
                          <h4 className="font-bold text-base text-neutral-900 tracking-tight cursor-pointer hover:text-[#E51E25] transition-colors"
                            onClick={() => {
                              handleSelectMenuItem(col.categoryKey, null, null);
                            }}
                          >
                            {col.title}
                          </h4>
                        </div>

                        <ul className="space-y-2.5 pt-1">
                          {col.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <a
                                href={`#product-${item.id}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleSelectMenuItem(col.categoryKey, item.id, item.label);
                                }}
                                className="text-sm font-medium text-neutral-600 hover:text-[#E51E25] hover:translate-x-1.5 transition-all duration-200 block py-0.5 cursor-pointer"
                              >
                                {item.label}
                              </a>
                            </li>
                          ))}
                          <li>
                            <a
                              href={`#products-${col.categoryKey}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleSelectMenuItem(col.categoryKey, null, null);
                              }}
                              className="text-xs font-semibold text-[#E51E25] hover:underline transition-all duration-200 block py-0.5 cursor-pointer mt-1"
                            >
                              Xem tất cả {col.title} →
                            </a>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Promo Banner */}
                  <div className="mt-8 pt-5 border-t border-gray-100">
                    <a 
                      href="#menu"
                      onClick={() => handleSelectMenuItem('all')}
                      className="block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group/banner"
                    >
                      <img
                        src="/img/mega_menu_1_img.webp"
                        alt="25% OFF OFF 25% Khuyến Mãi Cà Phê"
                        className="w-full h-auto object-cover group-hover/banner:scale-[1.01] transition-transform duration-500 ease-out"
                      />
                    </a>
                  </div>

                </div>
              </div>
            </div>

            {/* Menu */}
            <a
              href="#menu-page"
              onMouseEnter={handleCloseMegaMenuImmediately}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('menu');
              }}
              className={`text-base transition-colors py-2 cursor-pointer ${
                currentPage === 'menu'
                  ? 'font-bold text-[#E51E25]'
                  : 'font-semibold text-neutral-800 hover:text-[#E51E25]'
              }`}
            >
              Menu
            </a>

            {/* Order */}
            <a
              href="#order-page"
              onMouseEnter={handleCloseMegaMenuImmediately}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('order');
              }}
              className={`text-base transition-colors py-2 cursor-pointer ${
                currentPage === 'order'
                  ? 'font-bold text-[#E51E25]'
                  : 'font-semibold text-neutral-800 hover:text-[#E51E25]'
              }`}
            >
              Order
            </a>

            {/* Cảm hứng từ cà phê */}
            <a
              href="#gallery"
              onMouseEnter={handleCloseMegaMenuImmediately}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('home', '#gallery');
              }}
              className="text-base font-semibold text-neutral-800 hover:text-[#E51E25] transition-colors py-2 cursor-pointer"
            >
              Cảm hứng từ cà phê
            </a>

            {/* Liên hệ */}
            <a
              href="#contact-page"
              onMouseEnter={handleCloseMegaMenuImmediately}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('contact');
              }}
              className={`text-base transition-colors py-2 cursor-pointer ${
                currentPage === 'contact'
                  ? 'font-bold text-[#E51E25]'
                  : 'font-semibold text-neutral-800 hover:text-[#E51E25]'
              }`}
            >
              Liên hệ
            </a>
          </nav>

          {/* Right Action Icons: Search, Cart, Account */}
          <div 
            className="flex items-center gap-4 sm:gap-6 shrink-0"
            onMouseEnter={handleCloseMegaMenuImmediately}
          >
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-neutral-700 hover:text-[#E51E25] transition-colors duration-200 cursor-pointer"
                aria-label="Tìm kiếm"
                title="Tìm kiếm"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Floating Desktop Search Popover */}
              <div 
                className={`absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-50 transition-all duration-300 transform gpu-layer ${
                  showSearch
                    ? 'opacity-100 translate-y-0 visible pointer-events-auto'
                    : 'opacity-0 -translate-y-2 invisible pointer-events-none'
                }`}
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm cà phê, đồ uống..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 text-neutral-900 placeholder:text-gray-400 text-sm rounded-xl pl-9 pr-7 py-2.5 border border-gray-200 focus:border-[#E51E25] focus:outline-none transition-colors"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-sm text-gray-400 hover:text-neutral-900"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Cart with red counter badge */}
            <button
              onClick={() => navigateTo('cart')}
              className={`relative p-2 transition-colors duration-200 cursor-pointer ${
                currentPage === 'cart' ? 'text-[#E51E25]' : 'text-neutral-700 hover:text-[#E51E25]'
              }`}
              aria-label="Giỏ hàng"
              title="Xem giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute top-0.5 -right-1 min-w-[20px] h-[20px] bg-[#E51E25] text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                {cartCount}
              </span>
            </button>

            {/* Quick VIP Register Button on Header */}
            {!currentUser && (
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#E51E25] text-xs font-bold transition border border-red-200 cursor-pointer shadow-xs"
              >
                <Gift className="w-3.5 h-3.5 text-[#E51E25]" />
                <span>Đăng ký +50K</span>
              </button>
            )}

            {/* User Account with Dropdown Popover matching Screenshot */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  if (showSearch) setShowSearch(false);
                }}
                className={`p-2 transition-colors duration-200 cursor-pointer relative ${
                  showUserMenu ? 'text-[#E51E25]' : 'text-neutral-700 hover:text-[#E51E25]'
                }`}
                aria-label="Tài khoản"
                title={currentUser ? `Tài khoản: ${currentUser.name}` : 'Đăng nhập tài khoản'}
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                {currentUser && (
                  <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Popover Dropdown matching Screenshot */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-3 w-[330px] sm:w-[350px] bg-white rounded-lg shadow-2xl border border-gray-200/90 p-6 z-50 animate-smoothFadeIn text-left">
                  {/* Top Caret Arrow pointing up directly at User Icon */}
                  <div className="absolute -top-2 right-3.5 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45 z-10 pointer-events-none"></div>

                  {/* Mode 1: Login Form (Default from Screenshot) */}
                  {!currentUser && authMode === 'login' && (
                    <div className="relative z-20">
                      {/* VIP Invitation Card */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          openAuthModal('register');
                        }}
                        className="w-full mb-3.5 p-2.5 rounded-xl bg-gradient-to-r from-[#E51E25] to-[#8C0C10] hover:from-[#C9141A] hover:to-[#73080B] text-white flex items-center justify-between shadow-md transition-all group cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-sm shrink-0">
                            🎁
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black uppercase tracking-wide">Đăng Ký Hội Viên</span>
                              <span className="px-1 py-0.2 bg-amber-400 text-neutral-900 text-[9px] font-extrabold rounded">VIP</span>
                            </div>
                            <p className="text-[10px] text-red-100">Tặng Voucher 50K & 100 Điểm</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-white/90 group-hover:translate-x-0.5 transition-transform">
                          &rarr;
                        </span>
                      </button>

                      <h3 className="font-condensed font-bold text-xl sm:text-[22px] text-[#3E3B3B] uppercase tracking-wide text-center">
                        ĐĂNG NHẬP TÀI KHOẢN
                      </h3>
                      <p className="text-sm text-neutral-500 text-center mt-1 pb-3">
                        Nhập email và mật khẩu của bạn:
                      </p>
                      
                      {/* Divider line under subtitle matching image */}
                      <div className="w-full border-b border-gray-200 mb-4"></div>

                      <form onSubmit={handleLoginSubmit} className="space-y-3">
                        <div>
                          <input
                            type="email"
                            placeholder="Email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-sm text-neutral-800 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#E51E25] focus:ring-1 focus:ring-[#E51E25] placeholder:text-neutral-400 transition"
                            required
                            autoFocus
                          />
                        </div>

                        <div>
                          <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-sm text-neutral-800 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#E51E25] focus:ring-1 focus:ring-[#E51E25] placeholder:text-neutral-400 transition"
                            required
                          />
                        </div>

                        {/* reCAPTCHA Notice matching screenshot */}
                        <p className="text-xs text-neutral-400 leading-tight pt-1">
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

                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="w-full bg-[#E51E25] hover:bg-[#C9141A] active:bg-[#B01016] text-white font-bold text-sm sm:text-base py-3 rounded transition-colors duration-200 cursor-pointer shadow-sm mt-3"
                        >
                          Đăng nhập
                        </button>
                      </form>

                      {/* Footer Links matching screenshot */}
                      <div className="pt-4 space-y-1.5 text-xs sm:text-[13px] text-neutral-600 text-left border-t border-gray-100 mt-4">
                        <p>
                          Khách hàng mới?{' '}
                          <button
                            type="button"
                            onClick={() => {
                              setShowUserMenu(false);
                              openAuthModal('register');
                            }}
                            className="text-[#E51E25] hover:underline font-bold cursor-pointer"
                          >
                            Tạo tài khoản (Nhận 50K)
                          </button>
                        </p>
                        <p>
                          Quên mật khẩu?{' '}
                          <button
                            type="button"
                            onClick={() => {
                              setShowUserMenu(false);
                              openAuthModal('forgot');
                            }}
                            className="text-[#E51E25] hover:underline font-medium cursor-pointer"
                          >
                            Khôi phục mật khẩu
                          </button>
                        </p>
                        <div className="pt-2 border-t border-gray-100 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowUserMenu(false);
                              navigateTo('admin');
                            }}
                            className="text-xs text-slate-500 hover:text-[#E51E25] font-semibold flex items-center gap-1.5 cursor-pointer transition w-full"
                          >
                            <span>⚙️</span> Trang Quản Trị Hệ Thống (Admin)
                            <span className="ml-auto px-1.5 py-0.2 bg-red-100 text-[#E51E25] text-[10px] rounded font-bold">PRO</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode 2: Register Form */}
                  {!currentUser && authMode === 'register' && (
                    <div className="relative z-20">
                      {/* VIP Full Modal Switch Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          openAuthModal('register');
                        }}
                        className="w-full mb-3 py-2 px-3 bg-red-50 hover:bg-red-100 text-[#E51E25] font-bold text-xs rounded-xl border border-red-200 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#E51E25]" />
                        <span>Mở Form Đăng Ký VIP (+50K Voucher)</span>
                      </button>

                      <h3 className="font-condensed font-bold text-xl sm:text-[22px] text-[#3E3B3B] uppercase tracking-wide text-center">
                        TẠO TÀI KHOẢN
                      </h3>
                      <p className="text-sm text-neutral-500 text-center mt-1 pb-3">
                        Nhập thông tin của bạn để đăng ký:
                      </p>
                      <div className="w-full border-b border-gray-200 mb-4"></div>

                      <form onSubmit={handleRegisterSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            placeholder="Họ"
                            value={registerForm.lastName}
                            onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-sm text-neutral-800 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#E51E25] focus:ring-1 focus:ring-[#E51E25] placeholder:text-neutral-400 transition"
                          />
                          <input
                            type="text"
                            placeholder="Tên"
                            value={registerForm.firstName}
                            onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-sm text-neutral-800 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#E51E25] focus:ring-1 focus:ring-[#E51E25] placeholder:text-neutral-400 transition"
                            required
                          />
                        </div>

                        <div>
                          <input
                            type="email"
                            placeholder="Email"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-sm text-neutral-800 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#E51E25] focus:ring-1 focus:ring-[#E51E25] placeholder:text-neutral-400 transition"
                            required
                          />
                        </div>

                        <div>
                          <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-sm text-neutral-800 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#E51E25] focus:ring-1 focus:ring-[#E51E25] placeholder:text-neutral-400 transition"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#E51E25] hover:bg-[#C9141A] text-white font-bold text-sm sm:text-base py-3 rounded transition-colors duration-200 cursor-pointer shadow-sm mt-3"
                        >
                          Đăng ký
                        </button>
                      </form>

                      <div className="pt-4 text-xs sm:text-[13px] text-neutral-600 text-left border-t border-gray-100 mt-4">
                        <p>
                          Đã có tài khoản?{' '}
                          <button
                            type="button"
                            onClick={() => setAuthMode('login')}
                            className="text-[#E51E25] hover:underline font-medium cursor-pointer"
                          >
                            Đăng nhập ngay
                          </button>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Mode 3: Forgot Password Form */}
                  {!currentUser && authMode === 'forgot' && (
                    <div className="relative z-20">
                      <h3 className="font-condensed font-bold text-xl sm:text-[22px] text-[#3E3B3B] uppercase tracking-wide text-center">
                        PHỤC HỒI MẬT KHẨU
                      </h3>
                      <p className="text-sm text-neutral-500 text-center mt-1 pb-3">
                        Nhập email của bạn để nhận hướng dẫn:
                      </p>
                      <div className="w-full border-b border-gray-200 mb-4"></div>

                      <form onSubmit={handleForgotSubmit} className="space-y-3">
                        <div>
                          <input
                            type="email"
                            placeholder="Email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm text-neutral-800 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#E51E25] focus:ring-1 focus:ring-[#E51E25] placeholder:text-neutral-400 transition"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#E51E25] hover:bg-[#C9141A] text-white font-bold text-sm sm:text-base py-3 rounded transition-colors duration-200 cursor-pointer shadow-sm mt-3"
                        >
                          Khôi phục
                        </button>
                      </form>

                      <div className="pt-4 text-xs sm:text-[13px] text-neutral-600 text-left border-t border-gray-100 mt-4">
                        <p>
                          Bạn nhớ mật khẩu?{' '}
                          <button
                            type="button"
                            onClick={() => setAuthMode('login')}
                            className="text-[#E51E25] hover:underline font-medium cursor-pointer"
                          >
                            Quay lại đăng nhập
                          </button>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Mode 4: Logged In User Profile */}
                  {currentUser && (
                    <div className="relative z-20 space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                        <div className="w-12 h-12 rounded-full bg-[#E51E25] text-white flex items-center justify-center font-bold text-lg uppercase shadow-sm">
                          {currentUser.name ? currentUser.name.charAt(0) : 'C'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-neutral-900 text-base truncate">
                            {currentUser.name}
                          </h4>
                          <p className="text-xs text-neutral-500 truncate">
                            {currentUser.email}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-red-50 text-[#E51E25] text-[10px] font-bold rounded">
                            Thành viên Coffeena
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            navigateTo('admin');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-slate-800 hover:bg-red-50 hover:text-[#E51E25] rounded-md transition cursor-pointer"
                        >
                          <span className="flex items-center gap-2">⚙️ Bảng Quản Trị (Admin)</span>
                          <span className="px-1.5 py-0.5 text-[10px] bg-red-100 text-[#E51E25] rounded font-extrabold tracking-wide">PRO</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            navigateTo('cart');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md transition cursor-pointer"
                        >
                          <span>Giỏ hàng của tôi</span>
                          <span className="font-bold text-[#E51E25]">{cartCount} sản phẩm</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          logoutUser();
                          setShowUserMenu(false);
                        }}
                        className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-sm py-2.5 rounded transition-colors duration-200 cursor-pointer"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 hover:text-[#E51E25] transition-colors duration-200 cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu with Smooth Accordion */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 space-y-2 animate-smoothFadeIn bg-white">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('home');
              }}
              className={`block px-4 py-2.5 text-base rounded-lg transition-colors cursor-pointer ${
                currentPage === 'home'
                  ? 'font-bold text-[#E51E25] bg-red-50/60'
                  : 'font-semibold text-neutral-800 hover:text-[#E51E25]'
              }`}
            >
              Trang chủ
            </a>
            <a
              href="#about-page"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('about');
              }}
              className={`block px-4 py-2.5 text-base rounded-lg transition-colors cursor-pointer ${
                currentPage === 'about'
                  ? 'font-bold text-[#E51E25] bg-red-50/60'
                  : 'font-semibold text-neutral-800 hover:text-[#E51E25]'
              }`}
            >
              Giới thiệu
            </a>

            <div>
              <button
                type="button"
                onClick={() => setMobileProductExpanded(!mobileProductExpanded)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-base font-semibold text-neutral-800 hover:text-[#E51E25]"
              >
                <div className="flex items-center gap-2">
                  <span>Sản phẩm</span>
                  <span className="bg-[#E51E25] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Mới
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileProductExpanded ? 'rotate-180 text-[#E51E25]' : 'rotate-0 text-neutral-500'}`} />
              </button>

              {mobileProductExpanded && (
                <div className="pl-6 pr-4 py-3 space-y-4 bg-gray-50 rounded-xl my-1 border border-gray-100 animate-smoothFadeIn">
                  {megaMenuColumns.map((col, idx) => (
                    <div key={idx} className="space-y-2">
                      <p className="text-sm font-bold text-neutral-900 border-b border-gray-200 pb-1">
                        {col.title}
                      </p>
                      <ul className="space-y-1.5">
                        {col.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <a
                              href={`#product-${item.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleSelectMenuItem(col.categoryKey, item.id, item.label);
                              }}
                              className="text-sm text-neutral-700 hover:text-[#E51E25] block py-0.5 cursor-pointer"
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <img
                    src="/img/mega_menu_1_img.webp"
                    alt="25% OFF"
                    className="w-full h-auto rounded-lg pt-2"
                  />
                </div>
              )}
            </div>

            <a
              href="#menu-page"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('menu');
              }}
              className={`block px-4 py-2.5 text-base rounded-lg transition-colors cursor-pointer ${
                currentPage === 'menu'
                  ? 'font-bold text-[#E51E25] bg-red-50/60'
                  : 'font-semibold text-neutral-800 hover:text-[#E51E25]'
              }`}
            >
              Menu
            </a>
            <a
              href="#order-page"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('order');
              }}
              className={`block px-4 py-2.5 text-base rounded-lg transition-colors cursor-pointer ${
                currentPage === 'order'
                  ? 'font-bold text-[#E51E25] bg-red-50/60'
                  : 'font-semibold text-neutral-800 hover:text-[#E51E25]'
              }`}
            >
              Order
            </a>
            <a
              href="#gallery"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('home', '#gallery');
              }}
              className="block px-4 py-2.5 text-base font-semibold text-neutral-800 hover:text-[#E51E25] cursor-pointer"
            >
              Cảm hứng từ cà phê
            </a>
            <a
              href="#contact-page"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('contact');
              }}
              className={`block px-4 py-2.5 text-base rounded-lg transition-colors cursor-pointer ${
                currentPage === 'contact'
                  ? 'font-bold text-[#E51E25] bg-red-50/60'
                  : 'font-semibold text-neutral-800 hover:text-[#E51E25]'
              }`}
            >
              Liên hệ
            </a>

            {/* Mobile Account & Admin Entry */}
            <div className="pt-2 border-t border-gray-100 space-y-1">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo('admin');
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-base font-bold text-slate-800 hover:text-[#E51E25] hover:bg-red-50/50 rounded-lg cursor-pointer text-left transition"
              >
                <span className="flex items-center gap-2.5">
                  <span>⚙️</span> Trang Quản Trị (Admin)
                </span>
                <span className="px-2 py-0.5 text-xs bg-red-100 text-[#E51E25] rounded font-extrabold">PRO</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (currentUser) {
                    setShowUserMenu(true);
                  } else {
                    openAuthModal('register');
                  }
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-base font-semibold text-neutral-800 hover:text-[#E51E25] cursor-pointer text-left"
              >
                <span className="flex items-center gap-3">
                  <User className="w-5 h-5 text-neutral-700" />
                  <span>{currentUser ? `Tài khoản (${currentUser.name})` : 'Đăng Ký / Đăng Nhập'}</span>
                </span>
                {!currentUser && (
                  <span className="px-2 py-0.5 text-xs bg-red-100 text-[#E51E25] rounded-full font-bold flex items-center gap-1">
                    <Gift className="w-3 h-3" /> Nhận 50K
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
