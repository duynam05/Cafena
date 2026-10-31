import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, ShoppingBag, X } from 'lucide-react';
import { PACKAGED_PRODUCTS, EQUIPMENT_PRODUCTS, formatVND } from '../data/products';
import { useCart } from '../context/CartContext';

// ─── Toàn bộ sản phẩm cho trang này ─────────────────────────────────────────
const ALL_PAGE_PRODUCTS = [
  ...PACKAGED_PRODUCTS,
  ...EQUIPMENT_PRODUCTS,
];

// ─── Price ranges (từ sidebar video) ─────────────────────────────────────────
const PRICE_RANGES = [
  { label: 'Dưới 1.000.000đ', min: 0, max: 1000000 },
  { label: '1.000.000đ - 2.000.000đ', min: 1000000, max: 2000000 },
  { label: '2.000.000đ - 3.000.000đ', min: 2000000, max: 3000000 },
  { label: '3.000.000đ - 4.000.000đ', min: 3000000, max: 4000000 },
  { label: 'Trên 4.000.000đ', min: 4000000, max: Infinity },
];

// ─── Danh mục (từ sidebar) ────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'packaged', label: 'Cà phê đóng gói' },
  { id: 'equipment', label: 'Dụng cụ pha cà phê' },
  { id: 'accessory', label: 'Phụ kiện' },
  { id: 'grinder', label: 'Máy xay cafe cầm tay' },
];

// ─── Sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'default', label: 'Sắp xếp' },
  { value: 'price-asc', label: 'Giá: Thấp đến Cao' },
  { value: 'price-desc', label: 'Giá: Cao đến Thấp' },
  { value: 'name-asc', label: 'Tên: A - Z' },
  { value: 'name-desc', label: 'Tên: Z - A' },
];

const PAGE_SIZE = 6;

