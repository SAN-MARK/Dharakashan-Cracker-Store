import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ShieldCheck, Heart } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  setCurrentPage: (page: Page) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setIsSubscribed(false), 4000);
  };

  return (
    <footer id="main-footer" className="bg-[#590512] text-[#FFF8F0]/90 border-t-2 border-[#D4AF37]/40">
      {/* Top Banner: Quick Safety Notice */}
      <div className="bg-[#7A0C1E] border-b border-[#D4AF37]/20 py-4 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-bold font-sans tracking-wide">
              PESO-Certified Safety Guidelines Compliant
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-[#FFF8F0]/70 max-w-lg">
            * Please follow local regulations and safety instructions when using firecrackers. Never ignite crackers indoors or hold them in hands while lighting.
          </p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[480px] sm:max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Column 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[#D4AF37]"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C12 2 15 5.5 15 8C15 10.5 13 12 12 12C11 12 9 10.5 9 8C9 5.5 12 2 12 2Z" fill="#FF9933" />
              <path d="M4 14C4 18.5 7.5 21 12 21C16.5 21 20 18.5 20 14C20 14 16 16 12 16C8 16 4 14 4 14Z" fill="#D4AF37" />
            </svg>
            <span className="font-sans font-bold text-lg text-white">
              Dharakshan <span className="text-[#D4AF37]">Cracker Store</span>
            </span>
          </div>
          <p className="text-xs text-[#FFF8F0]/70 leading-relaxed">
            Crafting beautiful memories since 1998. We offer high-quality, eco-friendly green crackers sourced directly from premium factories in Sivakasi. Safely shipped, legally certified.
          </p>
          <div className="space-y-2 pt-1 text-xs text-[#FFF8F0]/80">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-mono">+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-mono">contact@dharakashancrackers.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>45, Vandalur Main Road, Chengalpattu, TN</span>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-4 text-left">
          <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0 }); }}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
              >
                ✦ Home Page
              </button>
            </li>
            <li>
              <button
                onClick={() => { setCurrentPage('about'); window.scrollTo({ top: 0 }); }}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
              >
                ✦ About Our Heritage
              </button>
            </li>
            <li>
              <button
                onClick={() => { setCurrentPage('shop'); window.scrollTo({ top: 0 }); }}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
              >
                ✦ Shop Firecrackers
              </button>
            </li>
            <li>
              <button
                onClick={() => { setCurrentPage('contact'); window.scrollTo({ top: 0 }); }}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
              >
                ✦ Help & Support
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Categories & Support */}
        <div className="space-y-4 text-left">
          <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
            Categories & Safety
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => { setCurrentPage('shop'); window.scrollTo({ top: 0 }); }}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left text-white/80"
              >
                Sparklers & Flower Pots
              </button>
            </li>
            <li>
              <button
                onClick={() => { setCurrentPage('shop'); window.scrollTo({ top: 0 }); }}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left text-white/80"
              >
                Chakras & Sound Shells
              </button>
            </li>
            <li>
              <button
                onClick={() => { setCurrentPage('shop'); window.scrollTo({ top: 0 }); }}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left text-white/80"
              >
                Gift Boxes & Mega Hampers
              </button>
            </li>
            <li>
              <button
                onClick={() => { setCurrentPage('about'); window.scrollTo({ top: 0 }); }}
                className="hover:text-[#D4AF37] transition-colors text-left text-amber-300 font-semibold cursor-pointer block mt-1"
              >
                ⚠️ Safe Storage Guidelines
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter Signup */}
        <div className="space-y-4 text-left">
          <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
            Deepavali Blessings
          </h4>
          <p className="text-xs text-[#FFF8F0]/70 leading-relaxed">
            Subscribe to receive safe cracker guidelines, exclusive pre-booking discounts, and early bird coupons!
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37] focus:bg-white/15 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-[#D4AF37] hover:bg-white text-[#7A0C1E] px-2.5 rounded-md flex items-center justify-center transition-all cursor-pointer"
                aria-label="Subscribe"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {isSubscribed && (
              <p className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-1 rounded-md text-center">
                🎉 Subscribed! Check your inbox for a 15% code.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="border-t border-[#D4AF37]/20 py-4 px-6 text-center text-[11px] text-[#FFF8F0]/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Dharakshan Cracker Store. All rights reserved. Sourced from Sivakasi, Tamil Nadu.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-[#FF9933] fill-current" /> for a safer & brighter Deepavali.
          </p>
        </div>
      </div>
    </footer>
  );
}
