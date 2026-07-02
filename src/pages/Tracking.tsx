import React, { useState } from 'react';
import { Search, Loader2, Package, Calendar, MapPin, CheckCircle2, Clock, Truck, ShieldCheck, HelpCircle } from 'lucide-react';
import DecorativeBorder from '../components/DecorativeBorder';

interface OrderItem {
  "S/N": string;
  "Full Name": string;
  "Email": string;
  "Contact Number": string;
  "Delivery & Billing Address *": string;
  "Preferred Delivery Date": string;
  "Product Name": string;
  "Category": string;
  "Price (INR)": string | number;
  "Original Price (INR)": string | number;
  "Discount %": string | number;
  "Total Price": string | number;
  "Customer ID": string;
  "Status"?: string; // optional extra column
}

export default function Tracking() {
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = customerId.trim();
    if (!trimmedId) {
      alert('Please enter your Customer ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);
    setOrders([]);

    try {
      const response = await fetch('https://api.sheetbest.com/sheets/38f7b6d0-0cfe-405c-be6a-51bd77c8973b');
      if (!response.ok) {
        throw new Error('Failed to retrieve spreadsheet data. Please try again.');
      }
      
      const data: OrderItem[] = await response.json();
      
      // Filter rows where "Customer ID" matches the provided ID (case-insensitive and trimmed)
      const matchedOrders = data.filter(row => {
        const rowCustomerId = row["Customer ID"] ? String(row["Customer ID"]).trim().toLowerCase() : '';
        return rowCustomerId === trimmedId.toLowerCase();
      });

      setOrders(matchedOrders);
    } catch (err: any) {
      console.error('Tracking fetch error:', err);
      setError('Could not connect to the tracking server. Please check your internet connection or try again.');
    } finally {
      setLoading(false);
    }
  };

  // Extract shared customer information from matched items
  const mainOrder = orders.length > 0 ? orders[0] : null;
  const totalAmount = mainOrder ? mainOrder["Total Price"] : 0;
  
  // Determine order status gracefully
  // Fallback status flow: If delivery date is in November 2026, it is "Processing" (since local current time is 2026)
  const getStatus = (order: OrderItem) => {
    if (order.Status) return order.Status;
    
    // Custom heuristic based on the current local date (July 2026) and delivery date (November 2026)
    const delDateStr = order["Preferred Delivery Date"];
    if (!delDateStr) return 'Processing';
    
    try {
      const delivery = new Date(delDateStr);
      const current = new Date(); // 2026-07-02
      
      // If delivery is past by more than 2 days
      if (current.getTime() - delivery.getTime() > 172800000) {
        return 'Delivered';
      } else if (current.getTime() > delivery.getTime() - 259200000) {
        // Within 3 days of delivery
        return 'Shipped';
      }
    } catch (e) {
      // Ignore
    }
    return 'Processing';
  };

  const currentStatus = mainOrder ? getStatus(mainOrder) : 'Processing';

  return (
    <div className="w-full bg-[#FFF8F0] pb-16 text-left" id="tracking-page-container">
      {/* Banner / Header */}
      <div className="bg-[#7A0C1E] text-white py-12 px-6 text-center border-b border-[#D4AF37]/30">
        <div className="max-w-3xl mx-auto">
          <span className="text-[#D4AF37] text-xs font-mono font-bold tracking-widest uppercase block mb-1">
            DELIVERY STATUS TRACKER
          </span>
          <h1 className="font-sans font-extrabold text-2xl md:text-3xl text-white">
            Track Your Festive Order
          </h1>
          <p className="text-[#D4AF37]/90 text-xs sm:text-sm mt-2 max-w-lg mx-auto leading-relaxed">
            Input your Customer ID to instantly retrieve your pre-Diwali cracker dispatch status from our ledger.
          </p>
        </div>
      </div>

      <DecorativeBorder />

      {/* Track Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl border border-[#D4AF37]/20 shadow-xl p-6 sm:p-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter your Customer ID (e.g. c789abcde or CUST-123456)..."
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7A0C1E]/50 focus:border-[#7A0C1E] font-mono transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#7A0C1E] hover:bg-[#911327] text-[#D4AF37] hover:text-white font-sans font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Track Order</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Guidelines info */}
          {!searched && (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#7A0C1E]" />
                How to find your Customer ID?
              </h4>
              <ul className="text-xs text-slate-500 space-y-2.5 list-disc pl-4 leading-relaxed">
                <li>Your <b>Customer ID</b> is generated dynamically upon successfully completing the checkout process.</li>
                <li>If you checked out via Cash on Delivery or Razorpay, please check the <b>order confirmation screen</b> or refers to the <b>screenshot</b> you took when confirming your order.</li>
                <li>The ID typically looks like a random string of 9 alphanumeric characters (e.g., <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">z3h9jkd1o</code>).</li>
              </ul>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="mt-8 space-y-4 animate-pulse">
              <div className="h-6 bg-slate-100 rounded-lg w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-20 bg-slate-100 rounded-xl"></div>
                <div className="h-20 bg-slate-100 rounded-xl"></div>
                <div className="h-20 bg-slate-100 rounded-xl"></div>
              </div>
              <div className="h-40 bg-slate-100 rounded-xl"></div>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-4 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {/* No results */}
          {searched && !loading && !error && orders.length === 0 && (
            <div className="mt-8 text-center py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-sans font-bold text-slate-800 text-base">No Orders Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                We couldn't locate any order matches for Customer ID <span className="font-mono font-bold text-slate-700">"{customerId}"</span> in our dispatch spreadsheet. Please check the spelling or spacing and try again.
              </p>
            </div>
          )}

          {/* Results Display */}
          {searched && !loading && !error && mainOrder && (
            <div className="mt-8 space-y-6">
              {/* Header Status Bar */}
              <div className="bg-[#7A0C1E]/5 border border-[#7A0C1E]/15 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-mono text-[#7A0C1E] uppercase tracking-wider block font-bold">
                    Tracking Ledger Status
                  </span>
                  <h3 className="font-mono text-base font-bold text-slate-800 mt-0.5">
                    ID: <span className="text-[#7A0C1E]">{mainOrder["Customer ID"]}</span>
                  </h3>
                </div>
                
                {/* Visual Pill Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Current Status:</span>
                  <div className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-sans flex items-center gap-1.5 ${
                    currentStatus === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : currentStatus === 'Shipped'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {currentStatus === 'Delivered' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {currentStatus === 'Shipped' && <Truck className="w-3.5 h-3.5" />}
                    {currentStatus === 'Processing' && <Clock className="w-3.5 h-3.5" />}
                    {currentStatus}
                  </div>
                </div>
              </div>

              {/* Status Stepper Tracker */}
              <div className="grid grid-cols-3 gap-2 relative py-4 px-2">
                {/* Background Line */}
                <div className="absolute top-1/2 left-[15%] right-[15%] h-1 bg-slate-200 -translate-y-1/2 z-0" />
                
                {/* Colored Line Fill based on Status */}
                <div className={`absolute top-1/2 left-[15%] h-1 bg-[#7A0C1E] -translate-y-1/2 z-0 transition-all duration-500 ${
                  currentStatus === 'Delivered' ? 'w-[70%]' : currentStatus === 'Shipped' ? 'w-[35%]' : 'w-0'
                }`} />

                {/* Step 1: Processing */}
                <div className="flex flex-col items-center relative z-10 text-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                    currentStatus === 'Processing' || currentStatus === 'Shipped' || currentStatus === 'Delivered'
                      ? 'bg-[#7A0C1E] border-[#7A0C1E] text-[#D4AF37]'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-800 mt-2 block">Processing</span>
                  <span className="text-[9px] text-slate-400 font-medium block">Order confirmed</span>
                </div>

                {/* Step 2: Shipped */}
                <div className="flex flex-col items-center relative z-10 text-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                    currentStatus === 'Shipped' || currentStatus === 'Delivered'
                      ? 'bg-[#7A0C1E] border-[#7A0C1E] text-[#D4AF37]'
                      : currentStatus === 'Processing'
                      ? 'bg-white border-[#7A0C1E] text-[#7A0C1E]'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-800 mt-2 block">Dispatched</span>
                  <span className="text-[9px] text-slate-400 font-medium block">In transit to hub</span>
                </div>

                {/* Step 3: Delivered */}
                <div className="flex flex-col items-center relative z-10 text-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                    currentStatus === 'Delivered'
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-800 mt-2 block">Delivered</span>
                  <span className="text-[9px] text-slate-400 font-medium block">Safely handed over</span>
                </div>
              </div>

              {/* Bento Grid: Customer & Delivery Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Delivery Target */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-red-100 text-[#7A0C1E] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Delivery Address
                    </h4>
                    <p className="text-xs font-semibold text-slate-800 mt-1 leading-relaxed">
                      {mainOrder["Full Name"]}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {mainOrder["Delivery & Billing Address *"]}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      Phone: {mainOrder["Contact Number"]}
                    </p>
                  </div>
                </div>

                {/* Preference Details */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Schedule & Total Amount
                    </h4>
                    <p className="text-xs font-bold text-slate-800 mt-1">
                      Preferred Date: <span className="text-[#7A0C1E]">{mainOrder["Preferred Delivery Date"]}</span>
                    </p>
                    <div className="mt-2 flex items-center justify-between border-t border-slate-200/60 pt-2">
                      <span className="text-xs text-slate-500 font-medium">Order Value:</span>
                      <span className="text-sm font-extrabold text-[#7A0C1E] font-mono">
                        ₹{totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table of Order Items */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Assorted Festive Items
                  </h4>
                  <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                    {orders.length} Row(s)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500">
                        <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">S/N</th>
                        <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Product Name</th>
                        <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Category</th>
                        <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-right">Price (INR)</th>
                        <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-center">Discount %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-600">
                            {item["S/N"] || `P${String(index + 1).padStart(3, '0')}`}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {item["Product Name"]}
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            <span className="inline-block bg-[#7A0C1E]/5 text-[#7A0C1E] text-[10px] px-2 py-0.5 rounded-full font-bold">
                              {item.Category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-right text-slate-800 font-bold">
                            ₹{item["Price (INR)"]}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-emerald-600 font-bold">
                            {item["Discount %"]}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Warning/Assurance */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex gap-2.5 text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-emerald-800 leading-relaxed">
                  <b>Safe-Freight Policy Active:</b> This order is dispatched through licensed, temperature-regulated transit channels based in Chennai. High-density, double-layered packages are safe to hold and store inside dry home conditions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
