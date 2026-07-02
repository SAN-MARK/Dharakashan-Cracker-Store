import React, { useState, useEffect } from 'react';
import { Page, CartItem, UserSession, Product } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductQuickView from './components/ProductQuickView';
import { Language } from './lib/translations';
import { dbService, isSupabaseConfigured } from './lib/supabase';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Contact from './pages/Contact';
import ComboBuilder from './pages/ComboBuilder';
import BulkOrders from './pages/BulkOrders';

// Lucide Icons for Sticky Bottom Bar
import { Home as HomeIcon, ShoppingBag, Info, Phone, MessageSquare } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Supabase dynamic products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [seedingStatus, setSeedingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const refreshProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const pData = await dbService.getProducts();
      setProducts(pData);
      const oData = await dbService.getOrders();
      setOrders(oData);
    } catch (err) {
      console.error("refreshProducts error:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    refreshProducts();
  }, []);

  // Global Language State
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('app_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  };

  // Authentication State
  const [session, setSession] = useState<UserSession>({
    email: null,
    name: null,
    role: 'CUSTOMER',
    isLoggedIn: false,
  });

  // Global search filters transferred from Home to Shop
  const [searchFilters, setSearchFilters] = useState({
    category: 'all',
    priceRange: 'all',
    searchTerm: '',
  });

  // Toast / Status Message State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load existing session and cart from localStorage for persistence
  useEffect(() => {
    const savedCart = localStorage.getItem('sparkle_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }

    const savedUser = localStorage.getItem('sparkle_user');
    if (savedUser) {
      try {
        setSession(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync cart to localStorage
  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('sparkle_cart', JSON.stringify(updatedCart));
  };

  // Toast Trigger Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Add Item to Shopping Cart
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    let updatedCart = [...cart];

    if (existingIndex >= 0) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({ product, quantity });
    }

    saveCartToStorage(updatedCart);
    triggerToast(`Added ${quantity}x ${product.name} to cart! 🛍️`);
  };

  // Update Quantity inside Cart Drawer
  const updateQuantity = (productId: string, delta: number) => {
    let updatedCart = cart
      .map((item) => {
        if (item.product.id === productId) {
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    saveCartToStorage(updatedCart);
  };

  // Remove completely from Cart
  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    saveCartToStorage(updatedCart);
    triggerToast('Item removed from cart.');
  };

  // Empty Cart Completely
  const clearCart = () => {
    saveCartToStorage([]);
  };

  // Authentic User Login Handler
  const handleLoginSuccess = (name: string, email: string) => {
    const updatedSession: UserSession = {
      name,
      email,
      role: 'CUSTOMER',
      isLoggedIn: true,
    };
    setSession(updatedSession);
    localStorage.setItem('sparkle_user', JSON.stringify(updatedSession));
    triggerToast(`Welcome Shubh Deepavali, ${name}! 🎉`);
    setCurrentPage('home');
  };

  // Logout Handler
  const handleLogout = () => {
    const resetSession: UserSession = {
      email: null,
      name: null,
      role: 'CUSTOMER',
      isLoggedIn: false,
    };
    setSession(resetSession);
    localStorage.removeItem('sparkle_user');
    triggerToast('Logged out successfully.');
    setCurrentPage('home');
  };

  // Count item badges
  const totalCartCount = cart.reduce((tot, item) => tot + item.quantity, 0);

  // Switch pages smoothly and scroll back to top
  const handleNavigatePage = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen w-full bg-[#1e0307] md:bg-radial md:from-[#2e050b] md:to-[#110103] flex items-center justify-center font-sans antialiased text-[#FFF8F0]/90">
      
      {/* Centered full-width desktop layout canvas (collapses to single-column on mobile) */}
      <div
        className="w-full max-w-[1240px] min-h-screen bg-[#FFF8F0] text-slate-800 shadow-2xl relative flex flex-col justify-between overflow-x-hidden border-x border-[#D4AF37]/30"
        id="applet-viewport-sandbox"
      >
        {/* Core Header Navigation */}
        <Navbar
          currentPage={currentPage}
          setCurrentPage={handleNavigatePage}
          cart={cart}
          setIsCartOpen={setIsCartOpen}
          session={session}
          handleLogout={handleLogout}
          language={language}
          setLanguage={setLanguage}
        />

        {/* Dynamic Main Body Content */}
        <main className="flex-1 flex flex-col pb-16">
          {currentPage === 'home' && (
            <Home
              setCurrentPage={handleNavigatePage}
              setSearchFilters={setSearchFilters}
              addToCart={addToCart}
              setSelectedProduct={setSelectedProduct}
              isLoggedIn={session.isLoggedIn}
              language={language}
              products={products}
            />
          )}

          {currentPage === 'about' && <About language={language} />}

          {currentPage === 'shop' && (
            <Shop
              searchFilters={searchFilters}
              setSearchFilters={setSearchFilters}
              addToCart={addToCart}
              setSelectedProduct={setSelectedProduct}
              isLoggedIn={session.isLoggedIn}
              setCurrentPage={handleNavigatePage}
              language={language}
              products={products}
            />
          )}

          {currentPage === 'login' && (
            <Login handleLoginSuccess={handleLoginSuccess} />
          )}

          {currentPage === 'contact' && <Contact />}

          {currentPage === 'combo' && (
            <ComboBuilder
              addToCart={addToCart}
              isLoggedIn={session.isLoggedIn}
              setCurrentPage={handleNavigatePage}
              language={language}
              products={products}
            />
          )}

          {currentPage === 'bulk' && (
            <BulkOrders language={language} />
          )}
        </main>

        {/* Supabase Developer & Database Control Drawer */}
        <div className="w-full bg-[#FFF8F0] border-t-2 border-[#D4AF37]/30 py-6 px-4 md:px-8 mt-auto" id="supabase-dev-console">
          <div className="max-w-[1240px] mx-auto bg-[#7A0C1E]/5 rounded-2xl border border-[#7A0C1E]/15 p-4 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#7A0C1E]/10 text-[#7A0C1E] rounded-xl">
                  <span className="text-xl">🎛️</span>
                </div>
                <div>
                  <h3 className="font-sans font-extrabold text-[#7A0C1E] text-sm md:text-base tracking-tight uppercase">
                    Supabase Live Seeding & Verification Panel
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5 font-sans">
                    View, seed, and verify your Supabase database state in real-time.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-mono font-bold uppercase border ${
                  isSupabaseConfigured 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  {isSupabaseConfigured ? 'Supabase Connected' : 'Supabase Not Connected'}
                </div>

                <button
                  onClick={async () => {
                    setSeedingStatus('loading');
                    try {
                      const res = await dbService.seedSupabase();
                      if (res.success) {
                        setSeedingStatus('success');
                        await refreshProducts();
                        alert("🎉 Supabase successfully seeded with 6 premium products and sample orders!");
                      } else {
                        setSeedingStatus('error');
                        alert(`❌ Seeding failed: ${res.message}`);
                      }
                    } catch (err: any) {
                      setSeedingStatus('error');
                      alert(`❌ Seeding exception: ${err?.message || err}`);
                    }
                  }}
                  disabled={seedingStatus === 'loading' || !isSupabaseConfigured}
                  className={`flex items-center gap-2 font-sans font-bold text-xs py-2 px-4 rounded-xl shadow transition-all select-none cursor-pointer ${
                    !isSupabaseConfigured
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : seedingStatus === 'loading'
                      ? 'bg-amber-400 text-white animate-pulse'
                      : 'bg-[#D4AF37] hover:bg-[#7A0C1E] text-white hover:text-[#D4AF37]'
                  }`}
                >
                  📥 {seedingStatus === 'loading' ? 'Seeding...' : 'Seed Supabase Data'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 border-t border-gray-200/60 pt-6">
              {/* Seeding products metric */}
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <div className="text-xs font-mono font-semibold text-gray-500 uppercase">Products Table Status</div>
                <div className="text-2xl font-sans font-black text-gray-800 mt-1 flex items-center gap-2">
                  {products.length} <span className="text-xs font-normal text-gray-500">records loaded</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                  Loaded products include name, description, category, price, image, and stock. Fetching matches the `products` table perfectly.
                </p>
              </div>

              {/* Seeding orders metric */}
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <div className="text-xs font-mono font-semibold text-gray-500 uppercase">Orders Table Status</div>
                <div className="text-2xl font-sans font-black text-gray-800 mt-1 flex items-center gap-2">
                  {orders.length} <span className="text-xs font-normal text-gray-500">records found</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                  Orders contain phone, billing address, final total, status, and created timestamp linked to respective database entries.
                </p>
              </div>

              {/* Seeding status details */}
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <div className="text-xs font-mono font-semibold text-gray-500 uppercase">Database Source Mode</div>
                <div className="text-sm font-sans font-extrabold text-[#7A0C1E] mt-1.5 flex items-center gap-1.5">
                  🛡️ {isSupabaseConfigured ? 'Supabase cloud-sync active' : 'Offline sandbox mode active'}
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                  {isSupabaseConfigured 
                    ? 'All transactions, products, review comments, and orders are writing and reading instantly from Cloud PostgreSQL containers.' 
                    : 'System is running on localized sandbox memory because API key details are still pending setting up in your workspace.'}
                </p>
              </div>
            </div>

            {/* Seeded orders table drill down */}
            {orders.length > 0 && (
              <div className="mt-5 bg-white border border-gray-150 p-4 rounded-xl shadow-sm overflow-hidden">
                <h4 className="font-sans font-bold text-xs text-gray-700 uppercase tracking-wider mb-3">
                  📋 Live Order Entries in DB (Total: {orders.length})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-600 font-sans">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-mono text-[10px] uppercase">
                        <th className="py-2 px-3">Order ID</th>
                        <th className="py-2 px-3">Customer Name</th>
                        <th className="py-2 px-3">Phone</th>
                        <th className="py-2 px-3">Address</th>
                        <th className="py-2 px-3">Amount</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id || ord.orderId} className="hover:bg-gray-50/50">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#7A0C1E]">{ord.id || ord.orderId}</td>
                          <td className="py-2.5 px-3 font-semibold text-gray-800">{ord.customer_name || ord.customer?.fullName}</td>
                          <td className="py-2.5 px-3">{ord.phone || ord.customer?.phone}</td>
                          <td className="py-2.5 px-3 truncate max-w-xs">{ord.address || ord.customer?.address}</td>
                          <td className="py-2.5 px-3 font-bold text-[#7A0C1E]">₹{ord.total_amount || ord.total}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              ord.status === 'Delivered' 
                                ? 'bg-green-50 text-green-700' 
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Universal Footer Component */}
        <Footer setCurrentPage={handleNavigatePage} />

        {/* ================= STICKY BOTTOM NAVIGATION BAR ================= */}
        {/* Touch-optimized layout for mobile-first handholds, hidden on desktop/laptop screens */}
        <div
          id="sticky-bottom-tabbar"
          className="fixed bottom-0 left-0 right-0 max-w-[1240px] mx-auto bg-[#7A0C1E] border-t border-[#D4AF37]/40 shadow-[0_-4px_12px_rgba(0,0,0,0.15)] flex md:hidden justify-around py-2 px-3 z-30 select-none"
        >
          {[
            { id: 'home', label: 'Home', icon: <HomeIcon className="w-4.5 h-4.5" /> },
            { id: 'shop', label: 'Shop', icon: <ShoppingBag className="w-4.5 h-4.5" /> },
            { id: 'about', label: 'About', icon: <Info className="w-4.5 h-4.5" /> },
            { id: 'contact', label: 'Contact', icon: <Phone className="w-4.5 h-4.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleNavigatePage(tab.id as Page)}
              className={`flex flex-col items-center justify-center py-1 flex-1 cursor-pointer transition-all ${
                currentPage === tab.id
                  ? 'text-[#D4AF37] scale-105'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.id === 'shop' && totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#FF9933] text-white font-bold text-[8px] min-w-[12px] h-[12px] rounded-full flex items-center justify-center border border-[#7A0C1E]">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-sans font-bold tracking-wider mt-1">{tab.label}</span>
              {currentPage === tab.id && (
                <span className="w-1.5 h-1 bg-[#D4AF37] rounded-full mt-0.5"></span>
              )}
            </button>
          ))}
        </div>

        {/* Cart Slide-out Drawer Panel */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          userEmail={session.email}
          userName={session.name}
        />

        {/* Interactive Product Details Popup Modal */}
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          addToCart={addToCart}
          isLoggedIn={session.isLoggedIn}
          onLoginRedirect={() => {
            setSelectedProduct(null);
            handleNavigatePage('login');
          }}
        />

        {/* ================= FLOATING TOAST NOTIFICATION ================= */}
        {toastMessage && (
          <div
            id="floating-toast"
            className="fixed bottom-18 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-xs text-white border border-[#D4AF37]/35 py-2.5 px-4 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 animate-scale max-w-[320px] text-center"
          >
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
