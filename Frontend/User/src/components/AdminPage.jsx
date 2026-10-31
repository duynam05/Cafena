import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  Settings,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  RefreshCw,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Store,
  Bell,
  Sparkles,
  Layers,
  SlidersHorizontal,
  Image as ImageIcon,
  Tag,
  CheckSquare,
  Square,
  Coffee,
  Menu as MenuIcon,
  HelpCircle,
  Share2,
  Download,
  Printer,
  Receipt,
  BarChart3
} from 'lucide-react';
import { ALL_PRODUCTS, formatVND } from '../data/products';
import { useCart } from '../context/CartContext';
import RevenueReport from './RevenueReport';
import InvoiceModal from './InvoiceModal';

// Danh sách ảnh mẫu có sẵn trong thư mục public/img để chọn nhanh khi tạo/sửa món
const AVAILABLE_IMAGES = [
  { label: 'Cafe Đóng Gói 1', path: '/img/1_53dca42ae400412e9993f78087279535_large.webp' },
  { label: 'Cafe Đóng Gói 2', path: '/img/2_2cc8af50a4674fe6ab472435d334e18e_large.webp' },
  { label: 'Cafe Đóng Gói 3', path: '/img/3_81820de77c0f4c62966c026b9639c292_large.webp' },
  { label: 'Cafe Đóng Gói 4', path: '/img/4_94490edda70148eda96ac41fb39e288f_large.webp' },
  { label: 'Ấm Bialetti Brikka', path: '/img/moka_bialetti_brikka.jpg' },
  { label: 'Ấm Moka Nhôm', path: '/img/moka_nhom_kieu_y.jpg' },
  { label: 'Bình Bodum Chambord', path: '/img/french_press_bodum_chambord.jpg' },
  { label: 'Bình French Press Lock&Lock', path: '/img/french_press_locknlock_llg018.jpg' },
  { label: 'Phễu V60 Hario', path: '/img/pheu_v60_hario_vdr02.jpg' },
  { label: 'Phễu Pha Cà Phê Hario', path: '/img/pheu_pha_ca_phe_hario_nhat_ban.jpg' },
  { label: 'Giấy Lọc Hario 40 cái', path: '/img/giay_loc_hario_40_cai.jpg' },
  { label: 'Giấy Lọc V60 V01', path: '/img/giay_loc_hario_v60_v01.jpg' },
  { label: 'Miếng Lót Tamper Silicon', path: '/img/mieng_lot_tamper_silicon.jpg' },
  { label: 'Tamper Inox 58mm', path: '/img/tamper_inox_58mm.jpg' },
  { label: 'Chổi Vệ Sinh Cán Gỗ', path: '/img/choi_ve_sinh_can_go.jpg' },
  { label: 'Cọ Vệ Sinh Họng Máy', path: '/img/co_ve_sinh_hong_may.jpg' },
  { label: 'Cối Xay SIONREAIPA', path: '/img/may_xay_co_dien_sionreaipa.jpg' },
  { label: 'Cối Xay MONGDIO', path: '/img/mongdio_may_xay_quay_tay.jpg' },
  { label: 'Cối Xay 1Zpresso Q Air', path: '/img/coi_xay_1zpresso_q_air.jpg' },
  { label: 'Cối Xay Timemore C3', path: '/img/timemore_c3_esp_pro.jpg' },
  { label: 'Cối Xay Timemore S3', path: '/img/timemore_s3_flagship_2025.jpg' },
  { label: 'Cối Xay 1Zpresso K-Plus', path: '/img/1zpresso_k_plus.jpg' }
];

const CATEGORY_OPTIONS = [
  { id: 'packaged', name: 'Cà phê đóng gói', icon: '☕' },
  { id: 'equipment', name: 'Dụng cụ pha cà phê', icon: '🫖' },
  { id: 'accessory', name: 'Phụ kiện', icon: '🔧' },
  { id: 'grinder', name: 'Máy xay cafe cầm tay', icon: '⚙️' }
];

// Khởi tạo danh sách đơn hàng demo nếu chưa có trong localStorage
const INITIAL_DEMO_ORDERS = [
  {
    id: 'CFN-842918',
    code: 'CFN-842918',
    customerName: 'Trần Minh Hoàng',
    phone: '0908 123 456',
    address: 'Số 45 Lê Duẩn, Bến Nghé, Quận 1, TP.HCM',
    note: 'Giao giờ hành chính, gọi trước 15 phút',
    paymentMethod: 'cod',
    items: [
      { id: 'packaged-6', name: 'Cafe 6', price: 320000, quantity: 2, image: '/img/4_94490edda70148eda96ac41fb39e288f_large.webp' },
      { id: 'accessory-1', name: 'Chổi vệ sinh máy pha cán gỗ', price: 18000, quantity: 2, image: '/img/choi_ve_sinh_can_go.jpg' }
    ],
    itemCount: 4,
    shippingFee: 0,
    discountAmount: 0,
    finalTotal: 676000,
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'CFN-739104',
    code: 'CFN-739104',
    customerName: 'Lê Thuỳ Linh',
    phone: '0938 987 654',
    address: 'Căn hộ 12.04 Tòa Landmark 3, Vinhomes Central Park, Bình Thạnh',
    note: 'Để lễ tân giúp mình nhé',
    paymentMethod: 'bank',
    items: [
      { id: 'equipment-1', name: 'Bialetti Brikka cảm ứng 4 cốc', price: 4739040, quantity: 1, image: '/img/moka_bialetti_brikka.jpg' }
    ],
    itemCount: 1,
    shippingFee: 0,
    discountAmount: 200000,
    finalTotal: 4539040,
    status: 'shipping',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'CFN-512039',
    code: 'CFN-512039',
    customerName: 'Nguyễn Văn Đức',
    phone: '0912 345 678',
    address: '188 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP.HCM',
    note: 'Giao nhanh giúp mình',
    paymentMethod: 'cod',
    items: [
      { id: 'equipment-2', name: 'Ấm pha cà phê Moka Pot bằng nhôm', price: 225000, quantity: 1, image: '/img/moka_nhom_kieu_y.jpg' },
      { id: 'accessory-2', name: 'Cọ vệ sinh họng máy Espresso', price: 50000, quantity: 1, image: '/img/co_ve_sinh_hong_may.jpg' }
    ],
    itemCount: 2,
    shippingFee: 25000,
    discountAmount: 0,
    finalTotal: 300000,
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'CFN-318492',
    code: 'CFN-318492',
    customerName: 'Phạm Hải Đăng',
    phone: '0977 444 888',
    address: 'Khu đô thị Sala, Mai Chí Thọ, TP. Thủ Đức',
    note: 'Gói hàng cẩn thận giúp mình làm quà tặng',
    paymentMethod: 'bank',
    items: [
      { id: 'grinder-4', name: 'Timemore C3 ESP PRO', price: 1890000, quantity: 1, image: '/img/timemore_c3_esp_pro.jpg' },
      { id: 'accessory-3', name: 'Giấy lọc cà phê Hario 40 cái', price: 55000, quantity: 2, image: '/img/giay_loc_hario_40_cai.jpg' }
    ],
    itemCount: 3,
    shippingFee: 0,
    discountAmount: 100000,
    finalTotal: 1900000,
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString()
  }
];

