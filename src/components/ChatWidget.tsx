import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, X, Send, HelpCircle, 
  ShoppingBag, Check, AlertTriangle, ArrowRight, 
  Trash2, Plus, Minus, Phone, ShieldAlert, Sparkles,
  Tag, Truck, Calendar, Sparkle, UserCheck, MessageCircle
} from 'lucide-react';
import { Product, CartItem, Page } from '../types';
import { dbService } from '../lib/supabase';

interface ChatWidgetProps {
  products: Product[];
  addToCart: (product: Product, quantity: number) => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  setCurrentPage: (page: Page) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: Date;
  cardType?: 'products' | 'delivery' | 'discount' | 'tracking' | 'escalation' | 'cart-summary';
  cardData?: any;
}

export default function ChatWidget({
  products,
  addToCart,
  cart,
  setIsCartOpen,
  setCurrentPage
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Welcome to Dharakashan Cracker Store! Vanakkam! Namaste! Are you shopping for sparklers, a big fireworks display, or a gift box this Diwali? 🎆",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUpsold, setHasUpsold] = useState(false);
  const [escalated, setEscalated] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const addBotMessage = (text: string, cardType?: Message['cardType'], cardData?: any) => {
    setIsTyping(true);
    // Simulate natural typing delay based on message length
    const delay = Math.max(1000, Math.min(2500, text.length * 15));
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text,
        timestamp: new Date(),
        cardType,
        cardData
      }]);
    }, delay);
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    
    // Process matching intent
    processIntent(textToSend.toLowerCase().trim());
  };

  // Helper fuzzy matching for products
  const findProductFuzzy = (q: string): Product | undefined => {
    if (!q) return undefined;
    
    // Exact match
    let found = products.find(p => p.name.toLowerCase() === q);
    if (found) return found;

    // Contains
    found = products.find(p => p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase()));
    if (found) return found;

    // Word match
    const words = q.split(/\s+/).filter(w => w.length >= 3);
    if (words.length > 0) {
      found = products.find(p => {
        const nameL = p.name.toLowerCase();
        return words.some(word => nameL.includes(word));
      });
    }
    return found;
  };

  const processIntent = async (query: string) => {
    setIsTyping(true);

    // 1. Emergency Safety Guardrails
    if (
      query.includes('injured') || query.includes('injury') || query.includes('burned') || query.includes('fire') || 
      query.includes('accident') || query.includes('emergency') || query.includes('hurt') || query.includes('bleeding') || 
      query.includes('hospital') || query.includes('ambulance') || query.includes('burn')
    ) {
      addBotMessage(
        "⚠️ EMERGENCY SUSPENSION: Please call emergency services at 112 immediately. I have stopped our sales conversation. Safety is our top priority. Please stay safe! 🙏",
        'escalation',
        { type: 'emergency' }
      );
      return;
    }

    // 2. Firework making / modification safety guardrail
    if (
      query.includes('how to make') || query.includes('make fireworks') || query.includes('make bomb') || 
      query.includes('diy fireworks') || query.includes('make cracker') || query.includes('modify') || 
      query.includes('strengthen') || query.includes('increase power') || query.includes('gunpowder')
    ) {
      addBotMessage(
        "For safety, I cannot provide instructions on making, modifying, or strengthening any firework or cracker. Dharakashan only sells safe, certified green crackers. Please handle them with care! ⚠️"
      );
      return;
    }

    // 3. Banned/Illegal crackers guardrail
    if (query.includes('banned') || query.includes('illegal') || query.includes('chinese') || query.includes('pollution')) {
      addBotMessage(
        "Dharakashan Cracker Store only sells certified, PESO-approved green crackers. We do not sell any banned or illegal fireworks. Our products are eco-friendly with low smoke emissions! 🌿"
      );
      return;
    }

    // 4. Language switches / Greetings
    if (query.includes('hindi') || query.includes('hindi me') || query.includes('हिन्दी') || query.includes('हिंदी')) {
      addBotMessage("नमस्ते! धरकाशन पटाखा स्टोर में आपका स्वागत है। 🪔 मैं दीया हूँ। क्या आप दिवाली के लिए फुलझड़ी, अनार या कोई गिफ़्ट बॉक्स ढूँढ रहे हैं?");
      return;
    }
    if (query.includes('tamil') || query.includes('tamilil') || query.includes('தமிழ்') || query.includes('தமிழ் பேசு')) {
      addBotMessage("வணக்கம்! தாரகாஷன் பட்டாசு கடைக்கு உங்களை வரவேற்கிறோம். 🪔 நான் தியா. இந்த தீபாவளிக்கு மத்தாப்பு, அனார் அல்லது பரிசு பெட்டி தேடுகிறீர்களா?");
      return;
    }

    if (query === 'hi' || query === 'hello' || query === 'hey' || query.includes('greetings') || query.includes('namaste') || query.includes('vanakkam')) {
      addBotMessage("Hello! Happy Diwali! 🪔 I'm Diya, your chat shopkeeper. I can recommend green crackers, check stock, verify shipping, or add items to your cart! What are you shopping for today?");
      return;
    }

    // 5. Help FAQ triggers
    if (query.includes('delivery') || query.includes('shipping') || query.includes('how long') || query.includes('pincode') || query.includes('courier')) {
      // Check if pincode is embedded
      const pinMatch = query.match(/\b\d{6}\b/);
      if (pinMatch) {
        handlePincodeCheck(pinMatch[0]);
      } else {
        addBotMessage(
          "We ship all orders in fireproof, moisture-sealed packaging certified for Class 1.4G safety guidelines. 🚚 Please share your 6-digit Pincode (e.g. 600020) so I can fetch an exact delivery estimate!",
          'delivery',
          { requested: true }
        );
      }
      return;
    }

    if (query.includes('return') || query.includes('refund') || query.includes('damage') || query.includes('broken') || query.includes('dud')) {
      addBotMessage(
        "Under fire safety regulations, sealed crackers cannot be returned after they are opened. However, if any product arrives damaged or fails to light, simply share a photo and your Order ID, and I will connect you to our support desk for a refund! 📸",
        'escalation',
        { type: 'damage_refund' }
      );
      return;
    }

    if (query.includes('bulk') || query.includes('wholesale') || query.includes('wholesale price') || query.includes('temple') || query.includes('association')) {
      addBotMessage(
        "For bulk purchases or wholesale custom price quotes (50+ combo boxes/large sets), we offer special institutional discounts! Let me connect you directly to our human sales supervisor to secure your quote. 📋",
        'escalation',
        { type: 'bulk' }
      );
      return;
    }

    if (query.includes('payment') || query.includes('how to pay') || query.includes('cod') || query.includes('upi') || query.includes('card')) {
      addBotMessage(
        "We support safe payments via UPI (Google Pay, PhonePe, Paytm), Net Banking, and major Debit/Credit cards. Cash on Delivery (COD) is also available for serviceable pincodes! 💳"
      );
      return;
    }

    // 6. Discount code checking
    if (query.includes('coupon') || query.includes('discount') || query.includes('code') || query.includes('promo')) {
      // Look for code
      const codeMatch = query.match(/[a-zA-Z]+\d+/);
      if (codeMatch) {
        handleCouponCheck(codeMatch[0]);
      } else {
        addBotMessage(
          "We have festive offers! Try using coupon code **DIWALI20** to get 20% off your entire order, or **SIVAKASI500** for a flat 500 rupees off! Enter the coupon in the cart or say 'apply DIWALI20' here. 🏷️",
          'discount',
          { code: null }
        );
      }
      return;
    }

    // Apply Coupon directly
    if (query.startsWith('apply ')) {
      const code = query.substring(6).trim().toUpperCase();
      handleCouponCheck(code);
      return;
    }

    // 7. Order tracking
    if (query.includes('track') || query.includes('order status') || query.includes('my order') || query.includes('ord-')) {
      const ordMatch = query.match(/(?:ord-)\d+/i);
      const phoneMatch = query.match(/\b\d{10}\b/);
      
      if (ordMatch || phoneMatch) {
        handleOrderTracking(ordMatch ? ordMatch[0].toLowerCase() : (phoneMatch ? phoneMatch[0] : ''));
      } else {
        addBotMessage(
          "I can search your order! Please enter your 10-digit phone number or Order ID (e.g., ord-1002) below to track your green crackers dispatch status. 📦",
          'tracking',
          { prompt: true }
        );
      }
      return;
    }

    // 8. Hand off to human
    if (query.includes('human') || query.includes('person') || query.includes('escalate') || query.includes('talk to') || query.includes('whatsapp')) {
      addBotMessage(
        "Connecting you to our Dharakashan customer care supervisor... A friendly agent will assist you on WhatsApp right away! 🤝",
        'escalation',
        { type: 'general' }
      );
      return;
    }

    // 9. Add to cart intent
    const addRegex = /(?:add|buy|put|get)\s+(.+?)\s+(?:to cart|to bag|in cart|cart|bag)/i;
    const addSimpleRegex = /(?:add|buy|put|get)\s+(.+)/i;
    const addMatch = query.match(addRegex) || query.match(addSimpleRegex);

    if (addMatch && addMatch[1]) {
      const prodQuery = addMatch[1].trim();
      if (prodQuery !== 'cart' && prodQuery !== 'bag' && prodQuery !== 'products' && prodQuery !== 'yes' && prodQuery !== 'no') {
        const product = findProductFuzzy(prodQuery);
        if (product) {
          // Check Stock
          const stock = product.stock || 100;
          if (stock <= 0) {
            addBotMessage(
              `Oh! It seems **${product.name}** is currently out of stock. 😔 Would you like to check out **Royal Multi-Color Flower Pots** (₹350) or **Imperial Golden Sparklers** (₹180) instead? Both are in stock!`
            );
          } else {
            addToCart(product, 1);
            
            // Check for Upsell Suggestion
            const cartItemsCount = cart.reduce((tot, item) => tot + item.quantity, 0) + 1;
            if (cartItemsCount >= 3 && !hasUpsold) {
              setHasUpsold(true);
              addBotMessage(
                `Added 1 pack of **${product.name}** to your cart! 🛍️\n\nSince you are building a grand celebration, how about adding our family favorite **Sparkle Shubh Labh Combo Box** (₹1,299)? It is a curated selection of 15 premium green crackers!`,
                'products',
                { products: products.filter(p => p.id === 'p11' || p.name.includes('Combo')) }
              );
            } else {
              addBotMessage(
                `Added 1 pack of **${product.name}** to your cart! 🛍️ Would you like to check out now, or add more crackers?`,
                'cart-summary',
                { addedProduct: product }
              );
            }
          }
          return;
        }
      }
    }

    // 10. Check/Read Cart
    if (query.includes('cart') || query.includes('bag') || query.includes('my items') || query.includes('checkout')) {
      if (cart.length === 0) {
        addBotMessage("Your shopping cart is currently empty. 🛍️ Ask me to 'show sparklers' or click 'Browse Products' below to find PESO-approved green crackers!");
      } else {
        const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        addBotMessage(
          `Here is your current cart summary! You have ${cart.length} item(s) ready for checkout:`,
          'cart-summary',
          { total }
        );
      }
      return;
    }

    // 11. Recommendations by Category or General query
    if (query.includes('sparkler') || query.includes('phuljhari')) {
      const matchProds = products.filter(p => p.category === 'sparklers');
      addBotMessage(
        "Here are our premium safe **Imperial & Crackling Sparklers** (highly recommended for kids & safe celebrations) 🎇:",
        'products',
        { products: matchProds }
      );
      return;
    }

    if (query.includes('flower pot') || query.includes('pots') || query.includes('fountain') || query.includes('anar')) {
      const matchProds = products.filter(p => p.category === 'flowerpots');
      addBotMessage(
        "Check out our stunning **Fountain & Flower Pots** that shoot bright colorful sparks high into the air! ⛲:",
        'products',
        { products: matchProds }
      );
      return;
    }

    if (query.includes('rocket') || query.includes('sky')) {
      const matchProds = products.filter(p => p.category === 'rockets');
      addBotMessage(
        "Enjoy a majestic sky show with our **Glittering & Whistling Sky Rockets**! 🚀:",
        'products',
        { products: matchProds }
      );
      return;
    }

    if (query.includes('combo') || query.includes('box') || query.includes('gift') || query.includes('family')) {
      const matchProds = products.filter(p => p.category === 'combos' || p.name.toLowerCase().includes('box') || p.price > 1000);
      addBotMessage(
        "Our curated **Diwali Family Combo Boxes** offer pre-packaged assortment kits at deep discounts! Great for direct gifting 🪔:",
        'products',
        { products: matchProds }
      );
      return;
    }

    if (query.includes('sound') || query.includes('loud') || query.includes('bijli') || query.includes('lari')) {
      const matchProds = products.filter(p => p.category === 'sound' || p.name.toLowerCase().includes('bijli') || p.name.toLowerCase().includes('lari'));
      addBotMessage(
        "We have certified eco-friendly sound crackers, like safe low-emission **Bijli Crackers** or a classic **Red Fort Lari**! 🎆:",
        'products',
        { products: matchProds }
      );
      return;
    }

    if (query.includes('product') || query.includes('list') || query.includes('show') || query.includes('catalog') || query.includes('browse') || query.includes('buy')) {
      // Recommend top products
      addBotMessage(
        "Here is our recommended selection of PESO-approved green crackers. Scroll to browse categories! 🎆",
        'products',
        { products: products.slice(0, 4) }
      );
      return;
    }

    // 12. Standard Fallback - match single product fuzzy just in case they typed a product name directly
    const directProd = findProductFuzzy(query);
    if (directProd) {
      addBotMessage(
        `I found **${directProd.name}**! It costs ₹${directProd.price} per box, carries full safety certifications, and is in stock. Would you like me to add it?`,
        'products',
        { products: [directProd] }
      );
      return;
    }

    // Unrecognized fallback
    addBotMessage(
      "I didn't quite catch that. 🪔 Try selecting an action below, or typing questions like: 'Show sparklers', 'Do you deliver to 600020?', 'Apply DIWALI20', or ask for 'help'!"
    );
  };

  const handlePincodeCheck = async (pincode: string) => {
    setIsTyping(true);
    const result = await dbService.checkDelivery(pincode);
    if (result) {
      if (result.is_serviceable) {
        addBotMessage(
          `Yes! Pincode **${pincode}** is fully serviceable under certified Class 1.4G safety transit regulations. 🚚\n\n- **Region**: ${result.district}\n- **Estimated Transit**: ${result.estimated_delivery_days} day(s)\n- **Packaging**: Fireproof & Moisture-sealed`,
          'delivery',
          { result }
        );
      } else {
        addBotMessage(
          `Oops! Pincode **${pincode}** (${result.district}) is currently restricted for firecracker transport due to remote safety rules. Let me know if you have an alternative city delivery address! ⚠️`
        );
      }
    } else {
      // Simulate general delivery estimation for other Tamil Nadu pincodes
      if (pincode.startsWith('6')) {
        addBotMessage(
          `Yes! Pincode **${pincode}** (Tamil Nadu Region) is fully serviceable! Delivery takes approximately **2 to 3 business days** directly from Sivakasi. 🚚`
        );
      } else {
        addBotMessage(
          `Pincode **${pincode}** is serviceable! Interstate firecracker logistics take about **4 to 6 business days** with safety-insured courier transport. 📦`
        );
      }
    }
  };

  const handleCouponCheck = async (code: string) => {
    setIsTyping(true);
    const result = await dbService.getCoupon(code);
    if (result) {
      const discountVal = result.discount_type === 'percentage' ? `${result.discount_value}%` : `₹${result.discount_value}`;
      addBotMessage(
        `Success! Coupon **${code}** has been verified and found active. 🏷️\n\n- **Value**: ${discountVal} Off\n- **Expiry**: ${result.expiry_date}\n\nGo to checkout to apply this coupon and secure your discount!`,
        'discount',
        { coupon: result }
      );
    } else {
      addBotMessage(
        `Sorry, coupon code **${code}** is invalid or has expired. You can use **DIWALI20** to receive an instant 20% discount on your order! 🏷️`
      );
    }
  };

  const handleOrderTracking = async (search: string) => {
    setIsTyping(true);
    const orders = await dbService.getOrders();
    const cleanSearch = search.trim().toLowerCase();
    
    const foundOrder = orders.find(o => 
      o.id.toLowerCase() === cleanSearch || 
      (o.orderId && o.orderId.toLowerCase() === cleanSearch) ||
      o.phone === cleanSearch ||
      (o.customer?.phone === cleanSearch)
    );

    if (foundOrder) {
      addBotMessage(
        `I found your order! Here is the live status of your green crackers preorder:`,
        'tracking',
        { order: foundOrder }
      );
    } else {
      // Return a simulated search status for demonstration if no custom order exists
      if (cleanSearch.includes('1002') || cleanSearch === '9443210987') {
        addBotMessage(
          `Found Order! Here is your current dispatch status:`,
          'tracking',
          { 
            order: {
              id: 'ord-1002',
              customer_name: 'Karthik Raja',
              phone: '9443210987',
              address: '45B, West Masi Street, Madurai - 625001',
              total_amount: 850,
              status: 'Shipped',
              created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            } 
          }
        );
      } else {
        addBotMessage(
          `I couldn't locate any preorders matching "${search}". Double-check your 10-digit phone number or Order ID (e.g. ord-1001) and try again, or ask for help! 🔍`
        );
      }
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Bubble */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans select-none">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              id="diya-chat-panel"
              className="w-[340px] sm:w-[380px] h-[520px] bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/30 flex flex-col overflow-hidden relative"
            >
              {/* Header */}
              <div className="bg-[#7A0C1E] p-4 text-white flex items-center justify-between border-b border-[#D4AF37]/20 relative">
                {/* Gold header strip */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-[#D4AF37] to-[#FF9933]"></div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white/10 border border-[#D4AF37]/30 flex items-center justify-center text-xl shadow-inner relative">
                    🪔
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-sans font-extrabold text-sm text-white tracking-wide flex items-center gap-1">
                      Diya
                      <Sparkle className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                    </h4>
                    <p className="text-[10px] text-[#FFF8F0]/70 font-sans">Dharakashan Shopping Assistant</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {escalated && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-200 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-bold">
                      Handoff Pending
                    </span>
                  )}
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    aria-label="Close Chat Window"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Feed */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-[#FFFBF7] space-y-3 scrollbar-thin text-left"
                id="diya-chat-messages"
              >
                {messages.map((msg) => {
                  const isBot = msg.sender === 'bot';
                  const isSystem = msg.sender === 'system';
                  
                  return (
                    <div 
                      key={msg.id}
                      className={`flex flex-col ${isBot ? 'items-start' : isSystem ? 'items-center' : 'items-end'} space-y-1`}
                    >
                      {/* Text Bubble */}
                      <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed font-sans shadow-xs ${
                        isSystem
                          ? 'bg-amber-50 text-amber-800 border border-amber-200 text-center text-[10px] font-bold py-1.5 px-3 rounded-full'
                          : isBot
                            ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                            : 'bg-[#7A0C1E] text-white rounded-tr-none font-medium'
                      }`}>
                        {msg.text.split('\n').map((line, lidx) => (
                          <p key={lidx} className={lidx > 0 ? 'mt-1.5' : ''}>
                            {line}
                          </p>
                        ))}
                      </div>

                      {/* Card Attachments */}
                      {msg.cardType === 'products' && msg.cardData?.products && (
                        <div className="w-full pl-2 pr-4 py-1.5 flex flex-col gap-2.5 max-h-64 overflow-y-auto scrollbar-thin">
                          {msg.cardData.products.map((p: Product) => (
                            <div 
                              key={p.id}
                              className="bg-white border border-slate-200/60 rounded-xl p-2.5 shadow-sm hover:border-[#D4AF37]/50 transition-all flex gap-3"
                            >
                              <img 
                                src={p.image} 
                                alt={p.name} 
                                className="w-16 h-16 rounded-lg object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0 text-left flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between gap-1.5">
                                    <h5 className="font-bold text-slate-800 text-[11px] truncate leading-snug">{p.name}</h5>
                                    <span className="bg-emerald-50 text-emerald-700 font-bold text-[8px] px-1 py-0.5 rounded-sm border border-emerald-100 shrink-0">
                                      PESO
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{p.description}</p>
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-50">
                                  <span className="font-extrabold text-[#7A0C1E] text-xs">₹{p.price}</span>
                                  <button
                                    onClick={() => {
                                      addToCart(p, 1);
                                      setMessages(prev => [...prev, {
                                        id: `add-sys-${Date.now()}`,
                                        sender: 'system',
                                        text: `Added ${p.name} directly to cart`,
                                        timestamp: new Date()
                                      }]);
                                    }}
                                    className="bg-[#7A0C1E]/5 hover:bg-[#7A0C1E] text-[#7A0C1E] hover:text-[#D4AF37] font-sans font-extrabold text-[10px] py-1 px-3 rounded-md transition-all border border-[#7A0C1E]/10 cursor-pointer"
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.cardType === 'delivery' && msg.cardData?.requested && (
                        <div className="w-full py-1 text-left">
                          <div className="bg-[#FFFBF7] border border-dashed border-[#D4AF37]/60 rounded-xl p-3 flex flex-col gap-2 max-w-[85%] shadow-xs">
                            <span className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                              <Truck className="w-3.5 h-3.5 text-[#7A0C1E]" /> Check Service Area
                            </span>
                            <div className="flex gap-1.5">
                              <input 
                                type="text"
                                maxLength={6}
                                placeholder="Enter 6-digit Pincode"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const value = (e.target as HTMLInputElement).value;
                                    if (/^\d{6}$/.test(value)) {
                                      handlePincodeCheck(value);
                                      (e.target as HTMLInputElement).value = '';
                                    } else {
                                      alert("Please enter a valid 6-digit number!");
                                    }
                                  }
                                }}
                                className="w-full text-[11px] px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#7A0C1E]"
                              />
                            </div>
                            <p className="text-[9px] text-slate-400">Type code and press Enter to check safety transit</p>
                          </div>
                        </div>
                      )}

                      {msg.cardType === 'discount' && (
                        <div className="w-full py-1 text-left">
                          <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3 max-w-[85%] flex items-start gap-2.5 shadow-xs">
                            <Tag className="w-4.5 h-4.5 text-[#7A0C1E] shrink-0 mt-0.5" />
                            <div>
                              <h5 className="font-bold text-xs text-slate-800">Active Coupons:</h5>
                              <ul className="text-[10px] text-slate-600 space-y-1 mt-1.5 list-disc pl-3">
                                <li><b className="text-slate-800">DIWALI20</b>: 20% discount on total cart</li>
                                <li><b className="text-slate-800">SIVAKASI500</b>: flat ₹500 off on order</li>
                              </ul>
                              <p className="text-[9px] text-[#7A0C1E] font-medium mt-2 leading-tight">
                                Simply type "apply DIWALI20" or enter it inside checkout!
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {msg.cardType === 'tracking' && msg.cardData?.order && (
                        <div className="w-full py-1">
                          <div className="bg-white border border-slate-150 rounded-xl p-3 max-w-[90%] text-left shadow-sm space-y-2.5">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                              <div>
                                <span className="text-[9px] font-mono text-[#7A0C1E] font-bold">ORDER ID</span>
                                <h5 className="font-extrabold text-xs text-[#7A0C1E]">{msg.cardData.order.id}</h5>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold font-sans ${
                                msg.cardData.order.status === 'Delivered' || msg.cardData.order.status === 'Shipped'
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {msg.cardData.order.status}
                              </span>
                            </div>

                            <div className="space-y-1 text-[10px] text-slate-600">
                              <p>👤 <b className="text-slate-800">Recipient</b>: {msg.cardData.order.customer_name}</p>
                              <p>📦 <b className="text-slate-800">Amount</b>: ₹{msg.cardData.order.total_amount}</p>
                              <p>📍 <b className="text-slate-800">Address</b>: {msg.cardData.order.address}</p>
                            </div>

                            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[9px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Preorder logged
                              </span>
                              <span>{new Date(msg.cardData.order.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {msg.cardType === 'escalation' && (
                        <div className="w-full py-1">
                          <div className="bg-[#7A0C1E]/5 border border-[#7A0C1E]/15 rounded-xl p-3 max-w-[85%] text-left shadow-xs space-y-2">
                            <div className="flex gap-2 text-[#7A0C1E]">
                              <UserCheck className="w-4 h-4 shrink-0 mt-0.5" />
                              <div>
                                <h5 className="font-bold text-xs text-slate-800">Human Assistance Handoff</h5>
                                <p className="text-[10px] text-slate-500 mt-0.5">Connect securely with a Sivakasi safety logistics coordinator.</p>
                              </div>
                            </div>
                            <div className="pt-2 flex flex-col gap-1.5">
                              <a 
                                href="https://wa.me/919876543210" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={() => setEscalated(true)}
                                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-sans font-bold text-[10px] py-1.5 rounded-lg flex items-center justify-center gap-1 shadow-xs transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                <span>Connect via WhatsApp</span>
                              </a>
                              <a 
                                href="tel:+919876543210"
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-sans font-bold text-[10px] py-1.5 rounded-lg flex items-center justify-center gap-1 shadow-xs transition-colors"
                              >
                                <Phone className="w-3 h-3" />
                                <span>Call Helpdesk Line</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      )}

                      {msg.cardType === 'cart-summary' && (
                        <div className="w-full py-1">
                          <div className="bg-white border border-slate-150 rounded-xl p-3 max-w-[85%] text-left shadow-sm space-y-2">
                            <h5 className="font-bold text-xs text-slate-800 flex items-center gap-1.5 pb-1 border-b border-slate-50">
                              <ShoppingBag className="w-4 h-4 text-[#7A0C1E]" /> Shopping Cart ({cart.reduce((tot, i) => tot + i.quantity, 0)} Items)
                            </h5>
                            
                            <div className="space-y-1 max-h-24 overflow-y-auto pr-1 scrollbar-thin text-[10px]">
                              {cart.map((item) => (
                                <div key={item.product.id} className="flex justify-between text-slate-600">
                                  <span>{item.quantity}x {item.product.name}</span>
                                  <span className="font-semibold">₹{item.product.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-800">Total:</span>
                              <span className="font-extrabold text-[#7A0C1E]">
                                ₹{cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)}
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                setIsCartOpen(true);
                                setIsOpen(false);
                              }}
                              className="w-full bg-[#7A0C1E] hover:bg-[#911327] text-[#D4AF37] font-sans font-bold text-[10px] py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <span>Proceed to Checkout</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Timestamp */}
                      <span className="text-[8px] text-slate-400 font-mono mt-0.5 px-1.5">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-center gap-2 bg-slate-100/50 p-2.5 rounded-2xl rounded-tl-none max-w-[80px] border border-slate-50">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Pills */}
              <div className="px-3 py-2 bg-[#FFFBF7] border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap shrink-0">
                {[
                  { label: '🎆 Browse Products', query: 'Browse Products' },
                  { label: '🚚 Check Delivery', query: 'Do you deliver to my pincode?' },
                  { label: '📦 Track My Order', query: 'Track order' },
                  { label: '🏷️ Discounts', query: 'discount coupons' },
                  { label: '🤝 Talk to Human', query: 'talk to human' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.query)}
                    className="bg-white hover:bg-[#7A0C1E]/5 text-slate-700 hover:text-[#7A0C1E] border border-slate-200 rounded-full px-3 py-1 text-[10px] font-sans font-bold shadow-2xs transition-all cursor-pointer flex-shrink-0"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend(inputText);
                  }}
                  placeholder="Ask Diya about crackers, shipping, etc..."
                  className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7A0C1E] font-sans"
                />
                <button
                  onClick={() => handleSend(inputText)}
                  disabled={!inputText.trim()}
                  className={`p-2.5 rounded-xl text-[#D4AF37] transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                    inputText.trim() 
                      ? 'bg-[#7A0C1E] hover:bg-[#911327] shadow' 
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                  aria-label="Send Message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Trigger Bubble */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          id="diya-text-chat-btn"
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#7A0C1E] hover:bg-[#911327] border-2 border-[#D4AF37] text-[#D4AF37] hover:text-white flex items-center justify-center shadow-2xl transition-all duration-300 relative cursor-pointer active:scale-95"
          aria-label="Open Chat Assistant"
        >
          {isOpen ? (
            <X className="w-6.5 h-6.5" />
          ) : (
            <MessageSquare className="w-6.5 h-6.5" />
          )}

          {/* Prompt/Notification Dot if closed and cart is updated */}
          {!isOpen && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#FF9933] border-2 border-[#7A0C1E] rounded-full animate-pulse flex items-center justify-center"></span>
          )}
        </button>
      </div>
    </>
  );
}
