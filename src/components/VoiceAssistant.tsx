import React, { useState, useEffect, useRef } from 'react';
import { Page, CartItem, Product } from '../types';
import { getItemTotalPrice } from '../lib/pricing';
import { Mic, MicOff, Volume2, X, HelpCircle, Sparkles, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceAssistantProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  products: Product[];
  searchFilters: { category: string; priceRange: string; searchTerm: string };
  setSearchFilters: (filters: { category: string; priceRange: string; searchTerm: string }) => void;
  setIsCartOpen: (open: boolean) => void;
}

export default function VoiceAssistant({
  currentPage,
  setCurrentPage,
  cart,
  addToCart,
  removeFromCart,
  products,
  searchFilters,
  setSearchFilters,
  setIsCartOpen,
}: VoiceAssistantProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showCommandsHelp, setShowCommandsHelp] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [hasGreeted, setHasGreeted] = useState(false);
  const [hasUpsold, setHasUpsold] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: 'add' | 'checkout'; data: any } | null>(null);

  const recognitionRef = useRef<any>(null);
  const lastSpokenRef = useRef<string>('');
  const speakTimeoutRef = useRef<any>(null);

  const cartRef = useRef(cart);
  const productsRef = useRef(products);
  const currentPageRef = useRef(currentPage);
  const hasGreetedRef = useRef(false);
  const hasUpsoldRef = useRef(false);
  const pendingActionRef = useRef<any>(null);

  useEffect(() => { cartRef.current = cart; }, [cart]);
  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => { currentPageRef.current = currentPage; }, [currentPage]);
  useEffect(() => { hasGreetedRef.current = hasGreeted; }, [hasGreeted]);
  useEffect(() => { hasUpsoldRef.current = hasUpsold; }, [hasUpsold]);
  useEffect(() => { pendingActionRef.current = pendingAction; }, [pendingAction]);

  // Convert numbers to spoken plain English word rupees for TTS consistency
  const getSpokenPrice = (price: number): string => {
    switch (price) {
      case 120: return "one hundred twenty rupees";
      case 150: return "one hundred fifty rupees";
      case 180: return "one hundred eighty rupees";
      case 220: return "two hundred twenty rupees";
      case 280: return "two hundred eighty rupees";
      case 350: return "three hundred fifty rupees";
      case 380: return "three hundred eighty rupees";
      case 420: return "four hundred twenty rupees";
      case 450: return "four hundred fifty rupees";
      case 490: return "four hundred ninety rupees";
      case 1299: return "one thousand two hundred ninety-nine rupees";
      case 2499: return "two thousand four hundred ninety-nine rupees";
      default: return `${price} rupees`;
    }
  };

  // Initialize Speech Recognition & Synthesis
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition && window.speechSynthesis) {
      setIsSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setTranscript('Listening...');
      };

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        setTranscript(resultText);
        processCommand(resultText);
      };

      rec.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          speak("I didn't hear anything. Please try again.", true);
          setTranscript('No speech detected.');
        } else if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setErrorMessage("Microphone access was blocked. Please allow microphone permissions in your browser's address bar and try again.");
          speak("Microphone access was blocked. Please allow microphone permissions in your browser's address bar and try again.");
          setTranscript('Microphone permission denied.');
        } else {
          setTranscript(`Error: ${event.error}`);
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Stop synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
      }
    };
  }, []);

  const speak = (text: string, autoListenAfterSpeech = false) => {
    if (!window.speechSynthesis) return;
    
    // Cancel current speaking
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      setIsSpeaking(true);
      setFeedbackText(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (autoListenAfterSpeech) {
        if (speakTimeoutRef.current) {
          clearTimeout(speakTimeoutRef.current);
        }
        speakTimeoutRef.current = setTimeout(() => {
          startListening();
        }, 150);
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    lastSpokenRef.current = text;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = async () => {
    setErrorMessage(null);
    if (!recognitionRef.current) return;
    // Cancel speaking first to avoid mic picking up speaker output
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      recognitionRef.current.start();
    } catch (err: any) {
      console.warn('Failed to start recognition or get mic permission:', err);
      const isPermissionDenied = 
        err.name === 'NotAllowedError' || 
        err.name === 'PermissionDeniedError' || 
        err.message?.toLowerCase().includes('denied') || 
        err.message?.toLowerCase().includes('allowed');
        
      if (isPermissionDenied) {
        setErrorMessage("Microphone access was blocked. Please allow microphone permissions in your browser's address bar and try again.");
        speak("Microphone access was blocked. Please allow microphone permissions in your browser's address bar and try again.");
      } else {
        setErrorMessage(`Failed to start voice assistant: ${err.message || err}`);
      }
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (err) {
      console.warn('Failed to stop recognition:', err);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      if (!hasGreetedRef.current) {
        setHasGreeted(true);
        speak("Hi! Welcome to Dharakshan Cracker Store — looking for something specific, or want some Diwali gift box suggestions?", true);
      } else {
        startListening();
      }
    }
  };

  // Fuzzy match product
  const findProductFuzzy = (query: string): Product | undefined => {
    const q = query.toLowerCase().trim();
    if (!q) return undefined;

    // 1. Exact match
    let found = productsRef.current.find((p) => p.name.toLowerCase() === q);
    if (found) return found;

    // 2. Contains match
    found = productsRef.current.find(
      (p) => p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase())
    );
    if (found) return found;

    // 3. Word match (at least 3 characters)
    const words = q.split(/\s+/).filter((w) => w.length >= 3);
    if (words.length > 0) {
      found = productsRef.current.find((p) => {
        const nameL = p.name.toLowerCase();
        return words.some((word) => nameL.includes(word));
      });
    }
    return found;
  };

  // Fuzzy match cart item
  const findCartItemFuzzy = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return undefined;

    // 1. Exact match
    let found = cartRef.current.find((item) => item.product.name.toLowerCase() === q);
    if (found) return found;

    // 2. Contains match
    found = cartRef.current.find(
      (item) =>
        item.product.name.toLowerCase().includes(q) ||
        q.includes(item.product.name.toLowerCase())
    );
    if (found) return found;

    // 3. Word match
    const words = q.split(/\s+/).filter((w) => w.length >= 3);
    if (words.length > 0) {
      found = cartRef.current.find((item) => {
        const nameL = item.product.name.toLowerCase();
        return words.some((word) => nameL.includes(word));
      });
    }
    return found;
  };

  // Main voice command processing
  const processCommand = (rawTranscript: string) => {
    const t = rawTranscript.toLowerCase().trim();

    // 1. Repeat Command
    if (t === 'repeat' || t.includes('repeat last') || t.includes('say that again') || t.includes('repeat the last')) {
      if (lastSpokenRef.current) {
        speak(lastSpokenRef.current, true);
      } else {
        speak("I haven't said anything yet.", true);
      }
      return;
    }

    // 2. Stop / Cancel
    if (t === 'stop' || t === 'cancel' || t.includes('stop listening') || t.includes('close assistant')) {
      stopListening();
      speak("Voice assistant stopped.");
      return;
    }

    // 3. Language triggers
    if (t.includes('hindi') || t.includes('hindi me') || t.includes('हिन्दी') || t.includes('हिंदी')) {
      speak("नमस्ते! धरकाशन पटाखा स्टोर में आपका स्वागत है। क्या आप दिवाली के लिए फुलझड़ी, अनार या कोई गिफ़्ट बॉक्स ढूँढ रहे हैं?", true);
      return;
    }
    if (t.includes('tamil') || t.includes('tamilil') || t.includes('தமிழ்') || t.includes('தமிழ் பேசு')) {
      speak("வணக்கம்! தாரகாஷன் பட்டாசு கடைக்கு உங்களை வரவேற்கிறோம். இந்த தீபாவளிக்கு மத்தாப்பு, அனார் அல்லது பரிசு பெட்டி தேடுகிறீர்களா?", true);
      return;
    }

    // 4. Emergency/Injuries Safety Guardrails
    if (
      t.includes('injured') || t.includes('injury') || t.includes('burned') || t.includes('fire') || 
      t.includes('accident') || t.includes('emergency') || t.includes('hurt') || t.includes('bleeding') || 
      t.includes('hospital') || t.includes('ambulance') || t.includes('burn')
    ) {
      speak("Please call one one two now. தயவுசெய்து இப்போதே 112-ஐ அழைக்கவும். कृपया अभी 112 पर कॉल करें।");
      stopListening();
      return;
    }

    // 5. Firework making / modification safety guardrail
    if (
      t.includes('how to make') || t.includes('make fireworks') || t.includes('make bomb') || 
      t.includes('diy fireworks') || t.includes('make cracker') || t.includes('modify') || 
      t.includes('strengthen') || t.includes('increase power') || t.includes('gunpowder')
    ) {
      speak("For safety, I cannot provide instructions on making, modifying, or increasing the power of any firework or cracker. Please only buy and use certified green crackers safely.", true);
      return;
    }

    // 6. Banned/Illegal crackers guardrail
    if (t.includes('banned') || t.includes('illegal') || t.includes('chinese') || t.includes('pollution')) {
      speak("Dharakashan only sells certified PESO-approved green crackers that comply with Indian regulations. We do not sell any banned or illegal crackers.", true);
      return;
    }

    // 6a. State/Local Regulation restrictions boundary
    if (t.includes('permitted') || t.includes('allowed') || t.includes('legal in') || t.includes('my city') || t.includes('my state') || t.includes('regulation')) {
      speak("Cracker rules vary by Indian state. Please check your local regulations to see which crackers are permitted in your specific area.", true);
      return;
    }

    // 6b. Exact Live Stock or Delivery Dates boundary
    if (t.includes('exact delivery') || t.includes('when will it arrive') || t.includes('live stock') || t.includes('how many left') || t.includes('exact date')) {
      speak("Let me help you check that on the product page, or our support team can confirm the exact delivery timing.", true);
      return;
    }

    // 6c. Order actions (refunds, payments, cancellations) boundary
    if (t.includes('refund') || t.includes('cancellation') || t.includes('cancel') || t.includes('pay directly') || t.includes('return')) {
      speak("I cannot process payments, refunds, or cancellations directly here. I will route you to the order page or connect you to our support team.", true);
      return;
    }

    // 7. Standard general safety precaution questions
    if (
      t.includes('safety') || t.includes('precaution') || t.includes('safe') || 
      t.includes('how to light') || t.includes('adult supervision') || t.includes('dud')
    ) {
      speak("Always light fireworks in open outdoor spaces, keep water nearby, ensure adult supervision for children, never relight duds, and maintain safe distance after lighting.", true);
      return;
    }

    // 8. Confirmation flow logic for pending actions
    if (pendingActionRef.current) {
      const isYes = t.includes('yes') || t.includes('sure') || t.includes('confirm') || t.includes('add it') || 
                    t.includes('yeah') || t.includes('ok') || t.includes('please') || t === 'yep' || t === 'y' || t.includes('add');
      const isNo = t.includes('no') || t.includes('cancel') || t.includes("don't") || t.includes('stop') || t === 'nope' || t === 'n';

      if (pendingActionRef.current.type === 'add') {
        if (isYes) {
          const { product, qty } = pendingActionRef.current.data;
          addToCart(product, qty);
          setPendingAction(null);

          let totalItemsInCart = cartRef.current.reduce((acc, item) => acc + item.quantity, 0) + qty;
          if (totalItemsInCart >= 3 && !hasUpsoldRef.current) {
            setHasUpsold(true);
            speak(`Added ${qty} pack of ${product.name} to your cart. Since you are buying multiple items, how about our Sparkle Shubh Labh Combo Box for one thousand two hundred ninety-nine rupees? It's a perfect family assortment!`, true);
          } else {
            speak(`Added ${qty} pack of ${product.name} to your cart. Would you like to add anything else, or are you ready to checkout?`, true);
          }
          return;
        } else if (isNo) {
          setPendingAction(null);
          speak("Alright, I won't add that. What else can I help you find?", true);
          return;
        }
      } else if (pendingActionRef.current.type === 'checkout') {
        if (isYes) {
          setPendingAction(null);
          setIsCartOpen(true);
          setCurrentPage('shop');
          speak("Opening your shopping cart now so you can complete your details. Happy Diwali!", false);
          return;
        } else if (isNo) {
          setPendingAction(null);
          speak("No problem. Let me know when you are ready to complete your purchase.", true);
          return;
        }
      }
    }

    // 9. Navigation commands
    if (t.includes('go to') || t.includes('navigate to') || t.includes('open page') || t === 'home' || t === 'shop' || t === 'contact' || t === 'about') {
      if (t.includes('home') || t === 'home') {
        setCurrentPage('home');
        speak("Navigating to home page. Welcome to Dharakashan Cracker Store!", true);
        return;
      }
      if (t.includes('shop') || t.includes('store') || t === 'shop') {
        setCurrentPage('shop');
        speak("Navigating to our shop page. Explore our safe, green crackers catalogue.", true);
        return;
      }
      if (t.includes('about') || t === 'about') {
        setCurrentPage('about');
        speak("Navigating to about page. Learn about our Form-24 compliant fireworks quality.", true);
        return;
      }
      if (t.includes('contact') || t === 'contact') {
        setCurrentPage('contact');
        speak("Navigating to contact page. Our customer helpline is 8 6 6 8 0 4 5 5 1 9.", true);
        return;
      }
    }

    // 10. List/Show Available products
    if (
      t.includes('read products') || t.includes('what is available') || t.includes("what's available") || 
      t.includes('list products') || t.includes('show available') || t.includes('what do you have') || 
      t.includes('catalog') || t.includes('products')
    ) {
      speak("We have Sparklers, Rockets, Flower Pots, Ground Chakras, and Gift Combos. For example, Imperial Golden Sparklers for one hundred eighty rupees or Sparkle Shubh Labh Combo Box for one thousand two hundred ninety-nine rupees. What are you looking for?", true);
      return;
    }

    // 11. Celebration recommendation triggers
    if (t.includes('sparkler') || t.includes('sparklers') || t.includes('kids') || t.includes('children') || t.includes('safe') || t.includes('phuljhari')) {
      speak("For kids and safe celebrations, I recommend our Imperial Golden Sparklers for one hundred eighty rupees, or Deluxe Spinning Ground Chakra for one hundred fifty rupees. Both are certified green crackers. Would you like me to add either to your cart?", true);
      return;
    }
    if (t.includes('display') || t.includes('sky') || t.includes('skyshot') || t.includes('rocket') || t.includes('rockets') || t.includes('anar') || t.includes('fountain') || t.includes('flower pot') || t.includes('flowerpot') || t.includes('pots')) {
      speak("For a majestic display, I recommend Glittering Star Sky-Shot Rocket for four hundred ninety rupees, or Royal Multi-Color Flower Pots for three hundred fifty rupees. Both are PESO approved. Would you like to add one?", true);
      return;
    }
    if (t.includes('gift') || t.includes('gifting') || t.includes('family') || t.includes('box') || t.includes('combos') || t.includes('combo')) {
      speak("Our top family box is the Sparkle Shubh Labh Combo Box for one thousand two hundred ninety-nine rupees, or the luxury Grand Emperor Celebration Box for two thousand four hundred ninety-nine rupees. They are safe, PESO-approved green crackers. Would you like to add one to your cart?", true);
      return;
    }
    if (t.includes('sound') || t.includes('crackers') || t.includes('loud') || t.includes('lari') || t.includes('garland') || t.includes('bijli')) {
      speak("We have Royal Red Fort one hundred Lari Garland for four hundred fifty rupees, and Safe Eco Bijli Crackers for one hundred twenty rupees. Shall I add one of these green crackers?", true);
      return;
    }

    // 12. Read my cart
    if (t.includes('read my cart') || t.includes('read cart') || t.includes('what is in my cart') || t.includes("what's in my cart") || t.includes('show cart')) {
      if (cartRef.current.length === 0) {
        speak("Your shopping cart is empty. What would you like to add? We have sparklers, flower pots, rockets, and gift boxes.", true);
        return;
      }
      let total = 0;
      const cartItemsText = cartRef.current.slice(0, 3).map((item) => {
        const itemTotal = item.product.price * item.quantity;
        total += itemTotal;
        return `${item.quantity} pack of ${item.product.name}`;
      }).join(', and ');

      if (cartRef.current.length > 3) {
        // Calculate full total for all items beyond first 3 too
        total = cartRef.current.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      }

      const cartSpeech = `You have ${cartItemsText} in your cart. Your total is ${getSpokenPrice(total)}. Are you ready to checkout?`;
      speak(cartSpeech, true);
      setPendingAction({ type: 'checkout', data: {} });
      return;
    }

    // 13. Add [product name] to cart / buy [product name] / put [product name] in cart
    const addRegex = /(?:add|buy|put|get)\s+(.+?)\s+(?:to cart|to bag|in cart|cart|bag)/i;
    const addSimpleRegex = /(?:add|buy|put|get)\s+(.+)/i;
    const addMatch = t.match(addRegex) || t.match(addSimpleRegex);

    if (addMatch && addMatch[1]) {
      const productNameQuery = addMatch[1].trim();
      if (productNameQuery !== 'cart' && productNameQuery !== 'bag' && productNameQuery !== 'products' && productNameQuery !== 'yes' && productNameQuery !== 'no') {
        const product = findProductFuzzy(productNameQuery);
        if (product) {
          setPendingAction({ type: 'add', data: { product, qty: 1 } });
          speak(`Would you like me to add one pack of ${product.name} for ${getSpokenPrice(product.price)} to your cart?`, true);
          return;
        }
      }
    }

    // 14. Remove [product name] from cart
    const removeRegex = /(?:remove|delete|take out)\s+(.+?)\s+(?:from cart|from bag|cart|bag)/i;
    const removeSimpleRegex = /(?:remove|delete|take out)\s+(.+)/i;
    const removeMatch = t.match(removeRegex) || t.match(removeSimpleRegex);

    if (removeMatch && removeMatch[1]) {
      const productNameQuery = removeMatch[1].trim();
      const cartItem = findCartItemFuzzy(productNameQuery);
      if (cartItem) {
        removeFromCart(cartItem.product.id);
        speak(`Removed ${cartItem.product.name} from your cart.`, true);
      } else {
        speak(`I couldn't find "${productNameQuery}" in your shopping cart.`, true);
      }
      return;
    }

    // 15. Checkout / Complete purchase
    if (t.includes('checkout') || t.includes('complete purchase') || t.includes('pay') || t.includes('order') || t.includes('ready') || t.includes('finish')) {
      if (cartRef.current.length === 0) {
        speak("Your cart is empty. Please add some crackers before checking out! What are you shopping for?", true);
        return;
      }
      const total = cartRef.current.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      speak(`Are you ready to complete your checkout for ${getSpokenPrice(total)}?`, true);
      setPendingAction({ type: 'checkout', data: {} });
      return;
    }

    // Default Fallback
    speak(
      `I heard you say: "${rawTranscript}". Try asking things like: "Show sparklers for kids", "Add Royal Multi-Color Flower Pots", or "Read my cart".`,
      true
    );
  };

  const isSecure = typeof window !== 'undefined' ? window.isSecureContext : true;

  if (!isSupported && isSecure) {
    return null; // Gracefully fallback and hide voice assistant button if Web Speech API isn't supported in a secure context
  }

  // Determine dynamic aria-label
  let micAriaLabel = "Start voice assistant";
  if (!isSecure) {
    micAriaLabel = "Voice assistant requires a secure connection (HTTPS)";
  } else if (errorMessage && errorMessage.includes("blocked")) {
    micAriaLabel = "Microphone blocked";
  } else if (isListening) {
    micAriaLabel = "Listening...";
  }

  return (
    <>
      {/* Voice Assistant Button and Live Info Floating Panel */}
      <div className="fixed bottom-20 md:bottom-6 left-6 z-50 flex flex-col items-start gap-3 font-sans select-none">
        
        {/* Secure Connection Warning Badge */}
        {!isSecure && (
          <div className="bg-red-950/90 text-white border border-red-500/30 px-3.5 py-2 rounded-xl text-xs shadow-lg max-w-xs text-center flex items-center gap-1.5" id="voice-secure-context-warning">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>Voice assistant requires a secure connection (HTTPS)</span>
          </div>
        )}

        {/* Expanded Speech Status / Command Helper Box */}
        <AnimatePresence>
          {(isListening || isSpeaking || showCommandsHelp || errorMessage) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              id="voice-assistant-panel"
              className="w-72 md:w-80 bg-slate-900/95 backdrop-blur-md text-white border border-[#D4AF37]/30 rounded-2xl p-4 shadow-2xl relative overflow-hidden"
            >
              {/* Gold decorative light strip */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-[#D4AF37] to-[#FF9933]"></div>
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
                <div className="flex items-center gap-1.5 text-[#D4AF37]">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">Voice Assistant</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowCommandsHelp(!showCommandsHelp)}
                    className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    title="Help Voice Commands"
                    aria-label="View voice assistant instructions"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      stopListening();
                      setShowCommandsHelp(false);
                      setErrorMessage(null);
                      if (window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                      }
                      setIsSpeaking(false);
                    }}
                    className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    aria-label="Close voice assistant logs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Speaking and Listening States */}
              <div className="space-y-3">
                {errorMessage && (
                  <div className="flex items-start gap-3 bg-red-950/40 border border-red-500/20 p-2.5 rounded-xl text-xs" id="voice-assistant-error">
                    <ShieldAlert className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1 text-left">
                      <p className="text-red-400 font-bold font-mono uppercase tracking-wider text-[9px]">Status / Error</p>
                      <p className="text-white/95 font-medium leading-relaxed">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {isListening && (
                  <div className="flex items-center gap-3 bg-red-950/40 border border-red-500/20 p-2.5 rounded-xl">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </div>
                    <div className="text-xs text-left">
                      <p className="text-red-400 font-bold font-mono uppercase tracking-wider text-[9px]">Listening Mode</p>
                      <p className="text-white/90 italic font-medium">"{transcript}"</p>
                    </div>
                  </div>
                )}

                {isSpeaking && !isListening && (
                  <div className="flex items-center gap-3 bg-amber-950/30 border border-amber-500/20 p-2.5 rounded-xl">
                    <Volume2 className="w-4 h-4 text-[#D4AF37] animate-bounce" />
                    <div className="text-xs flex-1 text-left">
                      <p className="text-[#D4AF37] font-bold font-mono uppercase tracking-wider text-[9px]">Speaking</p>
                      <p className="text-white/85 line-clamp-3 font-medium">"{feedbackText}"</p>
                    </div>
                  </div>
                )}

                {/* Helper Command Reference Tabs */}
                {showCommandsHelp && (
                  <div className="bg-slate-950/60 p-2.5 rounded-xl text-[11px] text-slate-300 space-y-1.5 max-h-48 overflow-y-auto font-sans leading-relaxed text-left">
                    <p className="font-bold text-white text-xs text-[#D4AF37] mb-1">Supported Voice Commands:</p>
                    <p>🗣️ <b className="text-white">"Search for [product]"</b> — e.g. <span className="italic">"Search for Sparklers"</span></p>
                    <p>🗣️ <b className="text-white">"What's available"</b> — lists active items</p>
                    <p>🗣️ <b className="text-white">"Add [product] to cart"</b> — adds to shopping bag</p>
                    <p>🗣️ <b className="text-white">"Read my cart"</b> — counts items & announces total</p>
                    <p>🗣️ <b className="text-white">"Remove [product]"</b> — deletes product from cart</p>
                    <p>🗣️ <b className="text-white">"Go to [page]"</b> — Navigate home, shop, about, contact, or checkout</p>
                    <p>🗣️ <b className="text-white">"Repeat"</b> — repeat the last spoken response</p>
                    <p>🗣️ <b className="text-white">"Stop"</b> — stops active assistant listening</p>
                  </div>
                )}

                {!isListening && !isSpeaking && !showCommandsHelp && !errorMessage && (
                  <p className="text-xs text-slate-400 text-center py-2">
                    Press the microphone button to start shopping by voice!
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Circular Trigger Microphone Button */}
        <button
          onClick={toggleListening}
          disabled={!isSecure}
          id="voice-assistant-mic-btn"
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative border-2 ${
            !isSecure
              ? 'bg-slate-700 border-slate-500 text-slate-400 cursor-not-allowed opacity-75'
              : isListening
                ? 'bg-red-600 border-red-400 text-white animate-pulse cursor-pointer active:scale-95'
                : 'bg-[#7A0C1E] hover:bg-[#911327] border-[#D4AF37] text-[#D4AF37] hover:text-white cursor-pointer active:scale-95'
          }`}
          aria-label={micAriaLabel}
          aria-pressed={isListening}
          title={!isSecure ? "Voice assistant requires a secure connection (HTTPS)" : undefined}
        >
          {isListening ? (
            <Mic className="w-6.5 h-6.5" />
          ) : (
            <MicOff className="w-6.5 h-6.5" />
          )}

          {/* Golden pulsing ring around active microphone */}
          {isListening && (
            <span className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping -z-10 opacity-75"></span>
          )}
        </button>
      </div>
    </>
  );
}