export default function AdminPage({ navigateTo }) {
  const { addToast } = useCart();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'revenue' | 'products' | 'orders' | 'customers' | 'reviews' | 'settings'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Print invoice state
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const handleOpenInvoice = (order) => {
    setSelectedOrderForInvoice(order);
    setIsInvoiceOpen(true);
  };

  // Products state (Persisted in localStorage) - Chỉ quản lý sản phẩm đóng gói, dụng cụ, phụ kiện, máy xay (Không chứa đồ uống pha sẵn)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('cafena_admin_products');
      if (saved) {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Lọc sạch triệt để các sản phẩm nước pha sẵn còn tồn dư trong localStorage cũ
          parsed = parsed.filter(p => p.category !== 'menu' && !String(p.id).startsWith('sig-'));
          
          const existingIds = new Set(parsed.map(p => p.id));
          const missing = ALL_PRODUCTS.filter(p => !existingIds.has(p.id) && p.category !== 'menu' && !String(p.id).startsWith('sig-')).map(p => ({
            ...p,
            stockQuantity: p.stockQuantity !== undefined ? Number(p.stockQuantity) : (p.isOutOfStock ? 0 : 25)
          }));
          
          const cleaned = [
            ...parsed.map(p => ({
              ...p,
              stockQuantity: p.stockQuantity !== undefined ? Number(p.stockQuantity) : (p.isOutOfStock ? 0 : 25)
            })),
            ...missing
          ];
          
          // Ghi đè ngay vào localStorage để loại bỏ vĩnh viễn 6 món nước
          localStorage.setItem('cafena_admin_products', JSON.stringify(cleaned));
          return cleaned;
        }
      }
    } catch (e) {
      console.error(e);
    }
    const initialClean = ALL_PRODUCTS.filter(p => p.category !== 'menu' && !String(p.id).startsWith('sig-')).map(p => ({
      ...p,
      stockQuantity: p.stockQuantity !== undefined ? Number(p.stockQuantity) : (p.isOutOfStock ? 0 : 25)
    }));
    try {
      localStorage.setItem('cafena_admin_products', JSON.stringify(initialClean));
    } catch (e) {}
    return initialClean;
  });

  // Orders state (Persisted in localStorage)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('cafena_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DEMO_ORDERS;
  });

  // Save products to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('cafena_admin_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Save orders to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('cafena_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Filters for Products
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all'); // 'all' | 'in_stock' | 'out_of_stock'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modal State for Add / Edit Product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null if adding new

  // The Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'packaged',
    price: '',
    originalPrice: '',
    stockQuantity: 25,
    image: AVAILABLE_IMAGES[0].path,
    customImageUrl: '',
    description: '',
    isOutOfStock: false,
    badge: 'MỚI',
    rating: 5.0
  });

  // Filter for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Delete confirmation modal state
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  // Store Settings Form State
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('cafena_store_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      storeName: 'CAFENA Coffee Roastery & Bar',
      hotline: '1900 6789 - 028 3822 9999',
      email: 'contact@cafena.vn',
      address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      openingHours: '07:00 - 22:30 hàng ngày',
      standardShippingFee: 25000,
      freeShippingThreshold: 299000,
      announcementBar: 'SALE hot chào lương về - Freeship đơn 0đ cho thành viên mới!'
    };
  });

  // --- Statistics Calculations ---
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.finalTotal : 0), 0);
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalProducts = products.length;
    const outOfStockCount = products.filter(p => p.isOutOfStock || (p.stockQuantity !== undefined && Number(p.stockQuantity) <= 0)).length;
    const lowStockCount = products.filter(p => !p.isOutOfStock && p.stockQuantity !== undefined && Number(p.stockQuantity) > 0 && Number(p.stockQuantity) <= 5).length;
    const totalInventoryUnits = products.reduce((acc, p) => acc + (p.stockQuantity !== undefined ? Number(p.stockQuantity) : (p.isOutOfStock ? 0 : 25)), 0);

    return {
      totalRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      totalProducts,
      outOfStockCount,
      lowStockCount,
      totalInventoryUnits
    };
  }, [orders, products]);

  // --- Filtered Products List ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !productSearch || 
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(productSearch.toLowerCase());
      
      const matchCat = productCategory === 'all' || p.category === productCategory;
      
      const isOut = p.isOutOfStock || (p.stockQuantity !== undefined && Number(p.stockQuantity) <= 0);
      const qty = p.stockQuantity !== undefined ? Number(p.stockQuantity) : (isOut ? 0 : 25);

      let matchStock = true;
      if (productStockFilter === 'in_stock') {
        matchStock = !isOut && qty > 5;
      } else if (productStockFilter === 'low_stock') {
        matchStock = !isOut && qty > 0 && qty <= 5;
      } else if (productStockFilter === 'out_of_stock') {
        matchStock = isOut || qty <= 0;
      }

      return matchSearch && matchCat && matchStock;
    });
  }, [products, productSearch, productCategory, productStockFilter]);

  // --- Filtered Orders List ---
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = !orderSearch ||
        o.code.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.phone.includes(orderSearch);

      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'packaged',
      price: '',
      originalPrice: '',
      stockQuantity: 25,
      image: AVAILABLE_IMAGES[0].path,
      customImageUrl: '',
      description: '',
      isOutOfStock: false,
      badge: 'MỚI',
      rating: 5.0
    });
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    const isOut = !!product.isOutOfStock || (product.stockQuantity !== undefined && Number(product.stockQuantity) <= 0);
    const qty = product.stockQuantity !== undefined ? Number(product.stockQuantity) : (isOut ? 0 : 25);
    setProductForm({
      name: product.name || '',
      category: product.category || 'packaged',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      stockQuantity: qty,
      image: product.image || AVAILABLE_IMAGES[0].path,
      customImageUrl: '',
      description: product.description || product.desc || '',
      isOutOfStock: isOut,
      badge: isOut ? 'HẾT HÀNG' : (product.badge || (product.badges ? product.badges[0] : '')),
      rating: product.rating || 5.0
    });
    setIsProductModalOpen(true);
  };

  // Handle Form Submit (Save / Update Product)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      addToast('Vui lòng nhập tên sản phẩm', 'error');
      return;
    }
    if (!productForm.price || Number(productForm.price) <= 0) {
      addToast('Vui lòng nhập giá bán hợp lệ', 'error');
      return;
    }

    const finalImage = productForm.customImageUrl.trim() || productForm.image;
    const catObj = CATEGORY_OPTIONS.find(c => c.id === productForm.category);
    const parsedQty = Math.max(0, parseInt(productForm.stockQuantity, 10) || 0);
    const isOutOfStock = productForm.isOutOfStock || parsedQty <= 0;
    const finalQty = isOutOfStock ? 0 : parsedQty;

    if (editingProduct) {
      // Update existing
      setProducts(prev => prev.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: productForm.name.trim(),
            category: productForm.category,
            categoryName: catObj ? catObj.name : p.categoryName,
            price: Number(productForm.price),
            originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
            stockQuantity: finalQty,
            image: finalImage,
            isOutOfStock,
            badge: isOutOfStock ? 'HẾT HÀNG' : (productForm.badge || null),
            badges: productForm.badge ? [productForm.badge] : null,
            description: productForm.description.trim(),
            desc: productForm.description.trim()
          };
        }
        return p;
      }));
      addToast(`Đã cập nhật sản phẩm "${productForm.name}" thành công!`, 'success');
    } else {
      // Add new
      const newId = 'prod-' + Date.now();
      const slug = productForm.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');

      const newProduct = {
        id: newId,
        slug,
        name: productForm.name.trim(),
        category: productForm.category,
        categoryName: catObj ? catObj.name : 'Sản phẩm',
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
        stockQuantity: finalQty,
        image: finalImage,
        gallery: [finalImage],
        isOutOfStock,
        badge: isOutOfStock ? 'HẾT HÀNG' : (productForm.badge || null),
        badges: productForm.badge ? [productForm.badge] : null,
        description: productForm.description.trim() || 'Hương vị cà phê nguyên bản đặc trưng từ Cafena.',
        desc: productForm.description.trim(),
        rating: 5.0,
        reviewCount: 1
      };

      setProducts(prev => [newProduct, ...prev]);
      addToast(`Đã thêm sản phẩm "${productForm.name}" vào hệ thống!`, 'success');
    }

    setIsProductModalOpen(false);
  };

  // Toggle Out of Stock directly
  const handleToggleStock = (productId) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextState = !p.isOutOfStock;
        addToast(
          nextState 
            ? `Đã chuyển "${p.name}" sang trạng thái [Hết hàng]`
            : `Đã mở bán lại "${p.name}" [Còn hàng]`,
          nextState ? 'info' : 'success'
        );
        return { ...p, isOutOfStock: nextState };
      }
      return p;
    }));
  };

  // Delete product confirmation
  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;
    setProducts(prev => prev.filter(p => p.id !== deleteCandidate.id));
    addToast(`Đã xóa sản phẩm "${deleteCandidate.name}"`, 'info');
    setDeleteCandidate(null);
  };

  // Update order status
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    }));
    addToast(`Cập nhật đơn #${orderId} sang trạng thái mới!`, 'success');
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('cafena_store_settings', JSON.stringify(storeSettings));
    addToast('Đã lưu cấu hình cửa hàng thành công!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      
      {/* =========================================================================
          TOP NAVBAR: Brand, Global Search, Notifications, Return to Shop
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 sm:px-8 lg:px-10 h-22 sm:h-24 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-lg shadow-red-900/30 shrink-0">
              C
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-display font-black text-2xl sm:text-3xl tracking-tight text-slate-900">CAFENA</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-500/10 text-red-600 border border-red-500/25 uppercase tracking-wider">
                  ADMIN
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">Bảng Điều Khiển Quản Trị Hệ Thống</p>
            </div>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Active Theme Tag */}
          <div className="hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200">
            <span className="text-base">🔴</span>
            <div className="text-left">
              <span className="block text-xs font-black text-slate-900 leading-tight">Đỏ Thương Hiệu</span>
              <span className="block text-[10px] text-red-600 font-extrabold uppercase tracking-wide">Signature Cafena Red</span>
            </div>
          </div>

          {/* Quick Button "+ Thêm Sản Phẩm Mới" */}
          <button
            onClick={handleOpenAddModal}
            className="hidden sm:inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-red-900/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Thêm Món Mới</span>
          </button>

          {/* Return to Storefront CTA */}
          <button
            onClick={() => navigateTo && navigateTo('home')}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-sm sm:text-base transition-all hover:border-slate-400 cursor-pointer group"
            title="Quay lại giao diện người dùng"
          >
            <Store className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">Xem Cửa Hàng</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Admin profile preview */}
          <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-200">
            <div className="relative">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-100 border-2 border-emerald-500 flex items-center justify-center font-black text-slate-900 text-base">
                AD
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1E293B] animate-pulse"></span>
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-sm font-black text-slate-900 leading-tight">Admin Quản Trị</p>
              <p className="text-xs text-emerald-600 font-bold">Đang trực tuyến</p>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN WRAPPER: Sidebar & Tab Content
          ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-72 sm:w-80 bg-white border-r border-slate-200 shadow-xs p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Navigation Links */}
          <div className="space-y-6">
            <div className="px-3 pt-2">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                CHỨC NĂNG HỆ THỐNG
              </p>
            </div>

            <nav className="space-y-1.5">
              {[
                { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard, badge: 'Live' },
                { id: 'revenue', label: 'Báo Cáo Doanh Thu', icon: TrendingUp, badge: 'Mới' },
                { id: 'products', label: 'Quản Lý Sản Phẩm', icon: Coffee, count: products.length },
                { id: 'orders', label: 'Quản Lý Đơn Hàng', icon: ShoppingBag, count: orders.filter(o => o.status === 'pending').length, alert: true },
                { id: 'customers', label: 'Khách Hàng', icon: Users, count: 89 },
                { id: 'reviews', label: 'Đánh Giá & Phản Hồi', icon: Star, count: 24 },
                { id: 'settings', label: 'Cấu Hình Quán', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 sm:py-4 rounded-2xl font-bold text-base transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-950/20 translate-x-1'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/90'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon className={`w-5.5 h-5.5 sm:w-6 sm:h-6 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span className="leading-snug">{tab.label}</span>
                    </div>
                    

                    {tab.badge && (
                      <span className={`px-2 py-0.5 text-xs rounded-full font-black uppercase tracking-wider px-2.5 py-0.5 ${
                        isActive
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'bg-red-500/10 text-red-600 border border-red-500/20'
                      }`}>
                        {tab.badge}
                      </span>
                    )}

                    {tab.count !== undefined && (
                      <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : tab.alert && tab.count > 0
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-slate-100 text-slate-500'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer info */}
          <div className="pt-4 border-t border-slate-200/90 space-y-3">
            <div className="p-3 rounded-xl bg-slate-100/50 border border-slate-200/50">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Trạng thái máy chủ:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Hoạt động
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[94%]"></div>
              </div>
              <p className="text-[10px] text-[#9E816B] mt-1.5">Vite 6 + React 18 Production</p>
            </div>

            <button
              onClick={() => navigateTo && navigateTo('home')}
              className="w-full py-2.5 px-3 rounded-xl text-center text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>← Trở lại Trang Bán Hàng</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-20 lg:hidden"
          />
        )}

        {/* Right Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          
          {/* =========================================================================
              TAB 1: TỔNG QUAN (DASHBOARD)
              ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 sm:space-y-8 animate-smoothFadeIn">
              
              {/* Top Greeting & Fast Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-red-600 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>HỆ THỐNG CAFENA COFFEE HOẠT ĐỘNG ỔN ĐỊNH</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Chào buổi sáng, Quản Trị Viên! 👋
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Dưới đây là tình hình kinh doanh và tiến độ xử lý đơn hàng hôm nay.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab('revenue')}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-900/30 transition flex items-center gap-2 cursor-pointer"
                  >
                    <TrendingUp className="w-4 h-4 text-white" />
                    <span>Báo Cáo Doanh Thu</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm border border-slate-300 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Coffee className="w-4 h-4 text-orange-400" />
                    <span>Kho Sản Phẩm</span>
                  </button>
                  <button
                    onClick={handleOpenAddModal}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-900/30 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Món</span>
                  </button>
                </div>
              </div>

              {/* 4 Animated Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                
                {/* Metric 1: Revenue */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-lg hover:border-amber-500/40 transition-all transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng Doanh Thu</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {formatVND(stats.totalRevenue)}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +18.4%
                      </span>
                      <span className="text-xs text-slate-500">so với tuần trước</span>
                    </div>
                  </div>
                </div>

                {/* Metric 2: Orders */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-lg hover:border-amber-500/40 transition-all transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng Đơn Hàng</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {stats.totalOrders} đơn
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                        {stats.pendingOrders} đơn chờ duyệt
                      </span>
                      <span className="text-xs text-slate-500">Tỉ lệ đạt 96%</span>
                    </div>
                  </div>
                </div>

                {/* Metric 3: Active Products */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-lg hover:border-amber-500/40 transition-all transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sản Phẩm Đang Bán</span>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                      <Coffee className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {stats.totalProducts} món
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      {stats.outOfStockCount > 0 ? (
                        <span className="inline-flex items-center text-xs font-bold text-red-400 bg-red-500/15 border border-red-500/30 px-2 py-0.5 rounded-md animate-pulse">
                          {stats.outOfStockCount} món hết hàng
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md">
                          100% còn hàng
                        </span>
                      )}
                      <span className="text-xs text-slate-500">({stats.totalInventoryUnits} sp kho)</span>
                    </div>
                  </div>
                </div>

                {/* Metric 4: Satisfied Customers */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-lg hover:border-amber-500/40 transition-all transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Khách Hàng & Đánh Giá</span>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      4.9 / 5.0 ★
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                        +124 đánh giá
                      </span>
                      <span className="text-xs text-slate-500">Hài lòng tuyệt đối</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Middle Section: Interactive Revenue Area Chart & Category Share */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 7-Day Revenue Interactive SVG Chart (8 cols) */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">Biểu Đồ Doanh Thu 7 Ngày Gần Nhất</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Tăng trưởng ổn định theo giờ vàng quán cà phê</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-gradient-to-r from-red-600 to-rose-600"></span>
                      <span className="text-xs text-slate-600 font-semibold">Doanh số (VNĐ)</span>
                    </div>
                  </div>

                  {/* SVG Chart Graphic */}
                  <div className="h-64 w-full relative">
                    <svg viewBox="0 0 700 240" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#E51E25" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#E51E25" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      <line x1="40" y1="40" x2="680" y2="40" stroke="#334155" strokeDasharray="4 4" />
                      <line x1="40" y1="100" x2="680" y2="100" stroke="#334155" strokeDasharray="4 4" />
                      <line x1="40" y1="160" x2="680" y2="160" stroke="#334155" strokeDasharray="4 4" />
                      <line x1="40" y1="210" x2="680" y2="210" stroke="#475569" />

                      {/* Area Fill */}
                      <path
                        d="M 60,180 Q 150,150 240,110 T 420,70 T 510,130 T 600,45 L 660,65 L 660,210 L 60,210 Z"
                        fill="url(#revenueGrad)"
                      />

                      {/* Glowing Line */}
                      <path
                        d="M 60,180 Q 150,150 240,110 T 420,70 T 510,130 T 600,45 L 660,65"
                        fill="none"
                        stroke="#E51E25"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Interactive Data Points */}
                      {[
                        { x: 60, y: 180, label: 'T2', val: '1.250k' },
                        { x: 160, y: 145, label: 'T3', val: '2.100k' },
                        { x: 260, y: 105, label: 'T4', val: '3.400k' },
                        { x: 360, y: 80, label: 'T5', val: '4.200k' },
                        { x: 460, y: 125, label: 'T6', val: '2.800k' },
                        { x: 560, y: 50, label: 'T7', val: '5.900k' },
                        { x: 660, y: 65, label: 'CN', val: '4.800k' }
                      ].map((pt, i) => (
                        <g key={i} className="group/pt cursor-pointer">
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="6"
                            className="fill-white stroke-[#E51E25] stroke-[3] group-hover/pt:r-8 transition-all"
                          />
                          {/* Tooltip on hover */}
                          <text
                            x={pt.x}
                            y={pt.y - 12}
                            textAnchor="middle"
                            className="fill-white text-[11px] font-bold opacity-0 group-hover/pt:opacity-100 transition-opacity pointer-events-none"
                          >
                            {pt.val}
                          </text>
                          {/* Day label */}
                          <text
                            x={pt.x}
                            y="230"
                            textAnchor="middle"
                            className="fill-slate-400 text-xs font-semibold"
                          >
                            {pt.label}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>

                {/* Category Share & Best Sellers (4 cols) */}
                <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Cơ Cấu Doanh Số Danh Mục</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Tỉ lệ đóng góp vào tổng đơn hàng</p>

                    <div className="mt-6 space-y-4">
                      {[
                        { name: 'Cà phê đóng gói túi lọc', percent: 42, color: 'bg-gradient-to-r from-red-600 to-rose-600', count: '60 đơn' },
                        { name: 'Máy xay cafe cầm tay', percent: 28, color: 'bg-amber-500', count: '45 đơn' },
                        { name: 'Dụng cụ pha cà phê', percent: 18, color: 'bg-blue-500', count: '22 đơn' },
                        { name: 'Phụ kiện pha chế', percent: 12, color: 'bg-purple-500', count: '15 đơn' }
                      ].map((cat, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">{cat.name}</span>
                            <span className="font-bold text-slate-500">{cat.percent}% ({cat.count})</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`${cat.color} h-full rounded-full transition-all duration-500`}
                              style={{ width: `${cat.percent}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-slate-100/80 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Món bán chạy nhất tuần:</p>
                      <p className="font-black text-slate-900 text-sm">Cafe Muối & Bialetti Brikka</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                      Hot Trend 🔥
                    </span>
                  </div>
                </div>

              </div>

              {/* Bottom Section: Recent Orders & Stock Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Orders (8 cols) */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-base text-slate-900">Đơn Hàng Vừa Tiếp Nhận</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-[#F59E0B] hover:underline cursor-pointer"
                    >
                      Xem tất cả ({orders.length}) →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm sm:text-base">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                          <th className="pb-3">Mã đơn</th>
                          <th className="pb-3">Khách hàng</th>
                          <th className="pb-3">Tổng tiền</th>
                          <th className="pb-3">Trạng thái</th>
                          <th className="pb-3 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {orders.slice(0, 4).map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 font-mono font-bold text-slate-800">
                              #{order.code}
                            </td>
                            <td className="py-3 font-semibold text-slate-900">
                              {order.customerName}
                              <p className="text-[11px] text-slate-500 font-normal">{order.phone}</p>
                            </td>
                            <td className="py-3 font-bold text-[#F59E0B]">
                              {formatVND(order.finalTotal)}
                            </td>
                            <td className="py-3">
                              {order.status === 'completed' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  <CheckCircle2 className="w-3 h-3" /> Đã giao
                                </span>
                              )}
                              {order.status === 'shipping' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  <Truck className="w-3 h-3" /> Đang giao
                                </span>
                              )}
                              {order.status === 'pending' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  <Clock className="w-3 h-3" /> Chờ duyệt
                                </span>
                              )}
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => setSelectedOrderDetails(order)}
                                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition cursor-pointer"
                              >
                                Chi tiết
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Stock Watch / Cảnh Báo Kho (4 cols) */}
                <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-base text-slate-900">Theo Dõi Tồn Kho</h3>
                    <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                      Cần chú ý
                    </span>
                  </div>

                  <div className="space-y-3">
                    {products.filter(p => p.isOutOfStock || (p.stockQuantity !== undefined && Number(p.stockQuantity) <= 0)).slice(0, 4).map((p) => (
                      <div key={p.id} className="p-3 rounded-xl bg-slate-100/70 border border-red-500/35 flex items-center justify-between gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-white/5 p-1" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-slate-900 truncate">{p.name}</p>
                          <span className="text-[10px] font-black text-red-400 bg-red-500/15 border border-red-500/30 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            🔴 HẾT HÀNG (0 sp)
                          </span>
                        </div>
                        <button
                          onClick={() => handleUpdateStockQuantity(p.id, 25)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition cursor-pointer shrink-0 shadow-sm"
                          title="Nhập thêm 25 sản phẩm vào kho"
                        >
                          + Nhập 25
                        </button>
                      </div>
                    ))}

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-slate-500 shrink-0" />
                      <span>Các mặt hàng máy xay cầm tay Timemore S3 và K-Plus đang có lượng tìm kiếm cao.</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* =========================================================================
              TAB: BÁO CÁO DOANH THU (REVENUE REPORT: THÁNG / TUẦN / NGÀY & IN HÓA ĐƠN)
              ========================================================================= */}
          {activeTab === 'revenue' && (
            <RevenueReport orders={orders} />
          )}

          {/* =========================================================================
              TAB 2: QUẢN LÝ SẢN PHẨM (PRODUCTS MANAGEMENT)
              ========================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-smoothFadeIn">
              
              {/* Top Controls: Title, Filter Pills, Search Bar, CTA Add */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xl space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Danh Mục Sản Phẩm Cafena</h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                      Đang quản lý <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> / {products.length} sản phẩm trong thực đơn
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* View Switcher: Table / Grid */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => setViewMode('table')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${
                          viewMode === 'table' ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Bảng
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          viewMode === 'grid' ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Lưới Card
                      </button>
                    </div>

                    <button
                      onClick={handleOpenAddModal}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm sm:text-base shadow-lg shadow-red-900/30 flex items-center gap-2 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Thêm Món Mới</span>
                    </button>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
                  
                  {/* Search Input */}
                  <div className="md:col-span-5 relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên sản phẩm, mã SKU..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-slate-100/90 border border-slate-200 rounded-xl pl-10 pr-8 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#E51E25] transition"
                    />
                    {productSearch && (
                      <button
                        onClick={() => setProductSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="md:col-span-4">
                    <select
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="w-full bg-slate-100/90 border border-slate-200 rounded-xl px-4 py-2.5 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:border-red-500 transition cursor-pointer"
                    >
                      <option value="all">Tất cả danh mục (5 nhóm)</option>
                      {CATEGORY_OPTIONS.map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Stock Filter */}
                  <div className="md:col-span-3">
                    <select
                      value={productStockFilter}
                      onChange={(e) => setProductStockFilter(e.target.value)}
                      className="w-full bg-slate-100/90 border border-slate-200 rounded-xl px-4 py-2.5 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:border-red-500 transition cursor-pointer"
                    >
                      <option value="all">Tất cả kho ({products.length} món)</option>
                      <option value="in_stock">🟢 Còn hàng (&gt; 5 sp)</option>
                      <option value="low_stock">⚠️ Sắp hết hàng (1 - 5 sp)</option>
                      <option value="out_of_stock">🔴 Hết hàng (0 sp)</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* View 1: Table Mode */}
              {viewMode === 'table' && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-black uppercase tracking-wider text-xs sm:text-sm">
                          <th className="py-4 px-3">Ảnh & Sản Phẩm</th>
                          <th className="py-4 px-3">Danh Mục</th>
                          <th className="py-4 px-3">Giá Bán</th>
                          <th className="py-4 px-3 text-center">Số Lượng Trong Kho</th>
                          <th className="py-4 px-3">Trạng Thái Kho</th>
                          <th className="py-4 px-3">Đánh Giá</th>
                          <th className="py-4 px-3 text-right">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-100/50 transition">
                              
                              {/* Product Info */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1 group">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                                      loading="lazy"
                                    />
                                  </div>
                                  <div className="min-w-0 max-w-[240px]">
                                    <h4 className="font-bold text-base sm:text-lg text-slate-900 hover:text-red-600 transition truncate">
                                      {product.name}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-slate-500 font-mono font-medium truncate mt-0.5">
                                      SKU: {product.id}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Category */}
                              <td className="py-3.5 px-4">
                                <span className="inline-block px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                  {product.categoryName || product.category}
                                </span>
                              </td>

                              {/* Price */}
                              <td className="py-3.5 px-3 font-bold whitespace-nowrap">
                                <span className="text-red-600 text-base sm:text-lg font-black">
                                  {formatVND(product.price)}
                                </span>
                                {product.originalPrice && (
                                  <span className="block text-[#9E816B] line-through text-[11px] font-normal">
                                    {formatVND(product.originalPrice)}
                                  </span>
                                )}
                              </td>

                              {/* Stock Quantity with Quick +/- and Direct Input */}
                              <td className="py-3.5 px-3">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleAdjustStock(product.id, -1)}
                                    disabled={(product.stockQuantity !== undefined ? product.stockQuantity : (product.isOutOfStock ? 0 : 25)) <= 0}
                                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-900 font-black text-lg flex items-center justify-center transition border border-slate-300 cursor-pointer shadow-xs"
                                    title="Giảm 1 sản phẩm"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    min="0"
                                    value={product.stockQuantity !== undefined ? product.stockQuantity : (product.isOutOfStock ? 0 : 25)}
                                    onChange={(e) => handleUpdateStockQuantity(product.id, e.target.value)}
                                    className={`w-16 text-center py-1.5 rounded-xl text-sm sm:text-base font-black border focus:outline-none transition shadow-xs ${
                                      (product.stockQuantity !== undefined ? product.stockQuantity : (product.isOutOfStock ? 0 : 25)) <= 0
                                        ? 'bg-red-500/10 border-red-500/40 text-red-400 font-black'
                                        : (product.stockQuantity !== undefined ? product.stockQuantity : 25) <= 5
                                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                                          : 'bg-white border-slate-300 text-slate-900 focus:border-red-500'
                                    }`}
                                    title="Nhập số lượng sản phẩm"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleAdjustStock(product.id, 1)}
                                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-lg flex items-center justify-center transition border border-slate-300 cursor-pointer shadow-xs"
                                    title="Tăng 1 sản phẩm"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>

                              {/* Stock Status Badge & 1-Click Action */}
                              <td className="py-3.5 px-3 whitespace-nowrap">
                                {product.isOutOfStock || (product.stockQuantity !== undefined && product.stockQuantity <= 0) ? (
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-black bg-red-600 text-white shadow-md shadow-red-950/40 animate-pulse">
                                      <span className="w-2 h-2 rounded-full bg-white"></span>
                                      HẾT HÀNG
                                    </span>
                                    <button
                                      onClick={() => handleUpdateStockQuantity(product.id, 25)}
                                      className="text-xs sm:text-sm text-red-600 hover:underline font-black cursor-pointer"
                                      title="Nhập thêm 25 sản phẩm vào kho"
                                    >
                                      +Nhập 25
                                    </button>
                                  </div>
                                ) : (product.stockQuantity !== undefined && product.stockQuantity <= 5) ? (
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold bg-amber-500/20 text-amber-700 border border-amber-500/40">
                                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                      Sắp hết ({product.stockQuantity})
                                    </span>
                                    <button
                                      onClick={() => handleToggleStock(product.id)}
                                      className="text-xs text-red-600 hover:underline font-bold cursor-pointer"
                                      title="Đánh dấu hết hàng"
                                    >
                                      Báo hết
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                      Còn hàng ({product.stockQuantity !== undefined ? product.stockQuantity : 25} sp)
                                    </span>
                                    <button
                                      onClick={() => handleToggleStock(product.id)}
                                      className="text-xs text-red-600 hover:underline font-bold cursor-pointer"
                                      title="Đánh dấu hết hàng"
                                    >
                                      Báo hết
                                    </button>
                                  </div>
                                )}
                              </td>

                              {/* Rating */}
                              <td className="py-3.5 px-4 text-amber-500 font-black text-sm sm:text-base">
                                ★ {product.rating || '5.0'}
                                <span className="text-slate-400 font-medium text-xs ml-1">
                                  ({product.reviewCount || 10})
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    onClick={() => handleOpenEditModal(product)}
                                    className="p-2 rounded-lg bg-slate-100 hover:bg-gradient-to-r from-red-600 to-rose-600 hover:text-white text-slate-600 transition cursor-pointer"
                                    title="Chỉnh sửa sản phẩm"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteCandidate(product)}
                                    className="p-2 rounded-lg bg-slate-100 hover:bg-red-600 hover:text-white text-slate-500 transition cursor-pointer"
                                    title="Xóa món"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-500">
                              Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* View 2: Grid Cards Mode */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-lg flex flex-col justify-between hover:border-slate-300 transition group"
                    >
                      <div className="relative aspect-square bg-slate-50 p-6 flex items-center justify-center overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.isOutOfStock || (product.stockQuantity !== undefined && product.stockQuantity <= 0) ? (
                          <span className="absolute top-3 right-3 px-2.5 py-1 bg-red-600 text-white font-black text-xs rounded shadow-lg shadow-red-950/50 animate-pulse">
                            HẾT HÀNG
                          </span>
                        ) : (product.stockQuantity !== undefined && product.stockQuantity <= 5) ? (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500 text-black font-extrabold text-[10px] rounded shadow">
                            SẮP HẾT ({product.stockQuantity})
                          </span>
                        ) : product.badge ? (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-[10px] rounded">
                            {product.badge}
                          </span>
                        ) : null}
                      </div>

                      {/* Stock Adjuster Bar in Grid Card */}
                      <div className="mx-4 mt-2 p-2 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-slate-500 text-[11px] font-semibold">Tồn kho:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleAdjustStock(product.id, -1)}
                            disabled={(product.stockQuantity !== undefined ? product.stockQuantity : (product.isOutOfStock ? 0 : 25)) <= 0}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 text-xs font-black flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <span className={`text-xs font-bold px-1 ${
                            product.isOutOfStock || (product.stockQuantity !== undefined && product.stockQuantity <= 0)
                              ? 'text-red-400 font-black'
                              : 'text-slate-800'
                          }`}>
                            {product.isOutOfStock || (product.stockQuantity !== undefined && product.stockQuantity <= 0)
                              ? '0 (Hết hàng)'
                              : `${product.stockQuantity !== undefined ? product.stockQuantity : 25} sp`}
                          </span>
                          <button
                            onClick={() => handleAdjustStock(product.id, 1)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            {product.categoryName}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-2">
                            {product.name}
                          </h4>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-base text-[#F59E0B]">
                              {formatVND(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-[#9E816B] line-through text-xs block font-normal">
                                {formatVND(product.originalPrice)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-gradient-to-r from-[#D97706] to-[#B45309] text-slate-600 hover:text-white transition cursor-pointer"
                              title="Sửa"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteCandidate(product)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-red-600 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                              title="Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* =========================================================================
              TAB 3: QUẢN LÝ ĐƠN HÀNG (ORDERS MANAGEMENT)
              ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-smoothFadeIn">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Quản Lý Đơn Hàng Khách Đặt</h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                      Theo dõi tiến độ chế biến và giao nhận cho từng khách hàng
                    </p>
                  </div>
                </div>

                {/* Status tabs & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {[
                      { id: 'all', label: 'Tất cả đơn', count: orders.length },
                      { id: 'pending', label: 'Chờ duyệt', count: orders.filter(o => o.status === 'pending').length },
                      { id: 'shipping', label: 'Đang giao', count: orders.filter(o => o.status === 'shipping').length },
                      { id: 'completed', label: 'Đã giao xong', count: orders.filter(o => o.status === 'completed').length },
                      { id: 'cancelled', label: 'Đã hủy', count: orders.filter(o => o.status === 'cancelled').length }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setOrderStatusFilter(tab.id)}
                        className={`px-4 py-2.5 rounded-xl text-sm sm:text-base font-bold whitespace-nowrap transition cursor-pointer ${
                          orderStatusFilter === tab.id
                            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        {tab.label} ({tab.count})
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-80">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Tìm theo mã đơn, tên, sđt..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Orders List Cards */}
              <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-lg hover:border-slate-300 transition space-y-4"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-lg sm:text-xl text-slate-900">
                            #{order.code}
                          </span>
                          <span className="text-xs sm:text-sm text-slate-500 font-medium">
                            {new Date(order.createdAt).toLocaleString('vi-VN')}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wide">
                            {order.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản'}
                          </span>
                        </div>

                        {/* Status dropdown & Print Invoice button */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenInvoice(order)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow flex items-center gap-2 transition cursor-pointer"
                            title="In hóa đơn bán hàng cho đơn này"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>In Hóa Đơn</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-slate-600">Trạng thái:</span>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm focus:outline-none cursor-pointer border ${
                                order.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-700 border-emerald-500/40'
                                  : order.status === 'shipping'
                                    ? 'bg-blue-500/20 text-blue-700 border-blue-500/40'
                                    : order.status === 'cancelled'
                                      ? 'bg-red-500/20 text-red-700 border-red-500/40'
                                      : 'bg-amber-500/20 text-amber-800 border-amber-500/40'
                              }`}
                            >
                              <option value="pending" className="bg-slate-100 text-slate-800">🕒 Chờ duyệt & Pha chế</option>
                              <option value="shipping" className="bg-slate-100 text-slate-800">🚚 Đang giao hàng</option>
                              <option value="completed" className="bg-slate-100 text-slate-800">✅ Hoàn thành đơn</option>
                              <option value="cancelled" className="bg-slate-100 text-slate-800">❌ Hủy đơn hàng</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Customer Details & Items grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* Customer Info (5 cols) */}
                        <div className="lg:col-span-5 space-y-2 text-sm">
                          <p className="font-bold text-slate-600">
                            Người nhận: <span className="text-slate-900 font-black text-base sm:text-lg ml-1">{order.customerName}</span>
                          </p>
                          <p className="text-slate-600 font-medium">
                            Số điện thoại: <span className="text-slate-900 font-mono font-bold text-sm sm:text-base ml-1">{order.phone}</span>
                          </p>
                          <p className="text-slate-600 font-medium">
                            Địa chỉ giao: <span className="text-slate-800 font-semibold ml-1">{order.address}</span>
                          </p>
                          {order.note && (
                            <p className="text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-xl mt-2 font-medium text-xs sm:text-sm">
                              💡 <strong>Ghi chú:</strong> {order.note}
                            </p>
                          )}
                        </div>

                        {/* Items in order (7 cols) */}
                        <div className="lg:col-span-7 space-y-2">
                          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 shrink-0 p-1" />
                                  <span className="font-bold text-slate-900 text-sm sm:text-base truncate block">{item.name}</span>
                                  {item.size && (
                                    <span className="text-xs text-slate-500 font-medium">Size: {item.size}</span>
                                  )}
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="text-slate-500 font-mono font-bold text-sm">x{item.quantity}</span>
                                  <span className="font-bold text-slate-900 ml-3 text-sm sm:text-base">{formatVND(item.price * item.quantity)}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Total row */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-600 font-bold text-sm sm:text-base">Tổng thanh toán:</span>
                              <span className="text-xl sm:text-2xl font-mono font-black text-red-600">
                                {formatVND(order.finalTotal)}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenInvoice(order)}
                              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-600 border border-emerald-500/30 font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer"
                            >
                              <Printer className="w-3 h-3" />
                              <span>In Phiếu K80 / A4</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 text-slate-500">
                    Không tìm thấy đơn hàng nào phù hợp với bộ lọc hiện tại.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 4: KHÁCH HÀNG (CUSTOMERS)
              ========================================================================= */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-smoothFadeIn">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xl">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Khách Hàng & Thành Viên Coffeena Club</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  Quản lý danh sách khách hàng thân thiết, điểm tích lũy và lịch sử mua sắm
                </p>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-left text-sm sm:text-base">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-700 uppercase font-black text-xs sm:text-sm bg-slate-50">
                        <th className="pb-3 px-3">Khách hàng</th>
                        <th className="pb-3 px-3">Hạng thành viên</th>
                        <th className="pb-3 px-3">Tổng đơn</th>
                        <th className="pb-3 px-3">Tổng chi tiêu</th>
                        <th className="pb-3 px-3">Ngày tham gia</th>
                        <th className="pb-3 px-3 text-right">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {[
                        { name: 'Trần Minh Hoàng', email: 'hoang.tran@gmail.com', phone: '0908 123 456', tier: 'Kim Cương 💎', orders: 18, spent: 8450000, date: '15/01/2026' },
                        { name: 'Lê Thuỳ Linh', email: 'thuylinh.le@gmail.com', phone: '0938 987 654', tier: 'Vàng 🥇', orders: 9, spent: 5200000, date: '02/03/2026' },
                        { name: 'Nguyễn Văn Đức', email: 'duc.nguyen@yahoo.com', phone: '0912 345 678', tier: 'Bạc 🥈', orders: 4, spent: 1150000, date: '18/04/2026' },
                        { name: 'Phạm Hải Đăng', email: 'haidang.pham@outlook.com', phone: '0977 444 888', tier: 'Vàng 🥇', orders: 7, spent: 3900000, date: '20/02/2026' },
                        { name: 'Vũ Ngọc Bích', email: 'ngocbich.vu@gmail.com', phone: '0988 555 222', tier: 'Đồng 🥉', orders: 2, spent: 480000, date: '28/04/2026' }
                      ].map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition">
                          <td className="py-4 px-3">
                            <div className="font-black text-base sm:text-lg text-slate-900">{c.name}</div>
                            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">{c.email} • <span className="font-mono font-bold text-slate-700">{c.phone}</span></div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-black text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg text-xs sm:text-sm border border-amber-300">
                              {c.tier}
                            </span>
                          </td>
                          <td className="py-4 px-3 font-mono font-black text-sm sm:text-base text-slate-800">
                            {c.orders} đơn
                          </td>
                          <td className="py-4 px-3 font-mono font-black text-base sm:text-lg text-red-600">
                            {formatVND(c.spent)}
                          </td>
                          <td className="py-4 px-3 font-medium text-xs sm:text-sm text-slate-600">
                            {c.date}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-700 border border-emerald-300">
                              Hoạt động
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: ĐÁNH GIÁ & PHẢN HỒI (REVIEWS)
              ========================================================================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-smoothFadeIn">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xl">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Đánh Giá Từ Khách Hàng</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  Duyệt và phản hồi các bình luận thực tế của khách hàng về sản phẩm
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    { author: 'Trần Minh Hoàng', product: 'Bialetti Brikka cảm ứng 4 cốc', stars: 5, date: '2 giờ trước', comment: 'Ấm pha rất tiện, van tăng áp giúp lớp crema dày và thơm ngậy đúng chuẩn cafe Ý!' },
                    { author: 'Lê Thuỳ Linh', product: 'Cafe muối', stars: 5, date: 'Hôm qua', comment: 'Vị cafe muối béo béo mặn mặn cực kỳ cuốn, đá tan vẫn không bị nhạt, ủng hộ quán dài lâu!' },
                    { author: 'Nguyễn Văn Đức', product: 'Timemore C3 ESP PRO', stars: 4, date: '2 ngày trước', comment: 'Cối xay kim loại cầm đầm tay, xay mịn cho espresso rất đều.' }
                  ].map((rev, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-black text-base sm:text-lg text-slate-900">{rev.author}</span>
                          <span className="text-xs sm:text-sm text-slate-500 ml-2">đánh giá cho <strong className="text-slate-900 font-bold">{rev.product}</strong></span>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-slate-500">{rev.date}</span>
                      </div>
                      <div className="text-amber-500 text-sm sm:text-base font-black tracking-wider">
                        {'★'.repeat(rev.stars)} ({rev.stars}.0)
                      </div>
                      <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed">
                        "{rev.comment}"
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-xs">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs border border-emerald-300">
                          ✓ Đã kiểm duyệt
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 6: CẤU HÌNH QUÁN (SETTINGS)
              ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-smoothFadeIn">
              <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Cấu Hình Thông Tin Quán & Vận Chuyển</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tùy chỉnh thông tin liên hệ, hotline, phí giao hàng và thông báo hiển thị trên toàn website
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Tên Thương Hiệu Cửa Hàng
                    </label>
                    <input
                      type="text"
                      value={storeSettings.storeName}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#E51E25]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Hotline Đặt Hàng & Hỗ Trợ
                    </label>
                    <input
                      type="text"
                      value={storeSettings.hotline}
                      onChange={(e) => setStoreSettings({ ...storeSettings, hotline: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#E51E25]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Email Liên Hệ
                    </label>
                    <input
                      type="email"
                      value={storeSettings.email}
                      onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#E51E25]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Giờ Mở Cửa Phục Vụ
                    </label>
                    <input
                      type="text"
                      value={storeSettings.openingHours}
                      onChange={(e) => setStoreSettings({ ...storeSettings, openingHours: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#E51E25]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Địa Chỉ Quán
                    </label>
                    <input
                      type="text"
                      value={storeSettings.address}
                      onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#E51E25]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Phí Giao Hàng Chuẩn (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={storeSettings.standardShippingFee}
                      onChange={(e) => setStoreSettings({ ...storeSettings, standardShippingFee: Number(e.target.value) })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#E51E25]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Ngưỡng Miễn Phí Vận Chuyển (Freeship)
                    </label>
                    <input
                      type="number"
                      value={storeSettings.freeShippingThreshold}
                      onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#E51E25]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Thanh Thông Báo Chạy Chữ Đầu Trang
                    </label>
                    <input
                      type="text"
                      value={storeSettings.announcementBar}
                      onChange={(e) => setStoreSettings({ ...storeSettings, announcementBar: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#E51E25]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-900/30 transition cursor-pointer"
                  >
                    Lưu Toàn Bộ Cấu Hình
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* =========================================================================
          🌟 THE BEAUTIFUL ANIMATED MODAL & FORM: ADD / EDIT PRODUCT
          (Thiết kế chuẩn form chuyên nghiệp với Live Real-time Card Preview)
          ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 p-4 sm:p-6 flex items-center justify-center overflow-hidden animate-fadeIn">
          {/* Glassy Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setIsProductModalOpen(false)}
          />

          {/* Sizing: max-w-4xl for comfortable layout, max-h-[90vh] with flex-col so it never overflows */}
          <div className="relative bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl z-10 text-slate-800 animate-popIn overflow-hidden">
            
            {/* Modal Header: Fixed at top, larger and clearer */}
            <div className="shrink-0 px-6 sm:px-8 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-600 border border-red-500/25 flex items-center justify-center shrink-0">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                    {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Món Mới'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    {editingProduct ? `Mã SKU: #${editingProduct.id}` : 'Nhập thông tin sản phẩm và xem trước thẻ hiển thị thực tế'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-xl bg-white hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
                title="Đóng cửa sổ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Scrollable internal content with larger, clear fonts */}
            <form id="product-modal-form" onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-5 sm:p-7">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                
                {/* LEFT: FORM INPUTS (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-black text-slate-900 uppercase tracking-wide mb-1.5">
                      Tên Sản Phẩm *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Cafe Muối Thượng Hạng, Cối Xay S3..."
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-black text-slate-900 uppercase tracking-wide mb-1.5">
                      Danh Mục Sản Phẩm
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORY_OPTIONS.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setProductForm({ ...productForm, category: cat.id })}
                          className={`px-3.5 py-2.5 rounded-xl border text-left text-sm font-extrabold flex items-center gap-2.5 transition cursor-pointer ${
                            productForm.category === cat.id
                              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-600 shadow-md shadow-red-900/25'
                              : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-lg">{cat.icon}</span>
                          <span className="truncate">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price & Original Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black text-slate-900 uppercase tracking-wide mb-1.5">
                        Giá Bán Thực Tế (VNĐ) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="25000"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-base text-red-600 font-black focus:outline-none focus:border-red-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-slate-900 uppercase tracking-wide mb-1.5">
                        Giá Gốc Niêm Yết
                      </label>
                      <input
                        type="number"
                        placeholder="30000"
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-base font-semibold text-slate-700 focus:outline-none focus:border-red-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Stock Quantity Control & Stock Presets */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-red-600" />
                        <span>Số Lượng Tồn Kho Thực Tế *</span>
                      </label>
                      <span className={`text-xs font-black px-3 py-1 rounded-full ${
                        Number(productForm.stockQuantity) <= 0 
                          ? 'bg-red-500/20 text-red-600 border border-red-500/30' 
                          : Number(productForm.stockQuantity) <= 5
                            ? 'bg-amber-500/20 text-amber-700 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                      }`}>
                        {Number(productForm.stockQuantity) <= 0 ? '🔴 HẾT HÀNG' : `🟢 Còn ${productForm.stockQuantity} sp`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          const newQ = Math.max(0, (Number(productForm.stockQuantity) || 0) - 1);
                          setProductForm({ 
                            ...productForm, 
                            stockQuantity: newQ,
                            isOutOfStock: newQ <= 0,
                            badge: newQ <= 0 ? 'HẾT HÀNG' : (productForm.badge === 'HẾT HÀNG' ? '' : productForm.badge)
                          });
                        }}
                        className="w-10 h-10 rounded-xl bg-white hover:bg-slate-200 text-slate-900 font-black text-xl flex items-center justify-center transition border border-slate-300 cursor-pointer shadow-xs"
                        title="Giảm 1 sản phẩm"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        required
                        value={productForm.stockQuantity}
                        onChange={(e) => {
                          const val = e.target.value;
                          const num = parseInt(val, 10);
                          const isZero = val === '' || num <= 0;
                          setProductForm({ 
                            ...productForm, 
                            stockQuantity: val,
                            isOutOfStock: isZero,
                            badge: isZero ? 'HẾT HÀNG' : (productForm.badge === 'HẾT HÀNG' ? '' : productForm.badge)
                          });
                        }}
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2 text-base text-center text-slate-900 font-black focus:outline-none focus:border-red-500 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newQ = (Number(productForm.stockQuantity) || 0) + 1;
                          setProductForm({ 
                            ...productForm, 
                            stockQuantity: newQ,
                            isOutOfStock: false,
                            badge: productForm.badge === 'HẾT HÀNG' ? '' : productForm.badge
                          });
                        }}
                        className="w-10 h-10 rounded-xl bg-white hover:bg-slate-200 text-slate-900 font-black text-xl flex items-center justify-center transition border border-slate-300 cursor-pointer shadow-xs"
                        title="Tăng 1 sản phẩm"
                      >
                        +
                      </button>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="text-xs text-slate-600 font-bold">Đặt nhanh số lượng:</span>
                      {[
                        { label: '0 (Báo Hết)', val: 0, alert: true },
                        { label: '+10', val: 10 },
                        { label: '+25', val: 25 },
                        { label: '+50', val: 50 }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (preset.val === 0) {
                              setProductForm({ 
                                ...productForm, 
                                stockQuantity: 0, 
                                isOutOfStock: true, 
                                badge: 'HẾT HÀNG' 
                              });
                            } else {
                              const cur = Number(productForm.stockQuantity) || 0;
                              const newQ = cur + preset.val;
                              setProductForm({ 
                                ...productForm, 
                                stockQuantity: newQ, 
                                isOutOfStock: false,
                                badge: productForm.badge === 'HẾT HÀNG' ? '' : productForm.badge
                              });
                            }
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                            preset.alert
                              ? 'bg-red-500/20 text-red-600 border border-red-500/30 hover:bg-red-500/30'
                              : 'bg-white text-slate-700 border border-slate-300 hover:text-slate-900 hover:border-red-500 shadow-xs'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stock Switch and Badge Selection */}
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Mở bán món</p>
                        <p className="text-xs text-slate-500 font-medium">
                          {productForm.isOutOfStock || Number(productForm.stockQuantity) <= 0
                            ? '🔴 Hết hàng'
                            : `🟢 Còn ${productForm.stockQuantity} sp`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextState = !productForm.isOutOfStock;
                          setProductForm({ 
                            ...productForm, 
                            isOutOfStock: nextState,
                            stockQuantity: nextState ? 0 : (Number(productForm.stockQuantity) > 0 ? productForm.stockQuantity : 25),
                            badge: nextState ? 'HẾT HÀNG' : (productForm.badge === 'HẾT HÀNG' ? '' : productForm.badge)
                          });
                        }}
                        className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                          productForm.isOutOfStock || Number(productForm.stockQuantity) <= 0 ? 'bg-red-600' : 'bg-emerald-500'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                            productForm.isOutOfStock || Number(productForm.stockQuantity) <= 0 ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-black text-slate-900 uppercase tracking-wide mb-1.5">
                        Gắn Nhãn (Badge)
                      </label>
                      <select
                        value={productForm.badge}
                        onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500"
                      >
                        <option value="">Không gắn nhãn</option>
                        <option value="HẾT HÀNG">⚠️ HẾT HÀNG</option>
                        <option value="MỚI">🔥 MỚI</option>
                        <option value="SALE">🏷️ SALE</option>
                        <option value="BEST SELLER">⭐ BEST SELLER</option>
                      </select>
                    </div>
                  </div>

                  {/* Image Selector from Library */}
                  <div>
                    <label className="block text-sm font-black text-slate-900 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                      <span>Chọn Ảnh Mẫu Từ Thư Viện</span>
                      <span className="text-xs text-slate-500 font-normal">Click để đổi ảnh</span>
                    </label>
                    <div className="grid grid-cols-6 sm:grid-cols-7 gap-2 max-h-28 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                      {AVAILABLE_IMAGES.map((imgItem, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setProductForm({ ...productForm, image: imgItem.path, customImageUrl: '' })}
                          className={`aspect-square rounded-xl border-2 p-1 overflow-hidden transition cursor-pointer bg-white flex items-center justify-center ${
                            productForm.image === imgItem.path && !productForm.customImageUrl
                              ? 'border-red-600 ring-2 ring-red-500/40 scale-105'
                              : 'border-transparent hover:border-slate-300'
                          }`}
                          title={imgItem.label}
                        >
                          <img src={imgItem.path} alt={imgItem.label} className="w-full h-full object-contain" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Or Custom Image URL */}
                  <div>
                    <input
                      type="text"
                      placeholder="Hoặc dán URL link ảnh tùy chỉnh (https://... hoặc /img/ten-anh.jpg)"
                      value={productForm.customImageUrl}
                      onChange={(e) => setProductForm({ ...productForm, customImageUrl: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-black text-slate-900 uppercase tracking-wide mb-1.5">
                      Mô Tả Sản Phẩm
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ghi chú hương vị, nguồn gốc hạt, cách pha..."
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500"
                    />
                  </div>

                </div>

                {/* RIGHT: COMPACT LIVE CARD PREVIEW (5 cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                      <Eye className="w-4 h-4 text-red-600" />
                      Xem Trước Giao Diện
                    </span>
                    <span className="text-xs text-emerald-600 font-extrabold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      Live Preview
                    </span>
                  </div>

                  {/* Customer Website Card Preview with Clear Larger Typography */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 p-5 text-neutral-900 transition-all duration-300">
                    <div className="relative h-44 w-full flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden mb-3.5">
                      
                      {/* Badge preview */}
                      {(productForm.isOutOfStock || Number(productForm.stockQuantity) <= 0) ? (
                        <span className="absolute top-2.5 right-2.5 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-sm animate-pulse">
                          HẾT HÀNG
                        </span>
                      ) : productForm.badge ? (
                        <span className="absolute top-2.5 right-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-sm">
                          {productForm.badge}
                        </span>
                      ) : null}

                      <img
                        src={productForm.customImageUrl.trim() || productForm.image}
                        alt="Preview"
                        className="w-full h-full object-contain p-2 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = AVAILABLE_IMAGES[0].path;
                        }}
                      />
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {CATEGORY_OPTIONS.find(c => c.id === productForm.category)?.name}
                      </span>
                      <h4 className="font-condensed font-black text-xl text-slate-900 leading-snug line-clamp-1">
                        {productForm.name || 'Tên sản phẩm mẫu...'}
                      </h4>

                      <div className="flex items-center gap-2.5 mt-1.5">
                        <span className="text-red-600 font-black text-xl">
                          {productForm.price ? formatVND(Number(productForm.price)) : '0đ'}
                        </span>
                        {productForm.originalPrice && (
                          <span className="text-slate-400 line-through text-sm font-medium">
                            {formatVND(Number(productForm.originalPrice))}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {productForm.description || 'Mô tả hương vị thơm ngon đậm đà đặc trưng của hạt cà phê mộc nguyên bản.'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500">
                      <span>★ 5.0 (Mới)</span>
                      {(productForm.isOutOfStock || Number(productForm.stockQuantity) <= 0) ? (
                        <span className="text-red-600 font-black flex items-center gap-1">
                          ✕ Hết hàng
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          ✓ Còn {productForm.stockQuantity} sp
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 text-center leading-relaxed">
                    Sản phẩm sẽ hiển thị đồng bộ tại trang chủ, danh mục đóng gói, dụng cụ & phụ kiện.
                  </p>
                </div>

              </div>
            </form>

            {/* Modal Footer Buttons: Fixed at bottom, larger and clearer */}
            <div className="shrink-0 px-6 sm:px-8 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-sm sm:text-base transition cursor-pointer shadow-xs"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                form="product-modal-form"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm sm:text-base shadow-md shadow-red-900/25 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                {editingProduct ? 'Cập Nhật Sản Phẩm' : 'Tạo Sản Phẩm Mới'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          CONFIRM DELETE MODAL
          ========================================================================= */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 p-4 flex items-center justify-center animate-fadeIn">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setDeleteCandidate(null)}
          />
          <div className="relative bg-white border border-slate-200 p-6 rounded-2xl max-w-md w-full shadow-2xl z-10 text-slate-800 animate-popIn text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-600 border border-red-500/30 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Xác Nhận Xóa Sản Phẩm?</h3>
            <p className="text-xs text-slate-600">
              Bạn có chắc chắn muốn xóa món <strong className="text-slate-900">"{deleteCandidate.name}"</strong>? Thao tác này sẽ gỡ bỏ sản phẩm khỏi thực đơn hiện tại.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-900/40 transition cursor-pointer"
              >
                Đồng Ý Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ORDER DETAILS MODAL
          ========================================================================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 p-3 sm:p-5 flex items-center justify-center overflow-hidden animate-fadeIn">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedOrderDetails(null)}
          />
          <div className="relative bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl z-10 text-slate-800 animate-popIn overflow-hidden">
            <div className="shrink-0 flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs text-slate-500 uppercase font-mono">Chi tiết đơn hàng</span>
                <h3 className="font-bold text-xl text-slate-900">#{selectedOrderDetails.code}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs pr-1">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500">Khách hàng:</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedOrderDetails.customerName}</p>
                </div>
                <div>
                  <span className="text-slate-500">Số điện thoại:</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedOrderDetails.phone}</p>
                </div>
                <div className="col-span-2 mt-1">
                  <span className="text-slate-500">Địa chỉ giao:</span>
                  <p className="text-slate-800">{selectedOrderDetails.address}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold uppercase tracking-wider block mb-2">Các món đã đặt ({selectedOrderDetails.items.length})</span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedOrderDetails.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-contain bg-white/5" />
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <span className="text-[10px] text-slate-500">{item.size || ''}</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#E51E25]">{item.quantity} x {formatVND(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="text-slate-500">Tổng thanh toán:</span>
                <span className="font-black text-xl text-[#E51E25]">{formatVND(selectedOrderDetails.finalTotal)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenInvoice(selectedOrderDetails)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>In Hóa Đơn</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs transition cursor-pointer"
              >
                Đóng Cửa Sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Invoice Print Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={selectedOrderForInvoice}
      />

    </div>
  );
}