// ─── Collapsible Sidebar Section ─────────────────────────────────────────────
function SidebarSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-2 font-semibold text-sm uppercase tracking-wider text-[#1E1E1E] hover:text-[#E51E25] transition-colors"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="pt-2">{children}</div>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onSelectProduct, onQuickAdd }) {
  const hasSaleBadge = product.badges?.includes('SALE') || (product.discountPercent);
  const hasOutOfStock = product.isOutOfStock || (product.stockQuantity !== undefined && Number(product.stockQuantity) <= 0);

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-white border border-gray-100 rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between"
    >
      {/* Image Area */}
      <div
        className="relative overflow-hidden bg-gray-50 flex items-center justify-center"
        style={{ paddingBottom: '100%' }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges top-right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-10">
          {hasOutOfStock ? (
            <span className="bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded shadow-md animate-pulse">
              HẾT HÀNG
            </span>
          ) : hasSaleBadge ? (
            <>
              <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">
                SALE
              </span>
              {product.discountPercent && (
                <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">
                  -{product.discountPercent}%
                </span>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {product.categoryName && (
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              {product.categoryName}
            </span>
          )}
          <h3 className="font-medium text-[#1E1E1E] text-sm mb-2 group-hover:text-[#E51E25] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div>
          {/* Rating if available */}
          {product.rating && (
            <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-1.5">
              <span>★ {product.rating}</span>
              {product.reviewCount && (
                <span className="text-gray-400">({product.reviewCount})</span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#E51E25] font-bold text-sm">
              {formatVND(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-gray-400 text-xs line-through">
                {formatVND(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PackagedProductsPage({ onSelectProduct, navigateTo, initialCategory = 'all' }) {
  const { addToCart } = useCart();

  // Filter states
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Sync category with URL hash (on mount AND on hash change)
  React.useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#products-')) {
        const cat = hash.replace('#products-', '');
        if (['packaged', 'menu', 'equipment', 'accessory', 'grinder'].includes(cat)) {
          setSelectedCategory(cat);
          setVisibleCount(PAGE_SIZE);
        } else if (cat === 'page') {
          setSelectedCategory('all');
          setVisibleCount(PAGE_SIZE);
        }
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  // Toggle price range checkbox
  const togglePriceRange = (idx) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
    setVisibleCount(PAGE_SIZE);
  };

  // Filter + sort products
  const filteredProducts = useMemo(() => {
    let products = [...ALL_PAGE_PRODUCTS];
    try {
      const saved = localStorage.getItem('cafena_admin_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          products = parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Category
    if (selectedCategory !== 'all') {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Price ranges
    if (selectedPriceRanges.length > 0) {
      products = products.filter((p) =>
        selectedPriceRanges.some((idx) => {
          const range = PRICE_RANGES[idx];
          return p.price >= range.min && p.price < range.max;
        })
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        break;
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
        break;
      default:
        break;
    }

    return products;
  }, [searchQuery, selectedCategory, selectedPriceRanges, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleQuickAdd = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  const resetFilters = () => {
    setSelectedPriceRanges([]);
    setSelectedCategory('all');
    setSortBy('default');
    setSearchQuery('');
    setVisibleCount(PAGE_SIZE);
  };

  const hasActiveFilters = selectedPriceRanges.length > 0 || selectedCategory !== 'all' || searchQuery.trim();

  // ─── Sidebar content ──────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(PAGE_SIZE); }}
            placeholder="Tìm sản phẩm..."
            className="w-full border border-gray-300 rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:border-[#E51E25]"
          />
          {searchQuery ? (
            <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          ) : (
            <Search size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          )}
        </div>
      </div>

      {/* Lọc giá */}
      <SidebarSection title="Lọc Giá" defaultOpen={true}>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, idx) => (
            <label key={idx} className="flex items-center gap-2 cursor-pointer group/item">
              <input
                type="checkbox"
                checked={selectedPriceRanges.includes(idx)}
                onChange={() => togglePriceRange(idx)}
                className="accent-[#E51E25] w-4 h-4"
              />
              <span className="text-sm text-gray-600 group-hover/item:text-[#E51E25] transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </SidebarSection>

      {/* Danh mục */}
      <SidebarSection title="Danh Mục" defaultOpen={true}>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setVisibleCount(PAGE_SIZE); }}
              className={`block w-full text-left text-sm px-2 py-1 rounded transition-colors ${
                selectedCategory === cat.id
                  ? 'text-[#E51E25] font-semibold bg-red-50'
                  : 'text-gray-600 hover:text-[#E51E25]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </SidebarSection>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full mt-2 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:border-[#E51E25] hover:text-[#E51E25] transition-colors"
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* ── Breadcrumb Hero Banner ──────────────────────────────────────────── */}
      <div
        className="relative w-full flex items-center justify-center py-14"
        style={{
          background: 'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(/img/home_gallery_5_img.webp) center/cover no-repeat',
          minHeight: 140,
        }}
      >
        <div className="text-center">
          <nav className="flex items-center justify-center gap-2 text-white/80 text-sm mb-2">
            <button
              onClick={() => navigateTo('home')}
              className="hover:text-white transition-colors uppercase tracking-widest"
            >
              Trang Chủ
            </button>
            <span className="text-white/50">/</span>
            <span className="text-white uppercase tracking-widest font-semibold">
              {CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'Tất Cả Sản Phẩm'}
            </span>
          </nav>
          <h1 className="text-white text-2xl font-bold uppercase tracking-widest sr-only">
            Tất cả sản phẩm
          </h1>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Mobile: Filter toggle + Sort */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <button
            onClick={() => setShowMobileFilter(true)}
            className="flex items-center gap-2 border border-gray-300 rounded px-4 py-2 text-sm hover:border-[#E51E25] hover:text-[#E51E25] transition-colors"
          >
            <SlidersHorizontal size={16} />
            Bộ lọc
            {hasActiveFilters && (
              <span className="bg-[#E51E25] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {selectedPriceRanges.length + (selectedCategory !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#E51E25]"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-8">
          {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <SidebarContent />
          </aside>

          {/* ── Products Area ─────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Desktop Sort + Result count */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                Hiển thị <span className="font-semibold text-[#1E1E1E]">{displayedProducts.length}</span>
                {' / '}
                <span className="font-semibold text-[#1E1E1E]">{filteredProducts.length}</span> sản phẩm
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sắp xếp theo:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#E51E25] bg-white"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {displayedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={onSelectProduct}
                      onQuickAdd={handleQuickAdd}
                    />
                  ))}
                </div>

                {/* Xem thêm */}
                {hasMore && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                      className="border border-gray-400 rounded px-8 py-3 text-sm font-medium text-gray-700 hover:border-[#E51E25] hover:text-[#E51E25] transition-colors"
                    >
                      Xem thêm sản phẩm
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Không tìm thấy sản phẩm phù hợp</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-sm text-[#E51E25] underline"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ─────────────────────────────────────────────── */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setShowMobileFilter(false)}
          />
          {/* Drawer */}
          <div className="w-80 max-w-full bg-white h-full overflow-y-auto p-6 shadow-2xl animate-slideInRight">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Bộ lọc</h2>
              <button onClick={() => setShowMobileFilter(false)}>
                <X size={20} />
              </button>
            </div>
            <SidebarContent />
            <button
              onClick={() => setShowMobileFilter(false)}
              className="w-full mt-4 bg-[#E51E25] text-white py-3 rounded font-semibold hover:bg-red-700 transition-colors"
            >
              Xem {filteredProducts.length} sản phẩm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

