import React, { useState, useEffect } from 'react';
import { Filter, Star, ShoppingBag, SlidersHorizontal, Search, ArrowUpDown, RefreshCcw, Eye, X } from 'lucide-react';
import { Product, Page } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/products';
import DecorativeBorder from '../components/DecorativeBorder';
import { translate, Language } from '../lib/translations';

interface ShopProps {
  searchFilters: { category: string; priceRange: string; searchTerm: string };
  setSearchFilters: (filters: { category: string; priceRange: string; searchTerm: string }) => void;
  addToCart: (product: Product) => void;
  setSelectedProduct: (product: Product | null) => void;
  isLoggedIn: boolean;
  setCurrentPage: (page: Page) => void;
  language: Language;
  products?: Product[];
}

export default function Shop({
  searchFilters,
  setSearchFilters,
  addToCart,
  setSelectedProduct,
  isLoggedIn,
  setCurrentPage,
  language,
  products = PRODUCTS,
}: ShopProps) {
  // Sync page state with global filters passed from home
  const [selectedCategory, setSelectedCategory] = useState(searchFilters.category || 'all');
  const [selectedPriceRange, setSelectedPriceRange] = useState(searchFilters.priceRange || 'all');
  const [localSearchTerm, setLocalSearchTerm] = useState(searchFilters.searchTerm || '');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');

  // Mobile Filter Drawer toggle
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Pagination
  const [visibleCount, setVisibleCount] = useState(8);

  // Sync internal state if props change (e.g., from search submit on Home page)
  useEffect(() => {
    setSelectedCategory(searchFilters.category);
    setSelectedPriceRange(searchFilters.priceRange);
    setLocalSearchTerm(searchFilters.searchTerm);
  }, [searchFilters]);

  // Unique Brands in product list
  const BRANDS = ['all', 'Sparkle Safe', 'Sivakasi Elite'];

  // Categories list with counts updated based on static products count
  const categoryTabs = [
    { id: 'all', name: 'All Products' },
    { id: 'sparklers', name: 'Sparklers' },
    { id: 'flowerpots', name: 'Flower Pots' },
    { id: 'rockets', name: 'Rockets' },
    { id: 'chakras', name: 'Ground Spinners' },
    { id: 'sound', name: 'Sound Crackers' },
    { id: 'combos', name: 'Gift Combos' },
  ];

  // Filtering Logic
  const filteredProducts = products.filter((product) => {
    // 1. Category Filter
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // 2. Search Term Filter
    if (localSearchTerm) {
      const query = localSearchTerm.toLowerCase();
      const matchName = product.name.toLowerCase().includes(query);
      const matchDesc = product.description.toLowerCase().includes(query);
      const matchBrand = product.brand.toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchBrand) return false;
    }

    // 3. Price Filter
    if (selectedPriceRange !== 'all') {
      const price = product.price;
      if (selectedPriceRange === '0-200' && price > 200) return false;
      if (selectedPriceRange === '200-500' && (price < 200 || price > 500)) return false;
      if (selectedPriceRange === '500-1500' && (price < 500 || price > 1500)) return false;
      if (selectedPriceRange === '1500' && price < 1500) return false;
    }

    // 4. Brand Filter
    if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
      return false;
    }

    // 5. Rating Filter
    if (selectedRating !== 'all' && product.rating < selectedRating) {
      return false;
    }

    return true;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  // Paginated/Sliced Products for display
  const displayedProducts = sortedProducts.slice(0, visibleCount);

  // Clear all filters handler
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSelectedBrand('all');
    setSelectedRating('all');
    setLocalSearchTerm('');
    setSortBy('rating');
    setSearchFilters({ category: 'all', priceRange: 'all', searchTerm: '' });
  };

  return (
    <div className="w-full bg-[#FFF8F0] pb-12 text-left" id="shop-page-container">
      {/* Banner / Header */}
      <div className="bg-[#7A0C1E] text-white py-10 px-6 text-center border-b border-[#D4AF37]/30">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-[#D4AF37] text-xs font-mono font-bold tracking-widest uppercase block mb-1">
            FESTIVE CATALOGUE
          </span>
          <h1 className="font-sans font-extrabold text-3xl text-white flex items-center gap-1.5 justify-center">
            Shop Diwali Crackers
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-semibold py-0.5 px-2.5 rounded-full uppercase">
              100% Licensed (Form-24 Compliant)
            </span>
          </div>
        </div>
      </div>

      <DecorativeBorder />

      {/* Category Tabs Array */}
      <div className="max-w-[1240px] mx-auto px-5 mb-6 overflow-x-auto hide-scrollbar" id="shop-category-tabs-scroller">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-200/60 min-w-max">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedCategory(tab.id);
                setVisibleCount(8);
              }}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                selectedCategory === tab.id
                  ? 'bg-[#7A0C1E] text-[#D4AF37] border-[#7A0C1E] shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-800 border-slate-200'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-5 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6" id="shop-desktop-sidebar">
          <div className="bg-white rounded-2xl p-5 border border-[#D4AF37]/15 shadow-sm sticky top-24 space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-sans font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-[#7A0C1E]" />
                <span>Refine Search</span>
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-slate-400 hover:text-red-600 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>

            {/* Keyword search inside sidebar */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Filter Keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  placeholder="e.g. sparklers"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7A0C1E] bg-slate-50/50"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Budget Constraint</label>
              <div className="space-y-1.5 text-xs text-slate-600">
                {[
                  { id: 'all', label: 'Any Budget' },
                  { id: '0-200', label: 'Under ₹200' },
                  { id: '200-500', label: '₹200 - ₹500' },
                  { id: '500-1500', label: '₹500 - ₹1,500' },
                  { id: '1500', label: 'Premium (Above ₹1,500)' },
                ].map((range) => (
                  <label key={range.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                    <input
                      type="radio"
                      name="priceRangeDesktop"
                      checked={selectedPriceRange === range.id}
                      onChange={() => setSelectedPriceRange(range.id)}
                      className="accent-[#7A0C1E]"
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Licensed Manufacturer</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7A0C1E] bg-slate-50/50"
              >
                <option value="all">All Manufacturers</option>
                {BRANDS.filter(b => b !== 'all').map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Star Rating */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Minimum Satisfaction</label>
              <div className="space-y-1.5 text-xs text-slate-600">
                {[
                  { id: 'all', label: 'Any Rating' },
                  { id: 4.8, label: '4.8★ & Above' },
                  { id: 4.5, label: '4.5★ & Above' },
                  { id: 4.0, label: '4.0★ & Above' },
                ].map((rating) => (
                  <label key={rating.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                    <input
                      type="radio"
                      name="ratingDesktop"
                      checked={selectedRating === rating.id}
                      onChange={() => setSelectedRating(rating.id as number | 'all')}
                      className="accent-[#7A0C1E]"
                    />
                    <span className="flex items-center gap-0.5">
                      {rating.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ================= PRODUCT DISPLAY COLUMNS ================= */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Top Controls Banner (Search, Sort & Mobile Filters button) */}
          <div className="bg-white rounded-2xl p-4 border border-[#D4AF37]/15 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Count Indicator */}
            <div className="text-xs text-slate-500 text-center sm:text-left">
              Showing <b className="text-[#7A0C1E] font-mono">{displayedProducts.length}</b> of{' '}
              <b className="text-slate-700 font-mono">{sortedProducts.length}</b> verified products
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs py-2.5 px-4 rounded-xl shadow-xs cursor-pointer hover:bg-slate-50 active:scale-95"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-2.5 py-2 hover:border-slate-300 transition-all bg-white flex-1 sm:flex-initial">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-0 text-xs font-bold text-slate-700 focus:ring-0 focus:outline-none cursor-pointer"
                >
                  <option value="rating">Sort: Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Bar */}
          {(selectedCategory !== 'all' || selectedPriceRange !== 'all' || selectedBrand !== 'all' || selectedRating !== 'all' || localSearchTerm) && (
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className="text-slate-400">Active Criteria:</span>
              {selectedCategory !== 'all' && (
                <span className="bg-[#7A0C1E]/5 text-[#7A0C1E] border border-[#7A0C1E]/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-red-600 font-bold">×</button>
                </span>
              )}
              {selectedPriceRange !== 'all' && (
                <span className="bg-[#7A0C1E]/5 text-[#7A0C1E] border border-[#7A0C1E]/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                  Budget: {selectedPriceRange}
                  <button onClick={() => setSelectedPriceRange('all')} className="hover:text-red-600 font-bold">×</button>
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="bg-[#7A0C1E]/5 text-[#7A0C1E] border border-[#7A0C1E]/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                  Brand: {selectedBrand}
                  <button onClick={() => setSelectedBrand('all')} className="hover:text-red-600 font-bold">×</button>
                </span>
              )}
              {selectedRating !== 'all' && (
                <span className="bg-[#7A0C1E]/5 text-[#7A0C1E] border border-[#7A0C1E]/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                  {selectedRating}★ & Above
                  <button onClick={() => setSelectedRating('all')} className="hover:text-red-600 font-bold">×</button>
                </span>
              )}
              {localSearchTerm && (
                <span className="bg-[#7A0C1E]/5 text-[#7A0C1E] border border-[#7A0C1E]/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                  "{localSearchTerm}"
                  <button onClick={() => setLocalSearchTerm('')} className="hover:text-red-600 font-bold">×</button>
                </span>
              )}
              <button onClick={handleResetFilters} className="text-[#FF9933] font-bold hover:underline py-1 px-2">
                Clear Filters
              </button>
            </div>
          )}

          {/* Product Grid */}
          {displayedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#D4AF37]/15 shadow-xs" id="shop-empty-state">
              <div className="w-16 h-16 bg-[#7A0C1E]/5 rounded-full flex items-center justify-center text-[#D4AF37] mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-sans font-bold text-lg text-slate-800">No crackers matched your filters</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                Try widening your budget, clearing search terms, or checking another category. We have plenty of secure crackers in stock!
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 bg-[#7A0C1E] hover:bg-[#911327] text-[#D4AF37] text-xs font-bold py-2.5 px-6 rounded-full shadow-md transition-all cursor-pointer"
              >
                Show All Crackers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5" id="shop-products-grid">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-[#D4AF37]/10 p-4 shadow-sm hover:shadow-md hover:border-[#D4AF37]/40 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Image Thumbnail */}
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#FFF8F0] mb-3 border border-[#D4AF37]/5">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.isBestSeller && (
                        <span className="absolute top-2 left-2 bg-[#7A0C1E] text-[#D4AF37] text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                          Top Choice
                        </span>
                      )}
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                        aria-label={`View details of ${product.name}`}
                      >
                        <div className="bg-white/95 text-[#7A0C1E] text-[10px] font-bold py-1.5 px-3 rounded-xl flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>View Details</span>
                        </div>
                      </button>
                    </div>

                    {/* Brand & Ratings */}
                    <div className="flex items-center justify-between text-[10px] mb-1 px-0.5">
                      <span className="text-[#7A0C1E]/60 font-semibold">{product.brand}</span>
                      <div className="flex items-center gap-0.5 text-amber-500 font-semibold">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-mono">{product.rating}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => setSelectedProduct(product)}
                      className="font-sans font-bold text-[#7A0C1E] text-xs leading-snug hover:text-[#911327] transition-colors cursor-pointer px-0.5 line-clamp-1"
                    >
                      {product.name}
                    </h3>

                    {/* Safety Seal */}
                    <p className="text-[9px] text-emerald-700 font-semibold px-0.5 mt-1">
                      ✓ {product.safetyRating}
                    </p>
                  </div>

                  {/* Price & Buy Button */}
                  <div className="mt-3 pt-2.5 border-t border-[#7A0C1E]/10 flex items-center justify-between px-0.5">
                    <div>
                      <span className="text-xs font-extrabold text-[#7A0C1E] font-mono block">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[9px] text-slate-400 line-through font-mono">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    {isLoggedIn ? (
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-[#7A0C1E]/5 hover:bg-[#7A0C1E] hover:text-white text-[#7A0C1E] p-2 rounded-lg transition-all active:scale-90 cursor-pointer"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentPage('login')}
                        className="bg-[#D4AF37]/10 hover:bg-[#7A0C1E] hover:text-white text-[#7A0C1E] font-sans font-bold text-[9px] py-1.5 px-2.5 rounded-lg border border-[#D4AF37]/30 transition-all active:scale-90 cursor-pointer"
                        aria-label="Login to Buy"
                      >
                        Login & Buy
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {sortedProducts.length > displayedProducts.length && (
            <div className="text-center pt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 4)}
                className="bg-white hover:bg-slate-50 text-slate-700 font-sans font-bold text-xs py-3 px-8 rounded-full border border-slate-200 shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-95"
              >
                Load More Crackers
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ================= MOBILE FILTER DRAWER ================= */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end lg:hidden" id="shop-mobile-filter-drawer">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-pointer" onClick={() => setIsMobileFiltersOpen(false)}></div>
          
          <div className="relative w-full max-w-[340px] h-full bg-[#FFF8F0] shadow-2xl flex flex-col z-10 p-5 overflow-y-auto border-l border-[#D4AF37]/30">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-sans font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-[#7A0C1E]" />
                <span>Filters</span>
              </h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-left">
              {/* Keyword */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Keyword</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                    placeholder="Search e.g. rockets"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7A0C1E]"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Budget Range</label>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {[
                    { id: 'all', label: 'Any Budget' },
                    { id: '0-200', label: 'Under ₹200' },
                    { id: '200-500', label: '₹200 - ₹500' },
                    { id: '500-1500', label: '₹500 - ₹1,500' },
                    { id: '1500', label: 'Above ₹1,500' },
                  ].map((range) => (
                    <label key={range.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priceRangeMobile"
                        checked={selectedPriceRange === range.id}
                        onChange={() => setSelectedPriceRange(range.id)}
                        className="accent-[#7A0C1E]"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Manufacturer</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200"
                >
                  <option value="all">All Brands</option>
                  <option value="Sparkle Safe">Sparkle Safe</option>
                  <option value="Sivakasi Elite">Sivakasi Elite</option>
                </select>
              </div>

              {/* Ratings */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Satisfaction</label>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {[
                    { id: 'all', label: 'Any Rating' },
                    { id: 4.8, label: '4.8★ & Above' },
                    { id: 4.5, label: '4.5★ & Above' },
                  ].map((rating) => (
                    <label key={rating.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="ratingMobile"
                        checked={selectedRating === rating.id}
                        onChange={() => setSelectedRating(rating.id as number | 'all')}
                        className="accent-[#7A0C1E]"
                      />
                      <span>{rating.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex-1 border text-xs font-bold py-2.5 rounded-xl text-slate-500 hover:text-red-600"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="flex-1 bg-[#7A0C1E] text-[#D4AF37] text-xs font-bold py-2.5 rounded-xl"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
