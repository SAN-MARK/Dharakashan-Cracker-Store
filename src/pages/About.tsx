import React from 'react';
import { Award, ShieldCheck, Zap, Factory } from 'lucide-react';
import DecorativeBorder from '../components/DecorativeBorder';

// Import the generated family celebration image
import familyDiwali from '../assets/images/family_diwali_1782969856517.jpg';

export default function About() {
  const cards = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#7A0C1E]" />,
      title: 'PESO-Approved Safety Standards',
      desc: 'All fireworks in our catalog strictly adhere to the Petroleum and Explosives Safety Organisation (PESO) regulations. We use green cracker technology that utilizes low-emission chemical formulations.',
    },
    {
      icon: <Award className="w-6 h-6 text-[#7A0C1E]" />,
      title: 'Certified & Lab-Tested Products',
      desc: 'Our batches undergo stringent safety tests for fuse timing, horizontal stability, decibel output levels, and spark density before packing. Buy with 100% peace of mind.',
    },
    {
      icon: <Factory className="w-6 h-6 text-[#7A0C1E]" />,
      title: 'Direct Sivakasi Factory Pricing',
      desc: 'By cutting out middlemen, stockists, and multiple transport agents, we source directly from licensed Sivakasi manufacturers, passing over 40% in price savings straight to your family.',
    },
    {
      icon: <Zap className="w-6 h-6 text-[#7A0C1E]" />,
      title: 'Secure & On-Time Delivery',
      desc: 'Firework logistics require expert precision. We work with specialized safety-freight channels delivering in fire-resistant multi-layered cardboard cartons well before Diwali night.',
    },
  ];

  return (
    <div className="w-full bg-[#FFF8F0] pb-12 text-left" id="about-page-container">
      {/* Banner / Header */}
      <div className="bg-[#7A0C1E] text-white py-12 px-6 text-center border-b border-[#D4AF37]/30">
        <div className="max-w-3xl mx-auto">
          <span className="text-[#D4AF37] text-xs font-mono font-bold tracking-widest uppercase block mb-1">
            ABOUT SPARKLE DIWALI
          </span>
          <h1 className="font-sans font-extrabold text-3xl md:text-4xl text-white">
            Our Heritage & Commitment
          </h1>
          <p className="text-xs md:text-sm text-[#FFF8F0]/75 mt-2 max-w-xl mx-auto leading-relaxed">
            Bringing families together safely through the brilliant colors of premium, chemical-conscious green firecrackers since 1998.
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
              OUR JOURNEY & VALUES
            </span>
            <h2 className="font-sans font-extrabold text-2xl text-slate-800 leading-tight">
              A Safer, Brighter, Green Celebration for Every Indian Home
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sparkle Diwali was founded in Sivakasi with a single ambitious mission: to revolutionize the traditional firecrackers sector in India. Historically, finding high-quality, legally compliant, and safety-tested crackers meant dealing with unorganized local stalls, unpredictable price swings, and unknown chemical configurations.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              We changed that by creating a digital-first direct platform that emphasizes rigorous PESO checks and chemical auditing. Today, we stand proud as a pioneering e-commerce vendor delivering exclusively green crackers that emit <b>30-35% fewer chemical dust particles</b> than ordinary alternatives.
            </p>

            <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-[#D4AF37] text-xs text-amber-900 leading-relaxed">
              <b>Shubh Sandesh (Founder Note):</b> "A celebration can only be happy when everyone in the household is completely safe. We prioritize your children's and pets' wellness by strictly offering low-noise, eco-sensory formulations in all sparklers and fountains."
            </div>
          </div>
        </div>
      </section>

      <DecorativeBorder />

      {/* Why Buy From Us Grid */}
      <section className="max-w-[1240px] mx-auto px-5 py-6">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold text-[#7A0C1E] uppercase tracking-widest block font-mono">
            GOLD STANDARDS
          </span>
          <h2 className="font-sans font-extrabold text-2xl text-slate-800 tracking-tight mt-1">
            Why Families Buy From Us
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
