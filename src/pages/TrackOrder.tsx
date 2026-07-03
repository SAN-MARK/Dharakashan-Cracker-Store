import React, { useState, useEffect } from 'react';
import { Search, Package, MapPin, Calendar, CreditCard, ChevronDown, ChevronUp, Clock, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { dbService, isSupabaseConfigured } from '../lib/supabase';
import { translate, Language } from '../lib/translations';

interface TrackOrderProps {
  language: Language;
}

export default function TrackOrder({ language }: TrackOrderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [foundOrders, setFoundOrders] = useState<any[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  // Fetch some defaults if they want to track sample ones
  const [sampleOrders, setSampleOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchSampleOrders = async () => {
      try {
        const oList = await dbService.getOrders();
        setSampleOrders(oList.slice(0, 3));
      } catch (err) {
        console.error("Error fetching sample orders", err);
      }
    };
    fetchSampleOrders();
  }, []);

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToUse = customQuery !== undefined ? customQuery : searchQuery;
    if (!queryToUse.trim()) return;

    setLoading(true);
    setSearched(true);
    setErrorMsg('');

    console.log(`[TrackOrder] Query submitted: "${queryToUse}"`);

    try {
      const results = await dbService.trackOrder(queryToUse);
      console.log(`[TrackOrder] Query response:`, results);
      setFoundOrders(results);
      
      // Auto-expand if only 1 found
      if (results.length === 1) {
        setExpandedOrders({ [results[0].id]: true });
      } else {
        setExpandedOrders({});
      }
    } catch (err: any) {
      console.error("[TrackOrder] Search exception:", err);
      setErrorMsg(err?.message || "An unexpected error occurred while searching.");
    } finally {
      setLoading(false);
    }
  };

  const [errorMsg, setErrorMsg] = useState('');

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Helper to determine active step index in progress bar
  const getStatusStep = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return 4;
    if (s === 'dispatched' || s === 'shipped') return 3;
    if (s === 'confirmed' || s === 'processing') return 2;
    return 1; // Pending / Placed
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 md:px-8 py-8 animate-fade-in" id="order-tracker-page">
      {/* Title Header Banner */}
      <div className="relative rounded-3xl bg-radial from-[#7A0C1E] to-[#40020B] p-6 md:p-10 border border-[#D4AF37]/30 shadow-2xl overflow-hidden mb-8">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FF9933]/15 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full text-xs font-mono font-bold text-[#D4AF37] tracking-wider uppercase mb-3">
              🎯 LIVE ORDER RADAR
            </div>
            <h1 className="font-sans font-black text-2xl md:text-4xl text-white tracking-tight">
              Track Your <span className="text-[#D4AF37]">Festive Deliveries</span>
            </h1>
            <p className="text-sm text-slate-200/80 mt-1 max-w-xl font-sans leading-relaxed">
              Instantly monitor your Sivakasi elite crackers shipments using your Customer ID, Registered Phone Number, or exact Order ID.
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl">
            <span className="text-3xl md:text-4xl">📦</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Search Form and Results */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-150 rounded-2xl p-5 md:p-6 shadow-sm">
            <h2 className="font-sans font-bold text-slate-800 text-sm md:text-base uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-lg">🔍</span> Track Instant Order
            </h2>
            <form onSubmit={(e) => handleSearch(e)} className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. ord-1001), Phone (e.g. 9840123456) or Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-sans text-slate-800 focus:outline-none focus:border-[#7A0C1E] focus:bg-white transition-all shadow-2xs"
                  required
                  id="order-tracker-search-input"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`py-3 px-6 rounded-xl font-sans font-bold text-xs shadow-md transition-all select-none cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                  loading 
                    ? 'bg-[#7A0C1E]/60 text-white cursor-not-allowed animate-pulse'
                    : 'bg-[#7A0C1E] hover:bg-[#911327] text-white'
                }`}
                id="order-tracker-search-btn"
              >
                {loading ? 'Searching...' : 'Locate Order 📦'}
              </button>
            </form>

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Results Container */}
          {searched && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-sans font-extrabold text-slate-800 text-sm">
                  Search Results ({foundOrders.length})
                </h3>
                {foundOrders.length > 0 && (
                  <span className="text-[10px] font-mono font-bold text-green-700 bg-green-50 border border-green-150 rounded-full px-2.5 py-0.5 uppercase">
                    Order Found
                  </span>
                )}
              </div>

              {loading ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-xs">
                  <div className="w-8 h-8 border-4 border-[#7A0C1E] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-xs text-slate-500 font-sans font-semibold">Querying cloud registers...</p>
                </div>
              ) : foundOrders.length === 0 ? (
                <div className="bg-white border border-slate-150 rounded-2xl p-8 text-center shadow-xs">
                  <div className="text-4xl mb-2">🔍❌</div>
                  <h4 className="font-sans font-bold text-slate-800 text-sm">No Orders Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-sans leading-relaxed">
                    We couldn't find any orders matching <strong className="text-rose-700">"{searchQuery}"</strong>. Please verify the spelling, check your phone number or confirm your Order ID prefix.
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2 justify-center">
                    <span className="text-[10px] text-slate-400 font-sans block w-full">Quick suggestions:</span>
                    {sampleOrders.map(so => (
                      <button
                        key={so.id}
                        onClick={() => {
                          setSearchQuery(so.id);
                          handleSearch(undefined, so.id);
                        }}
                        className="bg-slate-50 hover:bg-slate-100 text-[#7A0C1E] border border-slate-200 text-[10px] font-mono px-2.5 py-1 rounded-full cursor-pointer transition-all"
                      >
                        Try {so.id}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {foundOrders.map((ord) => {
                    const isExpanded = !!expandedOrders[ord.id];
                    const activeStep = getStatusStep(ord.status);
                    
                    return (
                      <div 
                        key={ord.id} 
                        className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
                        id={`order-card-${ord.id}`}
                      >
                        {/* Order Header Summary Line */}
                        <div 
                          onClick={() => toggleExpand(ord.id)}
                          className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#7A0C1E]/5 text-[#7A0C1E] flex items-center justify-center shrink-0 border border-[#7A0C1E]/10">
                              <Package className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-sm text-[#7A0C1E]">{ord.id}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  ord.status === 'Delivered' 
                                    ? 'bg-green-50 text-green-700 border border-green-150' 
                                    : 'bg-amber-50 text-amber-700 border border-amber-150'
                                }`}>
                                  {ord.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-sans mt-0.5">
                                For <strong className="text-slate-700 font-semibold">{ord.customer_name}</strong> &bull; {ord.phone}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-2.5 md:pt-0 border-slate-100">
                            <div className="text-left md:text-right">
                              <div className="text-xs text-slate-400 font-sans">Total Amount</div>
                              <div className="font-sans font-black text-sm text-slate-800">₹{ord.total_amount}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Order Expanded Progress details */}
                        {isExpanded && (
                          <div className="border-t border-slate-100 bg-slate-50/40 p-4 md:p-6 space-y-6">
                            
                            {/* Visual Tracking Progress Timeline */}
                            <div>
                              <div className="flex justify-between text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">
                                <span>1. Placed</span>
                                <span>2. Confirmed</span>
                                <span>3. Dispatched</span>
                                <span>4. Delivered</span>
                              </div>
                              
                              <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#FF9933] to-green-500 rounded-full transition-all duration-1000"
                                  style={{ width: `${(activeStep / 4) * 100}%` }}
                                ></div>
                              </div>

                              <div className="grid grid-cols-4 mt-3">
                                <div className="text-center flex flex-col items-center">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    activeStep >= 1 ? 'bg-[#FF9933] text-white' : 'bg-slate-200 text-slate-500'
                                  }`}>
                                    {activeStep >= 1 ? '✓' : '1'}
                                  </div>
                                  <span className="text-[10px] text-slate-500 mt-1 font-sans">Received</span>
                                </div>
                                <div className="text-center flex flex-col items-center">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    activeStep >= 2 ? 'bg-[#FF9933] text-white' : 'bg-slate-200 text-slate-500'
                                  }`}>
                                    {activeStep >= 2 ? '✓' : '2'}
                                  </div>
                                  <span className="text-[10px] text-slate-500 mt-1 font-sans">Processing</span>
                                </div>
                                <div className="text-center flex flex-col items-center">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    activeStep >= 3 ? 'bg-[#FF9933] text-white' : 'bg-slate-200 text-slate-500'
                                  }`}>
                                    {activeStep >= 3 ? '✓' : '3'}
                                  </div>
                                  <span className="text-[10px] text-slate-500 mt-1 font-sans">In Transit</span>
                                </div>
                                <div className="text-center flex flex-col items-center">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    activeStep >= 4 ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                                  }`}>
                                    {activeStep >= 4 ? '✓' : '4'}
                                  </div>
                                  <span className="text-[10px] text-slate-500 mt-1 font-sans">Completed</span>
                                </div>
                              </div>
                            </div>

                            {/* Details Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                              {/* Left detail card */}
                              <div className="bg-white p-3.5 rounded-xl border border-slate-150 space-y-2.5">
                                <div className="flex items-center gap-1.5 text-[#7A0C1E] font-sans font-bold text-xs uppercase tracking-wider pb-1.5 border-b border-slate-50">
                                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Delivery Location
                                </div>
                                <div className="space-y-1">
                                  <div className="text-[10px] text-slate-400 font-sans uppercase">Address</div>
                                  <p className="text-xs text-slate-700 font-sans leading-relaxed">{ord.address}</p>
                                </div>
                                <div className="space-y-1 pt-1">
                                  <div className="text-[10px] text-slate-400 font-sans uppercase">Client phone</div>
                                  <p className="text-xs text-slate-700 font-sans font-mono font-semibold">{ord.phone}</p>
                                </div>
                              </div>

                              {/* Right detail card */}
                              <div className="bg-white p-3.5 rounded-xl border border-slate-150 space-y-2.5">
                                <div className="flex items-center gap-1.5 text-[#7A0C1E] font-sans font-bold text-xs uppercase tracking-wider pb-1.5 border-b border-slate-50">
                                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> Log Information
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <div className="text-[10px] text-slate-400 font-sans uppercase">Date Placed</div>
                                    <p className="text-xs text-slate-700 font-sans font-semibold mt-0.5">
                                      {new Date(ord.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <div className="text-[10px] text-slate-400 font-sans uppercase">Status Code</div>
                                    <p className="text-xs text-slate-700 font-sans font-semibold mt-0.5">
                                      {ord.status}
                                    </p>
                                  </div>
                                </div>
                                <div className="pt-1">
                                  <div className="text-[10px] text-slate-400 font-sans uppercase">Sivakasi Warehouse Dispatch</div>
                                  <div className="text-xs font-mono font-bold text-slate-600 mt-0.5 flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> PESO Security Verified
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Order items drilldown list */}
                            {ord.items && ord.items.length > 0 && (
                              <div className="border-t border-slate-100 pt-5">
                                <h4 className="font-sans font-extrabold text-[#7A0C1E] text-xs uppercase tracking-wider mb-3">
                                  🛍️ ORDER CONTENTS ({ord.items.length} ITEMS)
                                </h4>
                                <div className="bg-white rounded-xl border border-slate-150 overflow-hidden divide-y divide-slate-100">
                                  {ord.items.map((it: any) => (
                                    <div key={it.id} className="p-3 flex items-center justify-between text-xs font-sans">
                                      <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                                        <div>
                                          <span className="font-bold text-slate-800">Product ID: {it.product_id}</span>
                                          <span className="text-slate-400 block text-[10px]">Unit price: ₹{it.price}</span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-slate-500 font-mono">Qty: {it.quantity}</span>
                                        <span className="font-bold text-[#7A0C1E] block">₹{it.price * it.quantity}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Information, Guides, Sample Search shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Help Card */}
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-3.5">
            <h3 className="font-sans font-black text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
              💡 Track Guide
            </h3>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              To instantly locate your order's transit updates, please enter any of the following fields:
            </p>
            <ul className="space-y-2 text-xs font-sans text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-[#FF9933] shrink-0 font-bold mt-0.5">✔</span>
                <span><strong>Order ID:</strong> Classic format starting with <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[#7A0C1E]">ord-</code> prefix (e.g. ord-1001)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF9933] shrink-0 font-bold mt-0.5">✔</span>
                <span><strong>Phone Number:</strong> Registered 10-digit mobile number used during secure checkout (e.g. 9840123456)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF9933] shrink-0 font-bold mt-0.5">✔</span>
                <span><strong>Customer Name:</strong> Your full name associated with the festive purchase invoice (e.g. Rajesh Kumar)</span>
              </li>
            </ul>
          </div>

          {/* Quick Demo Search shortcuts */}
          <div className="bg-[#FFFBF7] border border-[#D4AF37]/20 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-sans font-bold text-[#7A0C1E] text-xs uppercase tracking-widest flex items-center gap-1.5">
              🔥 Quick Search Shortcuts
            </h3>
            <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
              Don't have your own order placed yet? Use these pre-loaded sandbox order registers to preview our dynamic live shipment updates:
            </p>
            
            <div className="space-y-2.5 pt-2">
              <button 
                onClick={() => {
                  setSearchQuery('ord-1001');
                  handleSearch(undefined, 'ord-1001');
                }}
                className="w-full bg-white hover:bg-[#7A0C1E]/5 text-left p-2.5 rounded-xl border border-slate-200 hover:border-[#7A0C1E]/30 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#7A0C1E] block">ord-1001</span>
                  <span className="text-[10px] text-slate-500">Rajesh Kumar &bull; Chennai</span>
                </div>
                <span className="bg-green-50 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-green-150">Delivered</span>
              </button>

              <button 
                onClick={() => {
                  setSearchQuery('9443210987');
                  handleSearch(undefined, '9443210987');
                }}
                className="w-full bg-white hover:bg-[#7A0C1E]/5 text-left p-2.5 rounded-xl border border-slate-200 hover:border-[#7A0C1E]/30 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#7A0C1E] block">9443210987</span>
                  <span className="text-[10px] text-slate-500">Karthik Raja &bull; Madurai</span>
                </div>
                <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-150">Confirmed</span>
              </button>

              <button 
                onClick={() => {
                  setSearchQuery('Priya Sundar');
                  handleSearch(undefined, 'Priya Sundar');
                }}
                className="w-full bg-white hover:bg-[#7A0C1E]/5 text-left p-2.5 rounded-xl border border-slate-200 hover:border-[#7A0C1E]/30 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#7A0C1E] block">Priya Sundar</span>
                  <span className="text-[10px] text-slate-500">Priya Sundar &bull; Coimbatore</span>
                </div>
                <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-150">Pending</span>
              </button>
            </div>
          </div>

          {/* Secure verification notice */}
          <div className="bg-slate-950/5 text-slate-500 rounded-xl p-4 border border-slate-200 text-[10px] font-mono leading-relaxed space-y-1.5">
            <div className="font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              🛡️ PESO Standard Safety Verification
            </div>
            <p>
              All shipments strictly follow PESO standards. Deliveries of festive items are packed securely in wet-proof boxes with thermal-resistant interior shields. Use of adults-only signature is required upon secure arrival.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
