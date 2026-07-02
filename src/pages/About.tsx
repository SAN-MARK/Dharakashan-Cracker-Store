import React from 'react';
import { Award, ShieldCheck, Zap, Factory, Landmark, History, Clock } from 'lucide-react';
import DecorativeBorder from '../components/DecorativeBorder';
import { translate, Language } from '../lib/translations';

// Import the generated family celebration image
import familyDiwali from '../assets/images/family_diwali_1782969856517.jpg';

interface AboutProps {
  language?: Language;
}

export default function About({ language = 'en' }: AboutProps) {
  const cards = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#7A0C1E]" />,
      title: language === 'en' ? 'PESO-Approved Safety Standards' : 'PESO-அங்கீகரிக்கப்பட்ட பாதுகாப்புத் தரங்கள்',
      desc: language === 'en' 
        ? 'All fireworks in our catalog strictly adhere to the Petroleum and Explosives Safety Organisation (PESO) regulations. We use green cracker technology that utilizes low-emission chemical formulations.'
        : 'எங்கள் பட்டியலில் உள்ள அனைத்து பட்டாசுகளும் பெட்ரோலியம் மற்றும் வெடிபொருள் பாதுகாப்பு அமைப்பின் (PESO) விதிகளுக்கு உட்பட்டவை. குறைந்த உமிழ்வு கொண்ட பசுமை பட்டாசு தொழில்நுட்பங்களை மட்டுமே பயன்படுத்துகிறோம்.',
    },
    {
      icon: <Award className="w-6 h-6 text-[#7A0C1E]" />,
      title: language === 'en' ? 'Certified & Lab-Tested Products' : 'சான்றளிக்கப்பட்ட மற்றும் சோதிக்கப்பட்ட பொருட்கள்',
      desc: language === 'en'
        ? 'Our batches undergo stringent safety tests for fuse timing, horizontal stability, decibel output levels, and spark density before packing. Buy with 100% peace of mind.'
        : 'எங்களின் ஒவ்வொரு தொகுதி பட்டாசுகளும் பேக்கிங் செய்யப்படுவதற்கு முன்பு திரி நேரம், கிடைமட்ட நிலைத்தன்மை, சத்தம் மற்றும் தீப்பொறி அடர்த்தி ஆகியவற்றிற்காக கடுமையான பாதுகாப்பு சோதனைகளுக்கு உட்படுத்தப்படுகின்றன.',
    },
    {
      icon: <Factory className="w-6 h-6 text-[#7A0C1E]" />,
      title: language === 'en' ? 'Direct Sivakasi Factory Pricing' : 'நேரடி சிவகாசி தொழிற்சாலை விலை',
      desc: language === 'en'
        ? 'By cutting out middlemen, stockists, and multiple transport agents, we source directly from licensed Sivakasi manufacturers, passing over 40% in price savings straight to your family.'
        : 'இடைத்தரகர்கள் மற்றும் ஏஜெண்டுகளைத் தவிர்த்து, உரிமம் பெற்ற சிவகாசி உற்பத்தியாளர்களிடமிருந்து நேரடியாகக் கொள்முதல் செய்வதன் மூலம் 40% க்கும் அதிகமான சேமிப்பை உங்கள் குடும்பத்திற்கு வழங்குகிறோம்.',
    },
    {
      icon: <Zap className="w-6 h-6 text-[#7A0C1E]" />,
      title: language === 'en' ? 'Secure & On-Time Delivery' : 'பாதுகாப்பான மற்றும் சரியான நேர டெலிவரி',
      desc: language === 'en'
        ? 'Firework logistics require expert precision. We work with specialized safety-freight channels delivering in fire-resistant multi-layered cardboard cartons well before Diwali night.'
        : 'பட்டாசு விநியோகத்திற்கு அதிக பாதுகாப்பு தேவை. தீப்பிடிக்காத பல அடுக்கு அட்டெப் பெட்டிகளில் தீபாவளிக்கு முன்பே பாதுகாப்பாக வழங்குகிறோம்.',
    },
  ];

  return (
    <div className="w-full bg-[#FFF8F0] pb-12 text-left" id="about-page-container">
      {/* Banner / Header */}
      <div className="bg-[#7A0C1E] text-white py-12 px-6 text-center border-b border-[#D4AF37]/30">
        <div className="max-w-3xl mx-auto">
          <span className="text-[#D4AF37] text-xs font-mono font-bold tracking-widest uppercase block mb-1">
            {language === 'en' ? 'ABOUT DHARAKSHAN CRACKER STORE' : 'தரக்சன் கிராக்கர் ஸ்டோர் பற்றி'}
          </span>
          <h1 className="font-sans font-black text-3xl md:text-4xl text-white">
            {translate('about.story_title', language)}
          </h1>
          <p className="text-xs md:text-sm text-[#FFF8F0]/75 mt-2 max-w-xl mx-auto leading-relaxed">
            {language === 'en'
              ? 'Bringing families together safely through the brilliant colors of premium, chemical-conscious green firecrackers since 1998.'
              : '1998 முதல் பிரீமியம், சுற்றுச்சூழல் விழிப்புணர்வுடன் கூடிய பசுமை பட்டாசுகளின் பிரகாசமான வண்ணங்கள் மூலம் குடும்பங்களை பாதுகாப்பாக இணைக்கிறோம்.'}
          </p>
        </div>
      </div>

      <DecorativeBorder />

      {/* Narrative Section - Side-by-Side */}
      <section className="max-w-[1240px] mx-auto px-5 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center" id="about-narrative-section">
          {/* Left Column: Image of Family */}
          <div className="md:col-span-5 relative">
            <div className="absolute inset-0 bg-[#D4AF37] rounded-3xl rotate-3 scale-98 opacity-50 -z-10"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 aspect-4/3">
              <img
                src={familyDiwali}
                alt="Indian family celebrating Diwali together with sparklers"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Ambient golden glow behind family photo */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#FF9933]/20 rounded-full blur-2xl -z-10"></div>
          </div>

          {/* Right Column: Mission and Values Text */}
          <div className="md:col-span-7 space-y-4">
            <span className="text-xs font-bold text-[#7A0C1E] font-mono uppercase tracking-widest">
              {language === 'en' ? 'OUR JOURNEY & VALUES' : 'எங்கள் பயணம் மற்றும் மதிப்புகள்'}
            </span>
            <h2 className="font-sans font-black text-2xl text-slate-800 leading-tight">
              {language === 'en' 
                ? 'A Safer, Brighter, Green Celebration for Every Indian Home' 
                : 'ஒவ்வொரு இந்திய வீட்டிற்கும் பாதுகாப்பான, பிரகாசமான, பசுமையான கொண்டாட்டம்'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'en'
                ? 'Dharakshan Cracker Store was founded in Sivakasi with a single ambitious mission: to revolutionize the traditional firecrackers sector in India. Historically, finding high-quality, legally compliant, and safety-tested crackers meant dealing with unorganized local stalls, unpredictable price swings, and unknown chemical configurations.'
                : 'இந்தியாவின் பாரம்பரிய பட்டாசு துறையில் ஒரு புரட்சியை ஏற்படுத்தும் லட்சியத்துடன் சிவகாசியில் தரக்சன் கிராக்கர் ஸ்டோர் தொடங்கப்பட்டது. வரலாற்று ரீதியாக, தரமான மற்றும் பாதுகாப்பான பட்டாசுகளை கண்டுபிடிப்பது சவாலாக இருந்தது.'}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'en'
                ? 'We changed that by creating a digital-first direct platform that emphasizes rigorous PESO checks and chemical auditing. Today, we stand proud as a pioneering e-commerce vendor delivering exclusively green crackers that emit 30-35% fewer chemical dust particles than ordinary alternatives.'
                : 'நாங்கள் கடுமையான PESO சோதனைகள் மற்றும் சுற்றுச்சூழல் நட்பு தணிக்கைகளை வலியுறுத்தி ஒரு நவீன டிஜிட்டல் தளத்தை உருவாக்கினோம். இன்று, சாதாரண பட்டாசுகளை விட 30-35% குறைவான உமிழ்வைக் கொண்ட பசுமை பட்டாசுகளை வழங்கும் முன்னணி தளமாக நாங்கள் பெருமையுடன் நிற்கிறோம்.'}
            </p>

            <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-[#D4AF37] text-xs text-amber-900 leading-relaxed">
              <b>{language === 'en' ? 'Dharakshan (Founder Note):' : 'நிறுவனர் குறிப்பு (தரக்சன்):'}</b> {language === 'en' 
                ? '"As a young college student starting this business, my goal is to ensure every family celebrates with the highest quality, direct Sivakasi green crackers. A celebration can only be happy when everyone in the household is completely safe. We prioritize your children\'s and pets\' wellness by strictly offering low-noise, eco-sensory formulations in all sparklers and fountains."'
                : '"ஒரு கல்லூரி மாணவராக இந்த ஸ்டார்ட்அப்-ஐத் தொடங்கிய எனது லட்சியம், ஒவ்வொரு குடும்பமும் குறைந்த விலையில் தரமான பசுமைப் பட்டாசுகளுடன் கொண்டாடுவதை உறுதி செய்வதே ஆகும். குடும்பத்தில் உள்ள அனைவரும் பாதுகாப்பாக இருக்கும்போது மட்டுமே கொண்டாட்டம் மகிழ்ச்சியாக இருக்க முடியும். எங்கள் தயாரிப்புகளில் குறைந்த சத்தம் மற்றும் பாதுகாப்பு விதிகளுக்கு முன்னுரிமை அளிக்கிறோம்."'}
            </div>
          </div>
        </div>
      </section>

      {/* Narrative cards */}
      <section className="bg-slate-50 border-y border-slate-200 py-10 px-5">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#7A0C1E]/5 flex items-center justify-center text-[#7A0C1E]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-slate-800 text-sm">{translate('about.years', language)}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {language === 'en'
                  ? 'Dharakshan started this e-commerce platform during his college days with a vision to streamline and digitize firework sourcing directly from manufacturing units in Sivakasi.'
                  : 'கல்லூரியில் படிக்கும் போதே, சிவகாசி உற்பத்தி அலகுகளிலிருந்து நேரடியாக பட்டாசு விநியோகத்தை எளிமையாக்கவும் டிஜிட்டல் மயமாக்கவும் தரக்சன் இந்த மின்-வணிக தளத்தைத் தொடங்கினார்.'}
              </p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-4 block">{language === 'en' ? 'Student Initiative' : 'மாணவர் முயற்சி'}</span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#7A0C1E]/5 flex items-center justify-center text-[#7A0C1E]">
                <History className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-slate-800 text-sm">{translate('about.heritage', language)}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {language === 'en'
                  ? 'We work hand-in-hand with licensed, premium heritage factories in Sivakasi to source high-quality green crackers that bypass unorganized local retailers entirely.'
                  : 'உரிமம் பெற்ற, பாரம்பரிய சிவகாசி தொழிற்சாலைகளுடன் இணைந்து சிறந்த முறையில் நேரடி விநியோகம் செய்கிறோம்.'}
              </p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-4 block">{language === 'en' ? 'Direct Sourcing Model' : 'நேரடி கொள்முதல்'}</span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#7A0C1E]/5 flex items-center justify-center text-[#7A0C1E]">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-slate-800 text-sm">{translate('about.safety', language)}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {language === 'en'
                  ? 'All listed items are certified under chemical-conscious, PESO-approved, and low-decibel green formulas, prioritizing your children’s and pets’ safe celebrations.'
                  : 'அனைத்து தயாரிப்புகளும் சான்றளிக்கப்பட்ட குறைந்த சத்தம் மற்றும் குறைந்த புகை கொண்ட சூழல் நட்பு பசுமை பட்டாசு விதிகளுக்கு உட்பட்டவை.'}
              </p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-4 block">{language === 'en' ? 'Certified Eco Standards' : 'சான்றளிக்கப்பட்ட பசுமை தரம்'}</span>
          </div>
        </div>
      </section>

      <DecorativeBorder />

      {/* Why Buy From Us Grid */}
      <section className="max-w-[1240px] mx-auto px-5 py-6">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold text-[#7A0C1E] uppercase tracking-widest block font-mono">
            {language === 'en' ? 'GOLD STANDARDS' : 'தங்கத் தரம்'}
          </span>
          <h2 className="font-sans font-black text-2xl text-slate-800 tracking-tight mt-1">
            {language === 'en' ? 'Why Families Buy From Us' : 'குடும்பங்கள் ஏன் எங்களை தேர்வு செய்கிறார்கள்'}
          </h2>
          <div className="w-12 h-1 bg-[#D4AF37] mx-auto mt-2.5 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="about-why-buy-from-us-grid">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-[#D4AF37]/15 shadow-xs hover:shadow-md hover:border-[#D4AF37]/35 transition-all duration-300 flex gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#7A0C1E]/5 flex items-center justify-center flex-shrink-0 border border-[#7A0C1E]/10">
                {card.icon}
              </div>
              <div className="space-y-1.5">
                <h3 className="font-sans font-bold text-slate-800 text-sm">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
