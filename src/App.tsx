import React, { useState, useEffect } from 'react';
import { Page, CartItem, UserSession, Product } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductQuickView from './components/ProductQuickView';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Tracking from './pages/Tracking';

// Lucide Icons for Sticky Bottom Bar
import { Home as HomeIcon, ShoppingBag, Info, Phone, MessageSquare, Package } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
            />
          )}

          {currentPage === 'about' && <About />}

          {currentPage === 'shop' && (
            <Shop
              searchFilters={searchFilters}
              setSearchFilters={setSearchFilters}
              addToCart={addToCart}
              setSelectedProduct={setSelectedProduct}
              isLoggedIn={session.isLoggedIn}
              setCurrentPage={handleNavigatePage}
            />
          )}

          {currentPage === 'login' && (
            <Login handleLoginSuccess={handleLoginSuccess} />
          )}

          {currentPage === 'contact' && <Contact />}

          {currentPage === 'tracking' && <Tracking />}
        </main>

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
            { id: 'tracking', label: 'Track', icon: <Package className="w-4.5 h-4.5" /> },
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
