import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Flame, Info, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { getItemUnitPrice, getItemTotalPrice, BULK_THRESHOLD, BULK_DISCOUNT_PERCENT } from '../lib/pricing';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  addToCart: (product: Product, quantity: number) => void;
  isLoggedIn: boolean;
  onLoginRedirect: () => void;
}

export default function ProductQuickView({
  product,
  onClose,
  addToCart,
  isLoggedIn,
  onLoginRedirect,
}: ProductQuickViewProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCartClick = () => {
    addToCart(product, quantity);
    onClose();
  };

  // Wholesale/bulk pricing calculations
  const unitPrice = getItemUnitPrice(product, quantity);
  const totalPrice = getItemTotalPrice(product, quantity);
  const isBulkApplied = quantity >= BULK_THRESHOLD;

  // WhatsApp enquiry handler
  const handleWhatsAppEnquiry = () => {
    const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '918668045519';
    const message = encodeURIComponent(`Hello Dharakshan Cracker Store, I would like to enquire about: ${product.name} (Qty: ${quantity}). Unit Price: ₹${unitPrice}, Total: ₹${totalPrice}. Please share availability.`);
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden" id="quickview-modal-overlay">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      ></div>

      {/* Modal Dialog Content */}
      <div
        className="relative bg-[#FFF8F0] rounded-3xl overflow-hidden max-w-[480px] sm:max-w-xl w-full border border-[#D4AF37]/35 shadow-2xl flex flex-col z-10 animate-scale"
        id="quickview-modal-content"
      >
        {/* Header banner */}
        <div className="bg-[#7A0C1E] text-white py-3.5 px-5 flex items-center justify-between border-b border-[#D4AF37]/30">
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest font-mono">
            Festive Product Showcase
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
            aria-label="Close Product Details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto max-h-[75vh] space-y-4 text-left">
          {/* Main Visual Image */}
          <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={product.image}
              alt={`${product.name} - ${product.description}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
              <span className="bg-[#7A0C1E] text-[#D4AF37] text-[9px] font-bold py-0.5 px-2 rounded-full shadow-md uppercase">
                {product.brand}
              </span>
              <span className="bg-[#FF9933]/90 text-white text-[9px] font-medium py-0.5 px-2 rounded-full shadow-md uppercase">
                {product.safetyRating}
              </span>
            </div>
          </div>

          {/* Title & Brand */}
          <div className="space-y-1.5">
            <h3 className="font-sans font-extrabold text-lg text-slate-800 leading-snug">
              {product.name}
            </h3>
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-dashed border-slate-200">
              <span className="text-slate-400">Manufactured by: <b>{product.brand}</b></span>
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-mono">{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewCount} Reviews)</span>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#D4AF37]/15 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Special Deepavali Offer</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-extrabold text-[#7A0C1E] font-mono">
                    ₹{unitPrice}
                  </span>
                  {(product.originalPrice || isBulkApplied) && (
                    <span className="text-sm text-slate-400 line-through font-mono">
                      ₹{isBulkApplied ? product.price : product.originalPrice}
                    </span>
                  )}
                  {isBulkApplied ? (
                    <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded ml-1">
                      {BULK_DISCOUNT_PERCENT}% Bulk Savings Applied!
                    </span>
                  ) : product.originalPrice ? (
                    <span className="text-[10px] text-emerald-600 font-bold ml-1">
                      Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  ) : null}
                </div>
              </div>
              
              {/* Decibel / Sound Indicator */}
              {product.soundLevel && (
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Noise Level</span>
                  <span className={`text-[11px] font-bold py-0.5 px-2 rounded-full inline-block mt-1 ${
                    product.soundLevel === 'Silent' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    product.soundLevel === 'Low' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    product.soundLevel === 'Medium' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    {product.soundLevel}
                  </span>
                </div>
              )}
            </div>

            {/* Wholesale Pricing Banner */}
            <div className="bg-[#7A0C1E]/5 rounded-xl p-2 text-[10.5px] border border-[#7A0C1E]/10 text-[#7A0C1E] flex items-center gap-1.5 font-medium">
              <span className="text-base">💡</span>
              <span>
                <b>Wholesale Discount:</b> Buy {BULK_THRESHOLD}+ units of this product to get <b>{BULK_DISCOUNT_PERCENT}% OFF</b> automatically! (Only ₹{Math.round(product.price * (1 - BULK_DISCOUNT_PERCENT / 100))} each)
              </span>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-1.5 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#7A0C1E]" />
              <span>Product Specifications & Safety</span>
            </h4>
            <p className="leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
              {product.description}
            </p>
          </div>

          {/* Safety Checklist widget */}
          <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 flex gap-2 text-[10.5px] text-amber-900">
            <ShieldCheck className="w-5 h-5 text-[#FF9933] flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h5 className="font-bold">PESO Form-24 Green Cracker Seal</h5>
              <p className="mt-0.5 leading-relaxed">
                Contains zero barium chemicals. Built with proprietary magnesium compounds resulting in significantly lower smoke and beautiful sparkling retention.
              </p>
            </div>
          </div>

          {/* Cart Actions */}
          <div className="pt-2 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden h-11 shadow-xs">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-3 hover:bg-slate-100 active:bg-slate-200 text-slate-600 font-bold transition-all"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-bold text-slate-800 font-mono w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="px-3 hover:bg-slate-100 active:bg-slate-200 text-slate-600 font-bold transition-all"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCartClick}
                    className="flex-1 bg-[#7A0C1E] hover:bg-[#911327] text-[#D4AF37] hover:text-white font-sans font-bold text-xs sm:text-sm h-11 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add ₹{totalPrice} to Festive Bag</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={onLoginRedirect}
                  className="w-full bg-[#7A0C1E] hover:bg-[#911327] text-[#D4AF37] hover:text-white font-sans font-bold text-xs sm:text-sm h-11 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Login & Add to Cart (₹{totalPrice})</span>
                </button>
              )}
            </div>

            {/* WhatsApp Enquiry Button */}
            <button
              onClick={handleWhatsAppEnquiry}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs sm:text-sm h-11 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-4.5 h-4.5 fill-current" />
              <span>Enquire on WhatsApp (Qty: {quantity})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
