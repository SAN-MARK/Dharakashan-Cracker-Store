import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, CheckCircle, Flame, ShieldAlert, ShoppingBag, MessageCircle } from 'lucide-react';
import { CartItem, Product } from '../types';
import { getItemUnitPrice, getItemTotalPrice } from '../lib/pricing';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  userEmail: string | null;
  userName: string | null;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeFromCart,
  clearCart,
  userEmail,
  userName,
}: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'success'>('cart');
  
  // Checkout Form State
  const [fullName, setFullName] = useState(userName || '');
  const [email, setEmail] = useState(userEmail || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('2026-11-01'); // Safe pre-diwali shipping dates
  const [paymentMode, setPaymentMode] = useState<'cod' | 'online'>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((total, item) => total + getItemTotalPrice(item.product, item.quantity), 0);
  const discount = cart.reduce((total, item) => {
    const basePrice = item.product.originalPrice || item.product.price;
    const actualPrice = getItemUnitPrice(item.product, item.quantity);
    return total + (basePrice - actualPrice) * item.quantity;
  }, 0);
  const shipping = subtotal > 1000 ? 0 : subtotal === 0 ? 0 : 150;
  const finalTotal = subtotal + shipping;

  const handleWhatsAppCartEnquiry = () => {
    const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919840012345';
    const itemsList = cart.map(item => {
      const unitPrice = getItemUnitPrice(item.product, item.quantity);
      const totalItemPrice = unitPrice * item.quantity;
      const isWholesale = item.quantity >= 10 ? ' (Wholesale Apply)' : '';
      return `- ${item.quantity}x ${item.product.name} (₹${totalItemPrice}${isWholesale})`;
    }).join('\n');

    const message = encodeURIComponent(
      `Hello Dharakshan Cracker Store,\n\nI am interested in placing an enquiry for the following crackers in my bag:\n\n${itemsList}\n\n*Cart Total:* ₹${subtotal}\n*Delivery Fee:* ${shipping === 0 ? 'Free' : `₹${shipping}`}\n*Grand Total:* ₹${finalTotal}\n\nPlease confirm stock availability and custom packaging delivery.`
    );
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
  };

  const submitOrderToSheet = async (customerId: string) => {
    // Submit each cart item individually to Sheet.best
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      const sn = `P${String(i + 1).padStart(3, '0')}`;
      
      // Calculate item discount percentage
      const discountPercent = item.product.originalPrice
        ? Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)
        : 0;

      const orderData = {
        "S/N": sn,
        "Full Name": fullName || "",
        "Email": email || "",
        "Contact Number": phone || "",
        "Delivery & Billing Address *": address || "",
        "Preferred Delivery Date": deliveryDate || "",
        "Product Name": item.quantity > 1 ? `${item.product.name} (Qty: ${item.quantity})` : item.product.name,
        "Category": item.product.category || "General",
        "Price (INR)": item.product.price || 0,
        "Original Price (INR)": item.product.originalPrice || item.product.price || 0,
        "Discount %": discountPercent,
        "Total Price": finalTotal || 0,
        "Customer ID": customerId
      };

      // Output exact payload as required for verification
      console.log("Submitting order payload to Sheet.best:", JSON.stringify(orderData));

      const response = await fetch('https://api.sheetbest.com/sheets/38f7b6d0-0cfe-405c-be6a-51bd77c8973b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit item: ${item.product.name}`);
      }
    }

    // Create persistent record in LocalStorage for durability/logs
    const orderRecord = {
      orderId: customerId,
      timestamp: new Date().toISOString(),
      customer: { fullName, email, phone, address, deliveryDate },
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: finalTotal,
      status: 'Confirmed',
    };

    const existingOrders = JSON.parse(localStorage.getItem('sparkle_orders') || '[]');
    existingOrders.unshift(orderRecord);
    localStorage.setItem('sparkle_orders', JSON.stringify(existingOrders));

    // Clear the main application cart state
    clearCart();
    setCheckoutStep('success');
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !address) {
      alert('Please fill out all required fields.');
      return;
    }

    // Use Math.random().toString(36).substr(2, 9) to generate a unique "Customer ID"
    const generatedCustomerId = Math.random().toString(36).substr(2, 9);
    setOrderId(generatedCustomerId);

    if (paymentMode === 'cod') {
      setSubmitting(true);
      try {
        alert("Order Confirmed via COD");
        await submitOrderToSheet(generatedCustomerId);
      } catch (err) {
        console.error('Checkout error:', err);
        alert('There was an issue processing your order with our spreadsheet system. Please try again or contact support.');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Online payment via Razorpay
      setSubmitting(true);
      try {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          alert("Failed to load Razorpay SDK. Please check your network connection or choose COD.");
          setSubmitting(false);
          return;
        }

        const options = {
          key: "rzp_test_T8Y0m2O70kOqYf",
          amount: finalTotal * 100, // in paise
          currency: "INR",
          name: "Dharakshan Cracker Store",
          description: "Festive Fireworks Order",
          handler: async function (response: any) {
            try {
              alert("Payment Successful, Order Placed");
              await submitOrderToSheet(generatedCustomerId);
            } catch (err) {
              console.error('Error submitting order post-payment:', err);
              alert('Payment succeeded, but there was an issue saving your order. Please contact support with Customer ID: ' + generatedCustomerId);
            }
          },
          prefill: {
            name: fullName,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#7A0C1E",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          alert("Payment failed: " + resp.error.description);
        });
        rzp.open();
        setSubmitting(false);
      } catch (err) {
        console.error('Razorpay initialization error:', err);
        alert('Failed to initialize online payment modal. Please try again or choose COD.');
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" id="cart-drawer-overlay">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      ></div>

      {/* Cart Panel */}
      <div
        className="relative w-full max-w-[480px] h-full bg-[#FFF8F0] shadow-2xl flex flex-col z-10 animate-slideLeft border-l border-[#D4AF37]/30"
        id="cart-drawer-panel"
      >
        {/* Header */}
        <div className="bg-[#7A0C1E] text-white py-4 px-5 flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-sans font-bold text-lg">Your Festive Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
            aria-label="Close Cart"
          >
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {checkoutStep === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4" id="empty-cart-state">
                  <div className="w-16 h-16 bg-[#7A0C1E]/5 rounded-full flex items-center justify-center text-[#D4AF37] mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-sans font-bold text-lg text-slate-800">Your cart is empty</h3>
                  <p className="text-sm text-slate-500 max-w-xs mt-2">
                    Looks like you haven't added any premium crackers yet. Light up your celebrations today!
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 bg-[#7A0C1E] hover:bg-[#911327] text-[#D4AF37] font-semibold text-sm py-2.5 px-6 rounded-full shadow-md transition-all cursor-pointer"
                  >
                    Explore Crackers
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cart Items List */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="bg-white rounded-xl p-3 border border-[#D4AF37]/15 shadow-xs flex gap-3 transition-all hover:border-[#D4AF37]/30"
                      >
                        {/* Image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#7A0C1E]/5 flex-shrink-0 border border-slate-100">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                              {item.product.name}
                            </h4>
                            <p className="text-[10px] text-emerald-700 font-medium tracking-wide mt-0.5">
                              {item.product.safetyRating}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Adjuster */}
                            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden h-7">
                              <button
                                onClick={() => updateQuantity(item.product.id, -1)}
                                className="px-2 py-0.5 hover:bg-slate-200 active:bg-slate-300 transition-all text-slate-600 font-bold"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-bold text-slate-800 font-mono">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, 1)}
                                className="px-2 py-0.5 hover:bg-slate-200 active:bg-slate-300 transition-all text-slate-600 font-bold"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price / Delete */}
                            <div className="flex items-center gap-2.5">
                              <div className="text-right">
                                <span className="text-xs font-bold text-[#7A0C1E] block font-mono">
                                  ₹{getItemTotalPrice(item.product, item.quantity)}
                                </span>
                                {item.quantity >= 10 && (
                                  <span className="text-[9px] text-emerald-600 font-extrabold block">
                                    15% Wholesale Apply
                                  </span>
                                )}
                                {(item.product.originalPrice || item.quantity >= 10) && (
                                  <span className="text-[9px] text-slate-400 line-through block font-mono">
                                    ₹{(item.product.originalPrice || item.product.price) * item.quantity}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-all cursor-pointer"
                                aria-label="Delete item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="bg-white rounded-xl p-4 border border-[#D4AF37]/20 shadow-sm mt-6 space-y-2.5">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Bag Subtotal</span>
                      <span className="font-mono font-medium">₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-xs text-emerald-600 font-medium">
                        <span>Festival Discount</span>
                        <span className="font-mono">-₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-slate-600 pb-2 border-b border-dashed border-slate-200">
                      <span>Delivery Fee</span>
                      <span className="font-mono">
                        {shipping === 0 ? (
                          <span className="text-emerald-600 font-semibold uppercase">Free Delivery</span>
                        ) : (
                          `₹${shipping}`
                        )}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-[10px] text-amber-700 italic bg-amber-50 px-2 py-1.5 rounded-lg">
                        Add ₹{1000 - subtotal} more of crackers to unlock <b>Free Delivery</b>!
                      </p>
                    )}
                    <div className="flex justify-between text-sm font-bold text-slate-800 pt-1">
                      <span>Total Price</span>
                      <span className="font-mono text-[#7A0C1E]">₹{finalTotal}</span>
                    </div>
                  </div>

                  {/* Safety Advice Banner */}
                  <div className="bg-[#7A0C1E]/5 rounded-xl p-3 border border-[#7A0C1E]/10 flex gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-[#FF9933] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-[11px] font-bold text-[#7A0C1E]">Diwali Safe Delivery Notice</h5>
                      <p className="text-[10px] text-slate-600 leading-relaxed mt-0.5">
                        We deliver in heavy fireproof packing containers with certified PESO safety handling tags. Safe, legal, and hassle-free.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {checkoutStep === 'details' && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4" id="checkout-details-form">
              <h3 className="font-sans font-bold text-base text-slate-800 border-b pb-2">
                Festive Shipping Coordinates
              </h3>

              <div className="space-y-3 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7A0C1E] focus:ring-1 focus:ring-[#7A0C1E] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7A0C1E] focus:ring-1 focus:ring-[#7A0C1E] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7A0C1E] focus:ring-1 focus:ring-[#7A0C1E] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery & Billing Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat/House No, Street, Landmark, Pincode, City"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7A0C1E] focus:ring-1 focus:ring-[#7A0C1E] transition-all resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Delivery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min="2026-10-25"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7A0C1E] focus:ring-1 focus:ring-[#7A0C1E] transition-all"
                  />
                  <p className="text-[9px] text-slate-500 mt-1">
                    * Deliveries are timed carefully before Diwali (November 2026) to respect local municipal safety timings.
                  </p>
                </div>

                {/* Payment Mode Selection */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Payment Mode *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${paymentMode === 'cod' ? 'border-[#7A0C1E] bg-[#7A0C1E]/5' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                      <input
                        type="radio"
                        id="payment-cod"
                        name="payment-mode"
                        value="cod"
                        checked={paymentMode === 'cod'}
                        onChange={() => setPaymentMode('cod')}
                        className="w-4 h-4 text-[#7A0C1E] focus:ring-[#7A0C1E]"
                      />
                      <div className="text-left">
                        <span className="block text-xs font-bold text-slate-800">COD</span>
                        <span className="block text-[9px] text-slate-500">Pay cash or UPI at delivery</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${paymentMode === 'online' ? 'border-[#7A0C1E] bg-[#7A0C1E]/5' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                      <input
                        type="radio"
                        id="payment-online"
                        name="payment-mode"
                        value="online"
                        checked={paymentMode === 'online'}
                        onChange={() => setPaymentMode('online')}
                        className="w-4 h-4 text-[#7A0C1E] focus:ring-[#7A0C1E]"
                      />
                      <div className="text-left">
                        <span className="block text-xs font-bold text-slate-800">Online</span>
                        <span className="block text-[9px] text-slate-500">Card, UPI, Netbanking</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Order Summary Miniature */}
              <div className="bg-[#7A0C1E]/5 rounded-xl p-3 border border-[#7A0C1E]/10 space-y-1.5 mt-4">
                <div className="flex justify-between text-xs text-slate-700 font-semibold">
                  <span>Grand Total Payable</span>
                  <span className="text-[#7A0C1E] font-mono font-bold">₹{finalTotal}</span>
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  Payment Mode: <b>{paymentMode === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (Razorpay)'}</b>. Fully compliant with regional firework transportation policies.
                </p>
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="flex-1 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold py-3 rounded-xl transition-all cursor-pointer"
                >
                  Back to Bag
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#7A0C1E] hover:bg-[#911327] text-[#D4AF37] text-xs font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span>{paymentMode === 'cod' ? 'Confirm Order (COD)' : 'Pay Now & Confirm'}</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {checkoutStep === 'success' && (
            <div className="h-full flex flex-col items-center justify-center text-center py-10 px-4" id="checkout-success-state">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-5 animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="font-sans font-bold text-xl text-slate-800">
                Shubh Deepavali! 🎉
              </h3>
              <p className="text-sm font-semibold text-[#7A0C1E] mt-1">
                Order Placed Successfully!
              </p>
              <div className="bg-white rounded-xl p-4 border border-[#D4AF37]/20 shadow-xs my-5 w-full space-y-2.5 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono font-bold text-slate-800">{orderId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Receiver Name:</span>
                  <span className="font-semibold text-slate-800">{fullName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Deliver To:</span>
                  <span className="text-slate-800 truncate max-w-[180px] font-medium">{address}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Delivery Date:</span>
                  <span className="text-slate-800 font-bold">{deliveryDate}</span>
                </div>
                <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg leading-relaxed mt-2 text-center">
                  🔥 Our dispatch hub will reach out to you within 3 hours on <b>{phone}</b> to confirm dispatch and route timings.
                </p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Thank you for choosing <b>Dharakshan Cracker Store</b> for your family celebrations. Stay safe and enjoy!
              </p>
              <button
                onClick={() => {
                  setCheckoutStep('cart');
                  onClose();
                }}
                className="bg-[#7A0C1E] hover:bg-[#911327] text-[#D4AF37] font-bold text-xs py-3 px-8 rounded-full shadow-md transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer actions for initial cart view */}
        {checkoutStep === 'cart' && cart.length > 0 && (
          <div className="bg-white border-t border-slate-200 p-5 space-y-3 shadow-lg text-left">
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>Items Total:</span>
              <span className="font-mono font-bold text-slate-800 text-sm">₹{subtotal}</span>
            </div>
            
            {/* WhatsApp Enquiry Button */}
            <button
              onClick={handleWhatsAppCartEnquiry}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>📩 Enquire Cart on WhatsApp</span>
            </button>

            <div className="flex gap-2.5">
              <button
                onClick={clearCart}
                className="border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-red-600 p-3 rounded-xl transition-all cursor-pointer"
                title="Clear all cart items"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCheckoutStep('details')}
                className="flex-1 bg-[#7A0C1E] hover:bg-[#911327] text-[#D4AF37] font-sans font-bold text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
              >
                <span>Proceed to Delivery</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
