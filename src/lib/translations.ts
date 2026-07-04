export type Language = 'en' | 'ta';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'Our Story',
    'nav.shop': 'Products',
    'nav.combo': 'Build Combo 🎁',
    'nav.contact': 'Contact Us',
    'nav.bulk': 'Bulk Orders 🏛️',
    
    // Categories
    'cat.all': 'All Products',
    'cat.sparklers': 'Sparklers',
    'cat.flowerpots': 'Flower Pots',
    'cat.rockets': 'Rockets',
    'cat.chakras': 'Ground Spinners',
    'cat.sound': 'Sound Crackers',
    'cat.combos': 'Gift Combos',

    // Trust badge & general tags
    'badge.sivakasi': 'Direct Sivakasi Stock',
    'badge.sivakasi.desc': '100% Genuine Sivakasi Sourced & Crafted',
    'badge.direct': 'Direct from Sivakasi',
    
    // Delivery Checker
    'delivery.title': 'Tamil Nadu Delivery Checker',
    'delivery.placeholder': 'Enter TN District or Pincode (e.g. 600 or Chennai)',
    'delivery.check': 'Check Serviceability',
    'delivery.available': '✓ Superfast Delivery Available in this Area!',
    'delivery.not_available': '❌ Currently not serviceable in this area.',
    'delivery.estimate': 'Estimated Delivery time:',
    'delivery.days': 'days',

    // Titles
    'home.hero_title': 'Light Up Your Celebrations Safely',
    'home.hero_sub': 'Premium quality, environment-friendly eco crackers sourced directly from the manufacturing heart of Sivakasi, Tamil Nadu.',
    'home.shop_now': 'Shop Now',
    'home.build_combo': 'Customize Your Box',
    'home.best_sellers': 'Featured Best Sellers',
    'home.categories_title': 'Shop by Firework Category',
    'home.countdown_title': 'Diwali Festival Grand Countdown 🪔',

    // Reviews & Detail Page
    'review.title': 'Customer Reviews',
    'review.write': 'Write a Review',
    'review.name': 'Your Name',
    'review.comment': 'Your Comment',
    'review.rating': 'Rating',
    'review.submit': 'Submit Review',
    'review.success': 'Thank you! Your review has been added successfully.',
    'review.no_reviews': 'No reviews yet for this product. Be the first to review!',

    // Cart / Checkout
    'cart.title': 'Your Festive Bag',
    'cart.checkout': 'Proceed to Checkout',
    'checkout.minimum_error': 'Minimum order amount is ₹2000. Please add more items to proceed.',
    'checkout.age_confirm': 'I confirm I am 18+ years old and purchasing for legal use only.',
    'checkout.cod': 'Cash on Delivery (COD)',
    'checkout.razorpay': 'Pay securely with Razorpay',
    'checkout.payment_method': 'Select Payment Method',
    'checkout.place_order': 'Place Order Now',
    
    // About / Our Story
    'about.story_title': 'Sparks of a College Student Venture',
    'about.years': 'College Student Startup',
    'about.heritage': 'Our Sourcing Story',
    'about.safety': 'PESO-Approved Eco Standards'
  },
  ta: {
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.about': 'எங்கள் கதை',
    'nav.shop': 'பட்டாசுகள்',
    'nav.combo': 'பெட்டியை உருவாக்கு 🎁',
    'nav.contact': 'தொடர்பு கொள்ள',
    'nav.bulk': 'மொத்த ஆர்டர்கள் 🏛️',
    
    // Categories
    'cat.all': 'அனைத்து பட்டாசுகள்',
    'cat.sparklers': 'கம்பி மத்தாப்பு',
    'cat.flowerpots': 'பூச்சட்டி',
    'cat.rockets': 'ராக்கெட்',
    'cat.chakras': 'தரைச் சக்கரம்',
    'cat.sound': 'சத்தப் பட்டாசுகள்',
    'cat.combos': 'பரிசுப் பெட்டிகள்',

    // Trust badge
    'badge.sivakasi': 'நேரடி சிவகாசி பட்டாசுகள்',
    'badge.sivakasi.desc': '100% அசல் சிவகாசியில் தயாரிக்கப்பட்டு பெறப்பட்டது',
    'badge.direct': 'சிவகாசியில் இருந்து நேரடித் தயாரிப்பு',

    // Delivery Checker
    'delivery.title': 'தமிழ்நாடு டெலிவரி சரிபார்ப்பு',
    'delivery.placeholder': 'மாவட்டம் அல்லது பின்கோடு உள்ளிடவும் (எ.கா: 600 அல்லது சென்னை)',
    'delivery.check': 'சரிபார்க்கவும்',
    'delivery.available': '✓ இந்த பகுதியில் அதிவிரைவு டெலிவரி வசதி உள்ளது!',
    'delivery.not_available': '❌ மன்னிக்கவும், தற்போது இந்த பகுதியில் டெலிவரி இல்லை.',
    'delivery.estimate': 'மதிப்பிடப்பட்ட டெலிவரி நேரம்:',
    'delivery.days': 'நாட்கள்',

    // Titles
    'home.hero_title': 'பாதுகாப்பான முறையில் தீபாவளியைக் கொண்டாடுங்கள்',
    'home.hero_sub': 'சிவகாசி தொழிற்சாலையில் இருந்து நேரடியாகப் பெறப்பட்ட உயர்தர சுற்றுச்சூழல் நட்பு பசுமைப் பட்டாசுகள்.',
    'home.shop_now': 'வாங்கச் செல்லவும்',
    'home.build_combo': 'சொந்தப் பெட்டி தயார்செய்',
    'home.best_sellers': 'சிறந்த விற்பனைப் பொருட்கள்',
    'home.categories_title': 'பிரிவு வாரியாக வாங்கவும்',
    'home.countdown_title': 'தீபாவளி பண்டிகை கவுண்ட்டவுன் 🪔',

    // Reviews & Detail Page
    'review.title': 'வாடிக்கையாளர் மதிப்புரைகள்',
    'review.write': 'மதிப்புரை எழுதவும்',
    'review.name': 'உங்கள் பெயர்',
    'review.comment': 'உங்கள் கருத்து',
    'review.rating': 'மதிப்பீடு',
    'review.submit': 'மதிப்புரையைச் சமர்ப்பி',
    'review.success': 'நன்றி! உங்கள் மதிப்புரை வெற்றிகரமாகச் சேர்க்கப்பட்டது.',
    'review.no_reviews': 'மதிப்புரைகள் இன்னும் இல்லை. முதல் மதிப்புரையை எழுதவும்!',

    // Cart / Checkout
    'cart.title': 'உங்களின் பண்டிகைப் பை',
    'cart.checkout': 'செக்அவுட் செய்யச் செல்லவும்',
    'checkout.minimum_error': 'குறைந்தபட்ச ஆர்டர் மதிப்பு ₹2000. ஆர்டர் செய்ய மேலும் சில பொருட்களைச் சேர்க்கவும்.',
    'checkout.age_confirm': 'எனக்கு 18+ வயது ஆகிறது என்பதையும், சட்டப்பூர்வ தேவைக்காக மட்டுமே வாங்குகிறேன் என்பதையும் உறுதிப்படுத்துகிறேன்.',
    'checkout.cod': 'கேஷ் ஆன் டெலிவரி (COD)',
    'checkout.razorpay': 'Razorpay மூலம் பாதுகாப்பாக பணம் செலுத்துங்கள்',
    'checkout.payment_method': 'பணம் செலுத்தும் முறையைத் தேர்ந்தெடுக்கவும்',
    'checkout.place_order': 'ஆர்டரை உறுதி செய்யவும்',

    // About / Our Story
    'about.story_title': 'ஒரு கல்லூரி மாணவரின் முயற்சி',
    'about.years': 'கல்லூரி மாணவரின் ஸ்டார்ட்அப்',
    'about.heritage': 'எங்கள் கொள்முதல் பயணம்',
    'about.safety': 'சுற்றுச்சூழல் நட்பு பசுமைப் பட்டாசுகள்'
  }
};

/**
 * Global Localized Text Resolver Helper
 */
export function translate(key: string, lang: Language): string {
  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  return dictionary[key] || TRANSLATIONS['en'][key] || key;
}
