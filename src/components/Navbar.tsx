import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, LogOut, Globe } from 'lucide-react';
import { Page, CartItem, UserSession } from '../types';
import { translate, Language } from '../lib/translations';
import { signInWithGoogle, signOutUser, isSupabaseConfigured } from '../lib/supabase';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  session: UserSession;
  handleLogout: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function Navbar({
  currentPage,
  setCurrentPage,
  cart,
  setIsCartOpen,
  session,
  handleLogout,
  language,
  setLanguage,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Monitor scroll state to shrink navbar slightly
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleGoogleSignIn = async () => {
    if (isSupabaseConfigured) {
      try {
        await signInWithGoogle();
      } catch (err) {
        console.error("Google sign-in error:", err);
      }
    } else {
      setCurrentPage('login');
    }
  };

  const navLinks: { id: Page; label: string }[] = [
    { id: 'home', label: translate('nav.home', language) },
    { id: 'about', label: translate('nav.about', language) },
    { id: 'shop', label: translate('nav.shop', language) },
    { id: 'combo', label: translate('nav.combo', language) },
    { id: 'bulk', label: translate('nav.bulk', language) },
    { id: 'track', label: translate('nav.track', language) },
    { id: 'contact', label: translate('nav.contact', language) },
  ];

  return (
    <nav
      id="main-navbar"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#7A0C1E] py-2.5 shadow-lg border-b border-[#D4AF37]/30'
          : 'bg-[#7A0C1E] py-4 border-b border-[#D4AF37]/10'
      } text-white`}
    >
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Left: Logo */}
        <button
          onClick={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 group cursor-pointer text-left select-none"
          id="navbar-logo-btn"
        >
          {/* Custom golden diya icon */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 group-hover:border-[#D4AF37] transition-all">
            <svg
              className="w-5 h-5 text-[#D4AF37]"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C12 2 15 5.5 15 8C15 10.5 13 12 12 12C11 12 9 10.5 9 8C9 5.5 12 2 12 2Z" fill="#FF9933" />
              <path d="M4 14C4 18.5 7.5 21 12 21C16.5 21 20 18.5 20 14C20 14 16 16 12 16C8 16 4 14 4 14Z" fill="#D4AF37" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#FF9933] rounded-full animate-ping"></span>
          </div>
          <div>
            <span className="font-sans font-bold text-lg leading-tight tracking-tight text-white block">
              Dharakshan <span className="text-[#D4AF37]">Cracker Store</span>
            </span>
            <span className="text-[9px] text-[#D4AF37]/80 block font-mono tracking-widest -mt-0.5">
              PREMIUM CRACKERS
            </span>
          </div>
        </button>

        {/* Center: Nav links - desktop only */}
        <div className="hidden md:flex items-center gap-6" id="navbar-desktop-menu">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentPage(link.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative font-sans text-sm font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                currentPage === link.id
                  ? 'text-[#D4AF37]'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {link.label}
              {currentPage === link.id && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#D4AF37] rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Right: Cart, Login, Hamburger */}
        <div className="flex items-center gap-3.5" id="navbar-actions">
          {/* Language Switcher Button */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-xs font-sans font-bold transition-all cursor-pointer text-[#D4AF37] hover:text-white"
            title="Change Language / மொழியை மாற்றவும்"
            id="language-toggle-btn"
          >
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-all cursor-pointer group"
            id="navbar-cart-btn"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#D4AF37] group-hover:scale-105 transition-transform" />
            {totalCartItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#FF9933] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border border-[#7A0C1E] animate-scale">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* User profile / Login */}
          {session.isLoggedIn ? (
            <div className="flex items-center gap-2" id="navbar-user-actions">
              <button
                onClick={() => setCurrentPage('contact')} // Go to contact/profile
                className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer text-xs animate-fade-in"
              >
                <div className="w-5 h-5 bg-[#D4AF37] text-[#7A0C1E] rounded-full flex items-center justify-center font-bold font-mono text-[10px]">
                  {session.name ? session.name[0].toUpperCase() : (session.email ? session.email[0].toUpperCase() : 'U')}
                </div>
                <span className="max-w-[110px] truncate text-white/90 font-semibold">
                  {session.name || session.email}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 px-3 py-1.5 rounded-full text-white/80 hover:text-red-300 transition-all cursor-pointer text-xs"
                id="navbar-logout-btn"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c29f2e] text-[#7A0C1E] hover:text-white font-sans font-extrabold text-xs px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 animate-fade-in"
              id="navbar-login-btn"
            >
              <User className="w-4 h-4" />
              <span>{isSupabaseConfigured ? 'Sign in with Google' : 'Login'}</span>
            </button>
          )}

          {/* Hamburger Menu - mobile only */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-white/10 transition-all cursor-pointer"
            id="navbar-hamburger-btn"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5.5 h-5.5 text-[#D4AF37]" />
            ) : (
              <Menu className="w-5.5 h-5.5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          id="navbar-mobile-drawer"
          className="md:hidden absolute top-full left-0 right-0 bg-[#7A0C1E] border-b border-[#D4AF37]/30 shadow-2xl py-4 px-6 flex flex-col gap-4 animate-slideDown z-50 max-w-[1240px] mx-auto border-x"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentPage(link.id);
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full text-left py-2 font-sans font-medium text-base flex items-center justify-between border-b border-white/5 transition-all ${
                currentPage === link.id ? 'text-[#D4AF37] pl-2' : 'text-white/90'
              }`}
            >
              <span>{link.label}</span>
              {currentPage === link.id && <span className="text-sm">✦</span>}
            </button>
          ))}

          {/* Mobile Language Selector */}
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-white/70 text-sm font-sans">Language / மொழி:</span>
            <button
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-[#D4AF37]/40 rounded-lg text-xs font-sans font-bold text-[#D4AF37]"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'தமிழ் (Tamil)' : 'English'}</span>
            </button>
          </div>

          {session.isLoggedIn ? (
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 mt-2 animate-fade-in">
              <div className="w-8 h-8 bg-[#D4AF37] text-[#7A0C1E] rounded-full flex items-center justify-center font-bold text-sm">
                {session.name ? session.name[0].toUpperCase() : (session.email ? session.email[0].toUpperCase() : 'U')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white">{session.name || session.email}</p>
                {session.email && <p className="text-[10px] text-white/50 truncate font-mono">{session.email}</p>}
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs bg-red-950/40 text-red-300 hover:text-red-100 px-2.5 py-1.5 rounded-lg border border-red-900/30 font-semibold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="mt-2 animate-fade-in">
              <button
                onClick={() => {
                  handleGoogleSignIn();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 bg-[#D4AF37] hover:bg-[#c29f2e] text-[#7A0C1E] hover:text-white font-sans font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>{isSupabaseConfigured ? 'Sign in with Google' : 'Login'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
