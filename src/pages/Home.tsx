import React, { useState } from 'react';
import { Search, ChevronRight, Award, Truck, ShieldCheck, RefreshCw, Star, ShoppingBag, Eye, MapPin, CheckCircle, HelpCircle } from 'lucide-react';
import { Page, Product } from '../types';
import { PRODUCTS } from '../data/products';
import DecorativeBorder, { FairyLights } from '../components/DecorativeBorder';
import { translate, Language } from '../lib/translations';
import { dbService } from '../lib/supabase';

// Import the generated images
import heroBanner from '../assets/images/hero_banner_diwali_1782969842884.jpg';
import indianSparklersPhuljhari from '../assets/images/indian_sparklers_phuljhari_1782971056125.jpg';
import indianFlowerpotAnar from '../assets/images/indian_flowerpot_anar_1782971039242.jpg';
import indianSkyRocket from '../assets/images/indian_sky_rocket_1782971071922.jpg';
import indianGroundChakra from '../assets/images/indian_ground_chakra_1782970918992.jpg';
import indianBijliCrackers from '../assets/images/indian_bijli_crackers_1782971085587.jpg';
import indianGreenCrackersBox from '../assets/images/indian_green_crackers_box_1782970901148.jpg';

interface HomeProps {
  setCurrentPage: (page: Page) => void;
  setSearchFilters: (filters: { category: string; priceRange: string; searchTerm: string }) => void;
  addToCart: (product: Product) => void;
  setSelectedProduct: (product: Product | null) => void;
  isLoggedIn: boolean;
  language: Language;
  products?: Product[];
}

