import React, { useState } from 'react';
import { Gift, Plus, Minus, ShoppingBag, Info, Check, Package, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { getItemUnitPrice } from '../lib/pricing';

interface ComboBuilderProps {
  addToCart: (product: Product, quantity: number) => void;
  isLoggedIn: boolean;
  setCurrentPage: (page: any) => void;
}

const BOX_OPTIONS = [
  { id: 'box-medium', name: 'Deepavali Sparkle Box', price: 150, description: 'Durable, high-finish eco cardboard box with decorative golden prints.', capacity: 'Holds up to 15 items' },
  { id: 'box-large', name: 'Sivakasi Elite Wooden Chest', price: 299, description: 'Handcrafted wooden box with classic brass-style latches & velvet padding.', capacity: 'Holds up to 30 items' },
  { id: 'box-grand', name: 'Royal Emperor Gold Box', price: 499, description: 'Heavy, royal metal-accented keepsake box with gold-foil embossed greetings.', capacity: 'Holds up to 50 items' }
];

export default function ComboBuilder({ addToCart, isLoggedIn, setCurrentPage }: ComboBuilderProps) {
  const [selectedBox, setSelectedBox] = useState(BOX_OPTIONS[0]);
  const [comboName, setComboName] = useState("My Festive Dhamaka");
  const [selectedItems, setSelectedItems] = useState<{ [productId: string]: number }>({});

  // Filter out other pre-made combos to show only individual items
  const buildableProducts = PRODUCTS.filter(p => p.category !== 'combos');

  const handleUpdateQty = (productId: string, delta: number) => {
    setSelectedItems(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[productId];
      } else {
        updated[productId] = next;
      }
      return updated;
    });
  };

  // Calculate Running Totals
  const itemsTotal = Object.entries(selectedItems).reduce((sum, [id, qtyVal]) => {
    const qty = qtyVal as number;
    const prod = PRODUCTS.find(p => p.id === id);
    if (!prod) return sum;
    // Apply wholesale bulk pricing if qty >= 10
    const unitPrice = getItemUnitPrice(prod, qty);
    return sum + (unitPrice * qty);
  }, 0);

  const itemsOriginalTotal = Object.entries(selectedItems).reduce((sum, [id, qtyVal]) => {
    const qty = qtyVal as number;
    const prod = PRODUCTS.find(p => p.id === id);
    if (!prod) return sum;
    return sum + ((prod.originalPrice || prod.price) * qty);
  }, 0);

  const finalTotal = itemsTotal + selectedBox.price;
  const originalTotal = itemsOriginalTotal + selectedBox.price;
  const totalItemsCount = Object.values(selectedItems).reduce<number>((sum, q) => sum + (q as number), 0);

  const handleAddComboToCart = () => {
    if (totalItemsCount === 0) {
      alert("Please add at least one cracker to your custom gift box combo!");
      return;
    }

    // List out items for the description
    const itemStrings: string[] = [];
    Object.entries(selectedItems).forEach(([id, qtyVal]) => {
      const qty = qtyVal as number;
      const prod = PRODUCTS.find(p => p.id === id);
      if (prod) {
        itemStrings.push(`${qty}x ${prod.name}`);
      }
    });

    const comboDescription = `Hand-picked Custom Gift Combo in "${selectedBox.name}" engraved with label "${comboName}". Includes: ${itemStrings.join(', ')}.`;

    // Create custom product
    const customComboProduct: Product = {
      id: `custom-combo-${Date.now()}`,
      name: `🎁 Combo: ${comboName}`,
      category: 'combos',
      price: finalTotal,
      originalPrice: originalTotal > finalTotal ? originalTotal : undefined,
      rating: 5.0,
      reviewCount: 1,
      image: PRODUCTS.find(p => p.id === 'p11')?.image || '', // Fallback to premium combo box image
      description: comboDescription,
      isBestSeller: false,
      safetyRating: 'PESO Approved Box',
      brand: 'Dharakshan Custom',
      soundLevel: 'Medium'
    };

    addToCart(customComboProduct, 1);
    alert(`Successfully customized "${comboName}"! Added to your Festive Bag.`);
    setCurrentPage('shop');
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8 md:px-8 bg-[#FFF8F0]" id="combo-builder-root">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 bg-[#7A0C1E]/5 px-3 py-1.5 rounded-full border border-[#7A0C1E]/15 text-[#7A0C1E] font-bold text-xs uppercase mb-3.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Interactive Diwali Crafting</span>
        </div>
        <h1 className="font-sans font-black text-3xl md:text-4xl text-slate-800 tracking-tight leading-none">
          Build Your Own <span className="text-[#7A0C1E]">Festive Combo</span>
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-2.5 leading-relaxed">
          Create a personalized gift chest box with custom crackers! Add products below, choose a custom luxury box style, and name your celebration kit. Wholesale discounts are applied automatically!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Product Selection Grid */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Personalize Title & Choose Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-xs space-y-4">
            <h3 className="font-sans font-extrabold text-base text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-[#7A0C1E] text-white flex items-center justify-center font-bold text-xs font-mono">1</span>
              <span>Name & Customize Your Chest</span>
            </h3>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">Engraved Name Plate Label</label>
              <input
                type="text"
                value={comboName}
                onChange={(e) => setComboName(e.target.value)}
                maxLength={30}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#7A0C1E] rounded-xl py-2 px-3.5 text-xs font-semibold text-slate-800 focus:outline-hidden transition-all"
                placeholder="e.g., Happy Diwali From Sharma Family"
              />
              <p className="text-[10px] text-slate-400">Custom metal engraving printed directly on your select box lid free-of-charge.</p>
            </div>

            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-slate-600">Choose Gift Box Packaging Style</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {BOX_OPTIONS.map((box) => (
                  <button
                    key={box.id}
                    onClick={() => setSelectedBox(box)}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-full cursor-pointer transition-all select-none ${
                      selectedBox.id === box.id
                        ? 'border-[#7A0C1E] bg-[#7A0C1E]/5 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-800 leading-tight block">{box.name}</span>
                        {selectedBox.id === box.id && (
                          <div className="w-4 h-4 rounded-full bg-[#7A0C1E] text-[#D4AF37] flex items-center justify-center text-[8px] font-bold">✓</div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block leading-normal">{box.description}</span>
                    </div>
                    <div className="mt-3.5 pt-2 border-t border-slate-100 flex items-baseline justify-between">
                      <span className="text-[9px] font-bold text-[#FF9933] font-mono">{box.capacity}</span>
                      <span className="text-sm font-black text-[#7A0C1E] font-mono">₹{box.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Choose Crackers */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-xs space-y-4">
            <h3 className="font-sans font-extrabold text-base text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-[#7A0C1E] text-white flex items-center justify-center font-bold text-xs font-mono">2</span>
              <span>Fill Box with Individual Crackers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {buildableProducts.map((product) => {
                const qtySelected = selectedItems[product.id] || 0;
                const unitPrice = getItemUnitPrice(product, qtySelected);
                const originalUnitPrice = product.price;

                return (
                  <div
                    key={product.id}
                    className={`p-3 rounded-xl border transition-all flex gap-3 items-center justify-between ${
                      qtySelected > 0
                        ? 'border-[#7A0C1E]/30 bg-[#7A0C1E]/2'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[11px] font-extrabold text-slate-800 leading-tight truncate">{product.name}</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-xs font-bold text-[#7A0C1E] font-mono">₹{unitPrice}</span>
                          {qtySelected >= 10 && (
                            <span className="text-[9px] text-slate-400 line-through font-mono">₹{originalUnitPrice}</span>
                          )}
                          <span className="text-[9px] text-slate-400 capitalize block truncate">({product.category})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden h-8 shadow-xs">
                      <button
                        onClick={() => handleUpdateQty(product.id, -1)}
                        className="px-2 hover:bg-slate-100 text-slate-600 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-1 text-xs font-bold text-slate-800 font-mono w-6 text-center">
                        {qtySelected}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(product.id, 1)}
                        className="px-2 hover:bg-slate-100 text-slate-600 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Combo Preview & Receipt */}
        <div className="lg:col-span-5">
          <div className="bg-[#7A0C1E]/95 border border-[#D4AF37]/45 text-white rounded-3xl p-5 shadow-xl sticky top-24 space-y-5">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <Package className="w-5 h-5 text-[#D4AF37]" />
              <div className="text-left">
                <h4 className="font-sans font-extrabold text-base tracking-tight text-[#D4AF37]">Box Summary</h4>
                <p className="text-[10px] text-white/60 -mt-0.5">Real-time live chest estimation</p>
              </div>
            </div>

            {/* Simulated Live Label Plate preview */}
            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded-xl p-3 text-center space-y-1 relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-radial from-transparent to-black/10 pointer-events-none"></div>
              <span className="text-[8px] font-bold text-[#D4AF37] tracking-widest uppercase block">Personalized Metal Label</span>
              <p className="text-sm font-sans font-black text-white italic truncate px-2">
                " {comboName || "My Celebration Box"} "
              </p>
            </div>

            {/* List of custom selected items */}
            <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
              <div className="flex justify-between text-[11px] font-bold text-[#D4AF37] border-b border-white/5 pb-1">
                <span>Selected Box / Crackers</span>
                <span>Subtotal</span>
              </div>

              <div className="flex justify-between text-[11px] text-white/95">
                <span className="truncate max-w-[200px]">{selectedBox.name} (Premium Base)</span>
                <span className="font-mono">₹{selectedBox.price}</span>
              </div>

              {Object.entries(selectedItems).map(([id, qtyVal]) => {
                const qty = qtyVal as number;
                const prod = PRODUCTS.find(p => p.id === id);
                if (!prod) return null;
                const unitPrice = getItemUnitPrice(prod, qty);
                return (
                  <div key={id} className="flex justify-between text-[11px] text-white/85">
                    <span className="truncate max-w-[200px]">
                      {qty}x {prod.name}
                      {qty >= 10 && <span className="text-[9px] font-semibold text-emerald-400 ml-1.5">(15% wholesale discount)</span>}
                    </span>
                    <span className="font-mono">₹{unitPrice * qty}</span>
                  </div>
                );
              })}

              {totalItemsCount === 0 && (
                <p className="text-center text-[11px] text-white/50 italic py-3">
                  Your custom box is currently empty. Add crackers using the selector on the left!
                </p>
              )}
            </div>

            {/* Pricing totals */}
            <div className="border-t border-white/10 pt-4 space-y-1.5">
              <div className="flex justify-between text-xs text-white/70">
                <span>Items Subtotal:</span>
                <span className="font-mono">₹{itemsTotal}</span>
              </div>
              <div className="flex justify-between text-xs text-white/70">
                <span>Selected Luxury Box:</span>
                <span className="font-mono">₹{selectedBox.price}</span>
              </div>
              {originalTotal > finalTotal && (
                <div className="flex justify-between text-xs text-emerald-400">
                  <span>Wholesale Discount Savings:</span>
                  <span className="font-mono">- ₹{originalTotal - finalTotal}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2.5 border-t border-white/15">
                <span className="text-sm font-extrabold text-[#D4AF37]">Total Value:</span>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-[#D4AF37]">₹{finalTotal}</span>
                  {originalTotal > finalTotal && (
                    <span className="text-[10px] text-slate-300 block line-through font-mono -mt-1">₹{originalTotal}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2">
              <button
                onClick={handleAddComboToCart}
                disabled={totalItemsCount === 0}
                className={`w-full font-sans font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  totalItemsCount > 0
                    ? 'bg-[#D4AF37] hover:bg-[#c29f2e] text-[#7A0C1E] active:scale-98 hover:shadow-xl'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Customized Combo to Bag (₹{finalTotal})</span>
              </button>
              
              <div className="flex gap-2 items-start mt-4 bg-black/20 p-3 rounded-xl border border-white/5 text-[10px] text-white/70 leading-relaxed">
                <Info className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <p>
                  Our system packs customized combination crates sequentially. Your custom engraved label is generated dynamically on our packaging floor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
