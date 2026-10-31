import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import MenuPage from './components/MenuPage';
import ContactPage from './components/ContactPage';
import CartPage from './components/CartPage';
import Features from './components/Features';
import SignatureMenu from './components/SignatureMenu';
import PackagedProducts from './components/PackagedProducts';
import Reviews from './components/Reviews';
import Gallery from './components/Gallery';
import Reservation from './components/Reservation';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import FloatingContact from './components/FloatingContact';
import ProductDetailPage from './components/ProductDetailPage';
import OrderPage from './components/OrderPage';
import PackagedProductsPage from './components/PackagedProductsPage';
import AdminPage from './components/AdminPage';
import { ALL_PRODUCTS, PACKAGED_PRODUCTS, findProduct } from './data/products';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sản phẩm đang xem chi tiết (Mặc định Cafe 6 theo video nếu chưa chọn)
  const [selectedProduct, setSelectedProduct] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#product-')) {
      const prodId = window.location.hash.replace('#product-', '');
      const found = findProduct(prodId);
      if (found) return found;
    }
    return findProduct('packaged-6') || PACKAGED_PRODUCTS[0];
  });

  // Quản lý trang hiện tại: 'home', 'about', 'menu', 'order', 'contact', 'cart', 'product-detail' hoặc 'admin'
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#admin' || window.location.hash === '#admin-dashboard') return 'admin';
      if (window.location.hash === '#about-page') return 'about';
      if (window.location.hash === '#menu-page') return 'menu';
      if (window.location.hash === '#order-page') return 'order';
      if (window.location.hash.startsWith('#products')) return 'products';
      if (window.location.hash === '#contact-page') return 'contact';
      if (window.location.hash === '#cart-page') return 'cart';
      if (window.location.hash.startsWith('#product-') || window.location.hash === '#product-detail') return 'product-detail';
    }
    return 'home';
  });

  // Điều hướng đến trang chi tiết sản phẩm
  const handleSelectProduct = (product) => {
    if (!product) return;
    const fullProduct = findProduct(product.id || product.slug || product.name) || product;
    setSelectedProduct(fullProduct);
    setCurrentPage('product-detail');
    window.location.hash = `#product-${fullProduct.slug || fullProduct.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Đồng bộ với nút Back/Forward của trình duyệt và URL hash
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#admin-dashboard') {
        setCurrentPage('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#about-page') {
        setCurrentPage('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#menu-page') {
        setCurrentPage('menu');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#order-page') {
        setCurrentPage('order');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash.startsWith('#products')) {
        setCurrentPage('products');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#contact-page') {
        setCurrentPage('contact');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#cart-page') {
        setCurrentPage('cart');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash.startsWith('#product-') || window.location.hash === '#product-detail') {
        const prodId = window.location.hash.replace('#product-', '');
        const found = findProduct(prodId);
        if (found) setSelectedProduct(found);
        setCurrentPage('product-detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#home' || !window.location.hash) {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <CartProvider>
      {currentPage === 'admin' ? (
        <div className="min-h-screen bg-[#140D08] font-sans selection:bg-[#D97706] selection:text-white">
          <AdminPage
            navigateTo={(page) => {
              setCurrentPage(page);
              if (page === 'home') {
                window.location.hash = '#home';
              } else if (page === 'products') {
                window.location.hash = '#products-page';
              } else {
                window.location.hash = `#${page}-page`;
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
          <Toast />
        </div>
      ) : (
        <div className="min-h-screen bg-white text-[#1E1E1E] flex flex-col font-sans selection:bg-[#E51E25] selection:text-white">
          {/* Navigation Bar - Red Topbar & White Navbar */}
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onSelectProduct={handleSelectProduct}
          />

          {/* Chuyển trang linh hoạt: 'home', 'about', 'menu' */}
          {currentPage === 'home' && (
            <main className="flex-1 animate-fadeIn">
              {/* Hero Banner Carousel (Organic Coffee Khuyến Mãi Đến 50% from Screenshot) */}
              <Hero />

              {/* 4 Brand Core Values in Clean Red & White */}
              <Features />

              {/* Menu đặc trưng: ƯA THÍCH TẠI COFFEENA */}
              <SignatureMenu onSelectProduct={handleSelectProduct} />

              {/* Thưởng thức mọi nơi: SẢN PHẨM ĐÓNG GÓI */}
              <PackagedProducts onSelectProduct={handleSelectProduct} />

              {/* Khách hàng nói về Coffeena: ĐÁNH GIÁ TRẢI NGHIỆM */}
              <Reviews />

              {/* Những điều thú vị: HOẠT ĐỘNG CỦA COFFEENA (Gallery) */}
              <Gallery />

              {/* Đặt chỗ ngay: ĐẶT BÀN & GOOGLE MAPS */}
              <Reservation />
            </main>
          )}

          {currentPage === 'about' && (
            <main className="flex-1 animate-fadeIn">
              {/* TRANG GIỚI THIỆU RIÊNG BIỆT (Ảnh tách cà phê sóng sánh & 3 đoạn văn bản) */}
              <AboutUs />
            </main>
          )}

          {currentPage === 'menu' && (
            <main className="flex-1 animate-fadeIn">
              {/* TRANG MENU GỢI Ý RIÊNG BIỆT (Danh sách món & Thời gian hoạt động) */}
              <MenuPage onSelectProduct={handleSelectProduct} />
            </main>
          )}

          {currentPage === 'order' && (
            <main className="flex-1 animate-fadeIn">
              {/* TRANG ORDER RIÊNG BIỆT (Theo video cafena.myharavan.com/pages/order) */}
              <OrderPage 
                onSelectProduct={handleSelectProduct}
                navigateTo={(page) => {
                  setCurrentPage(page);
                  window.location.hash = page === 'home' ? '#home' : `#${page}-page`;
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </main>
          )}

          {currentPage === 'products' && (
            <main className="flex-1 animate-fadeIn">
              {/* TRANG TẤT CẢ SẢN PHẨM ĐÓNG GÓI (Theo video cafena.myharavan.com/collections/all) */}
              <PackagedProductsPage
                onSelectProduct={handleSelectProduct}
                navigateTo={(page) => {
                  setCurrentPage(page);
                  window.location.hash = page === 'home' ? '#home' : `#${page}-page`;
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </main>
          )}

          {currentPage === 'contact' && (
            <main className="flex-1 animate-fadeIn">
              {/* TRANG LIÊN HỆ RIÊNG BIỆT (Thông tin liên hệ & Biểu mẫu gửi thắc mắc) */}
              <ContactPage />
            </main>
          )}

          {currentPage === 'cart' && (
            <main className="flex-1 animate-fadeIn">
              {/* TRANG GIỎ HÀNG RIÊNG BIỆT (Theo video cafena.myharavan.com/cart) */}
              <CartPage 
                onSelectProduct={handleSelectProduct}
                navigateTo={(page) => {
                  setCurrentPage(page);
                  window.location.hash = page === 'home' ? '#home' : `#${page}-page`;
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
              />
            </main>
          )}

          {currentPage === 'product-detail' && (
            <main className="flex-1 animate-fadeIn">
              {/* TRANG CHI TIẾT SẢN PHẨM ĐÓNG GÓI RIÊNG BIỆT (Theo video cafena.myharavan.com/products/cafe-6) */}
              <ProductDetailPage 
                product={selectedProduct} 
                onSelectProduct={handleSelectProduct}
                navigateTo={(page, anchor) => {
                  setCurrentPage(page);
                  if (page === 'home') {
                    window.location.hash = anchor || '#home';
                  } else if (page === 'products') {
                    window.location.hash = anchor || '#products-page';
                  } else {
                    window.location.hash = `#${page}-page`;
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </main>
          )}

          {/* Footer chuẩn theo ảnh chụp Haravan */}
          <Footer currentPage={currentPage} setCurrentPage={setCurrentPage} />

          {/* Floating Chat / Contact Widget matching Screenshot */}
          <FloatingContact />

          {/* Overlay Modals & Drawers */}
          <CartDrawer />
          <QuickViewModal onSelectProduct={handleSelectProduct} />
          <CheckoutModal />
          <AuthModal />
          <Toast />
        </div>
      )}
    </CartProvider>
  );
}