export default function Home({
  setCurrentPage,
  setSearchFilters,
  addToCart,
  setSelectedProduct,
  isLoggedIn,
  language,
  products = PRODUCTS,
}: HomeProps) {
  // Local Search / Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Delivery checker states
  const [deliveryQuery, setDeliveryQuery] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<any>(null);
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);

  const handleDeliveryCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryQuery.trim()) return;
    setIsCheckingDelivery(true);
    const result = await dbService.checkDelivery(deliveryQuery);
    setDeliveryResult(result ? result : 'not_available');
    setIsCheckingDelivery(false);
  };

  // Popular category items
  const POPULAR_CATEGORIES = [
    {
      id: 'sparklers',
      name: 'Sparklers',
      startingFrom: 180,
      image: indianSparklersPhuljhari,
      tag: 'Eco Friendly',
    },
    {
      id: 'flowerpots',
      name: 'Flower Pots',
      startingFrom: 350,
      image: indianFlowerpotAnar,
      tag: 'Crowd Favorite',
    },
    {
      id: 'rockets',
      name: 'Rockets',
      startingFrom: 380,
      image: indianSkyRocket,
      tag: 'High Altitudes',
    },
    {
      id: 'chakras',
      name: 'Ground Spinners',
      startingFrom: 150,
      image: indianGroundChakra,
      tag: 'Kid Friendly',
    },
    {
      id: 'sound',
      name: 'Sound Crackers',
      startingFrom: 120,
      image: indianBijliCrackers,
      tag: 'Traditional',
    },
    {
      id: 'combos',
      name: 'Gift Combos',
      startingFrom: 1299,
      image: indianGreenCrackersBox,
      tag: 'Best Savings',
    },
  ];

  // Best sellers
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  // Trigger search mapping to shop page
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilters({
      category,
      priceRange,
      searchTerm,
    });
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (catId: string) => {
    setSearchFilters({
      category: catId,
      priceRange: 'all',
      searchTerm: '',
    });
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#FFF8F0] pb-10" id="home-page-container">
      {/* Hero Section */}
      <div className="relative w-full h-[320px] md:h-[480px] bg-[#7A0C1E] overflow-hidden flex items-center justify-center shadow-xl">
        {/* Fairy lights hanging on top of hero */}
        <FairyLights />

        {/* Sleek Interface theme decorative overlays */}
        <div className="absolute inset-0 diwali-dot-pattern opacity-20"></div>
        <div className="absolute top-10 right-20 w-40 h-40 bg-[#FF9933] blur-[80px] rounded-full opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-[#D4AF37] blur-[80px] rounded-full opacity-20 pointer-events-none"></div>

        {/* Hero image background */}
        <img
          src={heroBanner}
          alt="Glowing golden diyas and fireworks at night"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 animate-pulse duration-5000"
        />

        {/* Backdrop vignette gradient for elegant text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#7A0C1E]/90 via-[#7A0C1E]/40 to-[#7A0C1E]/70"></div>

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-2xl px-5 text-white flex flex-col items-center">
          <div className="flex items-center gap-2 bg-[#D4AF37]/25 border border-[#D4AF37]/50 text-[#D4AF37] px-3.5 py-1 rounded-full text-[10px] md:text-xs font-mono font-bold tracking-widest uppercase mb-3.5 animate-pulse">
            <span>✨ {language === 'en' ? 'Direct from Sivakasi' : 'சிவகாசியில் இருந்து நேரடித் தயாரிப்பு'} ✨</span>
          </div>
          <h1 className="font-sans font-black text-3xl md:text-5xl leading-tight tracking-tight text-white uppercase drop-shadow-md">
            {language === 'en' ? 'Light Up Your ' : 'உங்கள் '}<span className="text-[#D4AF37] drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]">{language === 'en' ? 'Celebrations' : 'கொண்டாட்டங்களை'}</span>{language === 'en' ? ' Safely' : ' பாதுகாப்பாக மிளிரச் செய்யுங்கள்'}
          </h1>
          <p className="mt-3 text-xs md:text-sm text-[#FFF8F0]/85 font-sans leading-relaxed max-w-md md:max-w-xl font-light">
            {translate('home.hero_sub', language)}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleCategoryClick('all')}
              className="w-full sm:w-auto bg-[#D4AF37] hover:bg-white text-[#7A0C1E] font-sans font-bold text-xs md:text-sm py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:scale-95"
            >
              {translate('home.shop_now', language)}
            </button>
            <button
              onClick={() => handleCategoryClick('combos')}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white font-sans font-semibold text-xs md:text-sm py-3 px-6 rounded-xl transition-all duration-300 cursor-pointer hover:bg-white/20 active:scale-95"
            >
              {language === 'en' ? 'View Combo Packs 🎁' : 'பரிசு பெட்டிகள் பார்க்க 🎁'}
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Search / Filter Bar */}
      <div className="relative -mt-8 px-4 z-20 max-w-[1240px] mx-auto">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-2xl p-4 shadow-lg border border-[#D4AF37]/20 grid grid-cols-1 md:grid-cols-4 gap-3 items-center"
          id="home-search-bar-form"
        >
          {/* Keyword Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-[#7A0C1E]/60" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search e.g., sparklers..."
              className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7A0C1E] focus:ring-1 focus:ring-[#7A0C1E] transition-all bg-[#FFF8F0] border-[#7A0C1E]/5 placeholder-[#7A0C1E]/40 font-medium"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center">
            <div className="hidden md:block h-10 w-px bg-[#D4AF37]/20 mr-3"></div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7A0C1E] bg-transparent font-semibold text-[#7A0C1E] outline-none"
            >
              <option value="all">Category: All</option>
              <option value="sparklers">Sparklers</option>
              <option value="flowerpots">Flower Pots</option>
              <option value="rockets">Rockets</option>
              <option value="chakras">Ground Spinners</option>
              <option value="sound">Sound Crackers</option>
              <option value="combos">Gift Combos</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="flex items-center">
            <div className="hidden md:block h-10 w-px bg-[#D4AF37]/20 mr-3"></div>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full text-xs px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7A0C1E] bg-transparent font-semibold text-[#7A0C1E] outline-none"
            >
              <option value="all">Price: All Ranges</option>
              <option value="0-200">Under ₹200</option>
              <option value="200-500">₹200 - ₹500</option>
              <option value="500-1500">₹500 - ₹1500</option>
              <option value="1500">Above ₹1500</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-center w-full">
            <div className="hidden md:block h-10 w-px bg-[#D4AF37]/20 mr-3"></div>
            <button
              type="submit"
              className="w-full bg-[#7A0C1E] hover:bg-[#911327] text-white font-sans font-bold text-xs py-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* ================= TRUST BADGE & DELIVERY CHECKER ROW ================= */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
          
          {/* Direct Sourcing Badge Card */}
          <div className="md:col-span-5 bg-[#7A0C1E] text-white rounded-2xl p-4 border border-[#D4AF37]/35 shadow-md flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 text-[#D4AF37] flex-shrink-0 animate-pulse">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                {language === 'en' ? 'Direct Sourcing Trust Factor' : 'நேரடி தயாரிப்பு நம்பிக்கை காரணி'}
              </div>
              <h3 className="font-sans font-extrabold text-xs sm:text-sm mt-0.5 text-white">
                {language === 'en' ? 'Direct From Sivakasi, Tamil Nadu' : 'சிவகாசியில் இருந்து நேரடி கொள்முதல்'}
              </h3>
              <p className="text-[10px] text-white/70 mt-1 leading-relaxed">
                {language === 'en' 
                  ? 'Genuine, chemical-conscious green crackers packed directly at source. Save up to 40% with factory prices.' 
                  : 'உரிமம் பெற்ற தொழிற்சாலைகளிலிருந்து நேரடியாக வரும் அசல் பட்டாசுகள். 40% வரை கூடுதல் சேமிப்பைப் பெறுங்கள்.'}
              </p>
            </div>
          </div>

          {/* Interactive Delivery Checker Widget */}
          <div className="md:col-span-7 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-[#7A0C1E]" />
              <span className="font-sans font-bold text-xs sm:text-sm text-slate-800">
                {language === 'en' ? 'Tamil Nadu Delivery Checker' : 'தமிழ்நாடு டெலிவரி சேவை சரிபார்ப்பு'}
              </span>
            </div>

            <form onSubmit={handleDeliveryCheck} className="flex gap-2">
              <input
                type="text"
                value={deliveryQuery}
                onChange={(e) => setDeliveryQuery(e.target.value)}
                placeholder={language === 'en' ? 'Enter District or Pincode (e.g. Madurai, 600001)...' : 'மாவட்டம் அல்லது பின்கோடு உள்ளிடவும்...'}
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#7A0C1E] text-xs px-3 py-2 rounded-xl focus:outline-hidden font-medium text-slate-800"
              />
              <button
                type="submit"
                disabled={isCheckingDelivery}
                className="bg-[#7A0C1E] hover:bg-[#911327] text-[#D4AF37] hover:text-white font-sans font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {isCheckingDelivery ? '...' : (language === 'en' ? 'Check' : 'சரிபார்')}
              </button>
            </form>

            {/* Display Checker Result Output */}
            {deliveryResult && (
              <div className="mt-2.5">
                {deliveryResult === 'not_available' ? (
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-2.5 flex items-start gap-2 text-[10px] sm:text-xs text-rose-800">
                    <HelpCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
                    <div>
                      <b>{language === 'en' ? 'Serviceability Check:' : 'சேவை சரிபார்ப்பு:'}</b>{' '}
                      {language === 'en' 
                        ? 'This area is outside our express network or needs custom transport. Contact our support via WhatsApp below.' 
                        : 'இந்த பகுதிக்கு நேரடி எக்ஸ்பிரஸ் டெலிவரி இல்லை. கூடுதல் விவரங்களுக்கு வாட்ஸ்அப்பில் தொடர்பு கொள்ளவும்.'}
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 flex items-start gap-2 text-[10px] sm:text-xs text-emerald-800">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" />
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        <span>{language === 'en' ? 'Delivery Available!' : 'டெலிவரி செய்ய முடியும்!'}</span>
                        <span className="bg-emerald-100 text-emerald-800 font-mono text-[8px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-extrabold ml-1.5">
                          {deliveryResult.min_order_msg || (language === 'en' ? 'Sivakasi Direct' : 'சிவகாசி நேரடி')}
                        </span>
                      </div>
                      <div className="text-[10px] text-emerald-700 mt-0.5 leading-relaxed">
                        {language === 'en' ? 'Serviceable district: ' : 'சேவைக்குரிய பகுதி: '}
                        <b className="font-bold text-slate-800 uppercase">{deliveryResult.district}</b>.
                        {language === 'en' ? ' Typical transit time: ' : ' தோராயமான டெலிவரி நேரம்: '}
                        <b className="font-mono text-slate-800 font-extrabold">{deliveryResult.estimated_days} {language === 'en' ? 'days' : 'நாட்கள்'}</b>.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      <DecorativeBorder />

      {/* Popular Categories */}
      <section className="max-w-[1240px] mx-auto px-5 py-6">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold text-[#7A0C1E] uppercase tracking-widest block font-mono">
            VIBRANT VARIETY
          </span>
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-slate-800 tracking-tight mt-1">
            Popular Categories
          </h2>
          <div className="w-12 h-1 bg-[#D4AF37] mx-auto mt-2.5 rounded-full"></div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5" id="home-popular-categories-grid">
          {POPULAR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="bg-white rounded-2xl p-4 border border-[#D4AF37]/10 shadow-sm hover:shadow-md hover:border-[#D4AF37]/40 flex flex-col group cursor-pointer text-left relative overflow-hidden active:scale-95 transition-all duration-300"
            >
              <div className="w-full h-28 bg-[#FFF8F0] rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                <img
                  src={cat.image}
                  alt={`${cat.name} Category - Browse all premium ${cat.name} products`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-[#7A0C1E] text-[#D4AF37] text-[8px] font-bold font-mono py-0.5 px-2 rounded-md uppercase tracking-wider shadow-xs">
                  {cat.tag}
                </span>
              </div>
              <div className="mt-1 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-sans font-bold text-[#7A0C1E] text-xs leading-tight group-hover:text-[#911327] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Starting from <span className="font-semibold text-slate-800 font-mono">₹{cat.startingFrom}</span>
                  </p>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-[#7A0C1E]/5 p-1 rounded-lg">
                <ChevronRight className="w-3.5 h-3.5 text-[#7A0C1E]" />
              </div>
            </button>
          ))}
        </div>
      </section>

      <DecorativeBorder />

      {/* Best Selling Products */}
      <section className="max-w-[1240px] mx-auto px-5 py-6">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold text-[#7A0C1E] uppercase tracking-widest block font-mono">
            CELEBRATED PICKS
          </span>
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-slate-800 tracking-tight mt-1">
            Best Selling Products
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto">
            Our highly-reviewed and safest crackers ordered most frequently by families.
          </p>
          <div className="w-12 h-1 bg-[#D4AF37] mx-auto mt-2.5 rounded-full"></div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="home-best-sellers-grid">
          {bestSellers.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-[#D4AF37]/10 p-4 shadow-sm hover:shadow-md hover:border-[#D4AF37]/40 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#FFF8F0] mb-3.5 border border-[#D4AF37]/5">
                  <img
                    src={product.image}
                    alt={`${product.name} - ${product.description}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="bg-[#7A0C1E] text-white text-[8px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider shadow-xs">
                      Best Seller
                    </span>
                    <span className="bg-[#FF9933]/90 text-white text-[8px] font-semibold px-2 py-0.5 rounded-md shadow-xs uppercase">
                      {product.brand}
                    </span>
                  </div>
                  {/* Quick View Button */}
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer"
                    aria-label={`Quick view ${product.name}`}
                  >
                    <div className="bg-white/95 text-[#7A0C1E] hover:bg-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </div>
                  </button>
                </div>

                {/* Rating & Brand */}
                <div className="flex items-center justify-between text-[11px] mb-1 px-1">
                  <span className="text-[#7A0C1E]/60 font-semibold">{product.brand}</span>
                  <div className="flex items-center gap-0.5 text-amber-500 font-semibold">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-mono">{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewCount})</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-sans font-bold text-[#7A0C1E] text-sm leading-snug hover:text-[#911327] transition-colors cursor-pointer px-1 line-clamp-1" onClick={() => setSelectedProduct(product)}>
                  {product.name}
                </h3>

                {/* Safety Seal */}
                <p className="text-[10px] text-emerald-700 font-medium px-1 mt-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
                  {product.safetyRating}
                </p>
              </div>

              {/* Price & Cart Actions */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between px-1">
                <div>
                  <span className="text-base font-extrabold text-[#7A0C1E] font-mono">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through ml-1.5 font-mono">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
                {isLoggedIn ? (
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-[#7A0C1E]/5 hover:bg-[#7A0C1E] hover:text-white text-[#7A0C1E] font-sans font-bold text-xs p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentPage('login')}
                    className="bg-[#D4AF37]/10 hover:bg-[#7A0C1E] hover:text-white text-[#7A0C1E] font-sans font-bold text-[10.5px] py-2 px-3.5 rounded-xl border border-[#D4AF37]/35 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    aria-label="Login to Buy"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Login & Buy</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => handleCategoryClick('all')}
            className="inline-flex items-center gap-1 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#7A0C1E] hover:text-[#590512] font-sans font-bold text-xs py-3 px-8 rounded-full border border-[#D4AF37]/40 transition-all cursor-pointer shadow-xs"
          >
            <span>Explore All Products</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      <DecorativeBorder />

      {/* Why Choose Us Strip */}
      <section className="max-w-[1240px] mx-auto px-5 py-6" id="home-why-choose-us">
        <div className="bg-[#7A0C1E] rounded-3xl p-6 text-white border border-[#D4AF37]/35 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {/* Box 1 */}
          <div className="flex flex-col items-center p-3">
            <div className="w-12 h-12 bg-[#D4AF37]/15 rounded-full flex items-center justify-center text-[#D4AF37] mb-3 border border-[#D4AF37]/25">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-sans font-bold text-sm text-[#D4AF37]">Best Sivakasi Prices</h4>
            <p className="text-[11px] text-[#FFF8F0]/75 mt-1 leading-relaxed">
              Straight from factories in Sivakasi to your doorstep. Zero middleman markups!
            </p>
          </div>

          {/* Box 2 */}
          <div className="flex flex-col items-center p-3">
            <div className="w-12 h-12 bg-[#D4AF37]/15 rounded-full flex items-center justify-center text-[#D4AF37] mb-3 border border-[#D4AF37]/25">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-sans font-bold text-sm text-[#D4AF37]">100% Safe & Certified</h4>
            <p className="text-[11px] text-[#FFF8F0]/75 mt-1 leading-relaxed">
              PESO certified chemicals and modern green formulas. Safe delay fuses for your kids.
            </p>
          </div>

          {/* Box 3 */}
          <div className="flex flex-col items-center p-3">
            <div className="w-12 h-12 bg-[#D4AF37]/15 rounded-full flex items-center justify-center text-[#D4AF37] mb-3 border border-[#D4AF37]/25">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-sans font-bold text-sm text-[#D4AF37]">Pre-Diwali Delivery</h4>
            <p className="text-[11px] text-[#FFF8F0]/75 mt-1 leading-relaxed">
              Guaranteed fireproof-container secure shipping. Timely hand-offs by expert pilots.
            </p>
          </div>

          {/* Box 4 */}
          <div className="flex flex-col items-center p-3">
            <div className="w-12 h-12 bg-[#D4AF37]/15 rounded-full flex items-center justify-center text-[#D4AF37] mb-3 border border-[#D4AF37]/25">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-sans font-bold text-sm text-[#D4AF37]">Premium Replacements</h4>
            <p className="text-[11px] text-[#FFF8F0]/75 mt-1 leading-relaxed">
              We stand by our product standards. Zero-fuse-failures guarantee or instant swap-outs!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
