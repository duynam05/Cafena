import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Local storage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cafena_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('cafena_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // User Authentication & Auth Modal state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cafena_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modal Đăng ký / Đăng nhập toàn hệ thống
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('register'); // 'register' | 'login' | 'forgot'

  const openAuthModal = (mode = 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginUser = (email, password, name = '') => {
    const displayName = name || email.split('@')[0];
    const user = {
      email,
      name: displayName,
      points: 50,
      tier: 'Thành viên Bạc (Silver)',
      loggedInAt: new Date().toISOString()
    };
    setCurrentUser(user);
    localStorage.setItem('cafena_user', JSON.stringify(user));
    addToast(`Đăng nhập thành công! Chào mừng ${displayName}`, 'success');
    return user;
  };

  const registerUser = (userData) => {
    const { email, name, phone } = userData;
    const displayName = name || (email ? email.split('@')[0] : 'Thành viên mới');
    const newUser = {
      email,
      name: displayName,
      phone: phone || '',
      points: 100, // Tặng 100 điểm thưởng chào mừng
      voucher: 'CFN-WELCOME50K', // Tặng mã giảm 50k
      tier: 'Hội viên VIP Cafena',
      joinedAt: new Date().toISOString(),
      loggedInAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    localStorage.setItem('cafena_user', JSON.stringify(newUser));
    addToast(`🎉 Chúc mừng ${displayName}! Đăng ký thành công, bạn được tặng E-Voucher 50.000đ & 100 điểm thưởng!`, 'success');
    return newUser;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('cafena_user');
    addToast('Đã đăng xuất khỏi tài khoản', 'info');
  };

  useEffect(() => {
    localStorage.setItem('cafena_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cafena_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Toast notification
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product, selectedOptions = {}) => {
    const isOut = product.isOutOfStock || (product.stockQuantity !== undefined && Number(product.stockQuantity) <= 0);
    if (isOut) {
      addToast(`Sản phẩm "${product.name}" hiện đang hết hàng!`, 'error');
      return;
    }
    const selectedSize = selectedOptions.size || (product.packageSizes ? product.packageSizes[0] : (product.options?.sizes ? product.options.sizes[0] : 'Tiêu chuẩn'));
    const selectedSugar = selectedOptions.sugar || (product.options?.sugarLevels ? product.options.sugarLevels[0] : null);
    const selectedIce = selectedOptions.ice || (product.options?.iceLevels ? product.options.iceLevels[0] : null);
    const quantity = selectedOptions.quantity || 1;

    // Unique key by options
    const cartItemId = `${product.id}-${selectedSize}-${selectedSugar || ''}-${selectedIce || ''}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          size: selectedSize,
          sugar: selectedSugar,
          ice: selectedIce,
          quantity
        }
      ];
    });

    addToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    addToast('Đã xóa món khỏi giỏ hàng', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setDiscountCode('');
    setDiscountPercent(0);
  };

  // Wishlist toggle
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        addToast('Đã xóa khỏi danh sách yêu thích', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('Đã thêm vào danh sách yêu thích ❤️');
        return [...prev, productId];
      }
    });
  };

  // Voucher apply
  const applyVoucher = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'CAFENA20') {
      setDiscountCode('CAFENA20');
      setDiscountPercent(20);
      addToast('Áp dụng mã CAFENA20: Giảm 20% thành công!');
      return true;
    } else if (clean === 'FREESHIP') {
      setDiscountCode('FREESHIP');
      setDiscountPercent(10);
      addToast('Áp dụng mã FREESHIP: Giảm 10% phí!');
      return true;
    } else {
      addToast('Mã ưu đãi không hợp lệ hoặc đã hết hạn', 'error');
      return false;
    }
  };

  // Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round((subTotal * discountPercent) / 100);
  const shippingFee = subTotal > 299000 || subTotal === 0 ? 0 : 25000;
  const finalTotal = Math.max(0, subTotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subTotal,
        discountCode,
        discountPercent,
        discountAmount,
        shippingFee,
        finalTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyVoucher,
        wishlist,
        toggleWishlist,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        toasts,
        addToast,
        removeToast,
        currentUser,
        loginUser,
        registerUser,
        logoutUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

