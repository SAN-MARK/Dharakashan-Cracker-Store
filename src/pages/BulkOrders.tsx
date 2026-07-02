import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, ShieldCheck, Landmark, MapPin, Calendar, HelpCircle } from 'lucide-react';
import { dbService } from '../lib/supabase';
import { translate, Language } from '../lib/translations';

interface BulkOrdersProps {
  language: Language;
}

const DISTRICT_OPTIONS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 
  'Tirunelveli', 'Thanjavur', 'Erode', 'Vellore', 'Thoothukudi', 
  'Dindigul', 'Virudhunagar (Sivakasi)', 'Kanyakumari', 'Other (Outside TN)'
];

export default function BulkOrders({ language }: BulkOrdersProps) {
  const [formData, setFormData] = useState({
    name: '',
    org_name: '',
    contact_number: '',
    district: DISTRICT_OPTIONS[0],
    budget: '₹20,000 - ₹50,000',
    preferred_delivery_date: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact_number || !formData.org_name) {
      alert(language === 'en' ? "Please fill in all mandatory fields!" : "தயவுசெய்து தேவையான அனைத்து புலங்களையும் நிரப்பவும்!");
      return;
    }

    setIsSubmitting(true);
    const success = await dbService.submitBulkOrder({
      name: formData.name,
      org_name: formData.org_name,
      contact_number: formData.contact_number,
      district: formData.district,
      budget: formData.budget,
      preferred_delivery_date: formData.preferred_delivery_date,
      message: formData.message,
    });

    setIsSubmitting(false);
    if (success) {
      setSubmitSuccess(true);
      // Reset form
      setFormData({
        name: '',
        org_name: '',
        contact_number: '',
        district: DISTRICT_OPTIONS[0],
        budget: '₹20,000 - ₹50,000',
        preferred_delivery_date: '',
        message: ''
      });
    } else {
      alert(language === 'en' ? "Failed to submit request. Please try again." : "சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.");
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8 md:px-8 bg-[#FFF8F0]" id="bulk-orders-container">
      {/* Page Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 bg-[#7A0C1E]/5 px-3 py-1.5 rounded-full border border-[#7A0C1E]/15 text-[#7A0C1E] font-bold text-xs uppercase mb-3.5">
          <Landmark className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{language === 'en' ? 'Temple & Community Quotes' : 'கோவில் மற்றும் திருவிழா மொத்த ஆர்டர்கள்'}</span>
        </div>
        <h1 className="font-sans font-black text-2xl md:text-4xl text-slate-800 tracking-tight leading-none">
          {language === 'en' ? 'Community & Temple ' : ''}
          <span className="text-[#7A0C1E]">{language === 'en' ? 'Bulk Orders' : 'மொத்த கொள்முதல் படிவம்'}</span>
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
          {language === 'en' 
            ? 'Are you purchasing for a temple festival, housing association, or public community celebration? We specialize in supplying high-performance green crackers in bulk directly from Sivakasi with custom budgets.' 
            : 'கோயில் விழாக்கள், குடியிருப்போர் நலச் சங்கங்கள் அல்லது பொது விழாக்களுக்கு மொத்தமாக வாங்குகிறீர்களா? சிவகாசியில் இருந்து நேரடியாக சிறந்த தள்ளுபடியில் பிரத்தியேக கட்டணத்தில் அசல் பசுமை பட்டாசுகளை வழங்குகிறோம்.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Sourcing details / info blocks */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#7A0C1E] text-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-lg space-y-6">
            <h3 className="font-sans font-extrabold text-lg text-[#D4AF37]">
              {language === 'en' ? 'Why Order Bulk From Us?' : 'மொத்த கொள்முதலின் நன்மைகள்'}
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-[#D4AF37]">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#D4AF37]">
                    {language === 'en' ? '100% Genuine Sivakasi Sourcing' : '100% அசல் சிவகாசி தயாரிப்புகள்'}
                  </h4>
                  <p className="text-[11px] text-white/75 mt-0.5 leading-relaxed">
                    {language === 'en' 
                      ? 'No middlemen. Every item is packed directly at our partner factories in Sivakasi, Tamil Nadu.' 
                      : 'இடைத்தரகர்கள் இல்லை. தமிழ்நாடு சிவகாசியில் உள்ள எங்கள் சொந்த தொழிற்சாலையில் இருந்து நேரடியாக பேக் செய்யப்படுகிறது.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-[#D4AF37]">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#D4AF37]">
                    {language === 'en' ? 'Premium Custom Safety Curations' : 'பிரத்தியேக பாதுகாப்பு தேர்வுகள்'}
                  </h4>
                  <p className="text-[11px] text-white/75 mt-0.5 leading-relaxed">
                    {language === 'en' 
                      ? 'We curated PESO-approved formulas with custom low-noise items for temple-compliant timings.' 
                      : 'கோவில்களுக்கு உகந்த குறைந்த சத்தம் கொண்ட பசுமை பட்டாசுகள் மற்றும் அரசு விதிகளுக்குட்பட்ட மத்தாப்புகள்.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-[#D4AF37]">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#D4AF37]">
                    {language === 'en' ? 'Doorstep Freight Delivery' : 'வீட்டுக்கே வந்து சேரும் டெலிவரி'}
                  </h4>
                  <p className="text-[11px] text-white/75 mt-0.5 leading-relaxed">
                    {language === 'en' 
                      ? 'Specialized secure vehicle logistics for safe delivery to all Tamil Nadu districts.' 
                      : 'பாதுகாப்பான சரக்கு வாகனங்கள் மூலம் தமிழ்நாட்டின் அனைத்து மாவட்டங்களுக்கும் பத்திரமாக டெலிவரி செய்யப்படும்.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-5 text-center">
              <p className="text-[10px] text-white/50">
                {language === 'en' 
                  ? 'Note: This form is a price-quotation request. We will review inventory and respond via call/WhatsApp.' 
                  : 'குறிப்பு: இது ஒரு விலை மதிப்பீட்டு கோரிக்கை மட்டுமே. இருப்பு விவரங்களை சரிபார்த்து உங்களுக்கு அழைப்பு/வாட்ஸ்அப் மூலம் தெரிவிப்போம்.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form and Status */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            {submitSuccess ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100 text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-sans font-extrabold text-xl text-slate-800">
                  {language === 'en' ? 'Request Submitted Successfully!' : 'கோரிக்கை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  {language === 'en'
                    ? 'Thank you for reaching out to Dharakshan Cracker Store. Our dedicated Tamil Nadu sales coordinator will review your custom festival requirements and call/WhatsApp you within 24 hours.'
                    : 'தரக்சன் கிராக்கர் ஸ்டோரை தொடர்பு கொண்டதற்கு நன்றி. உங்களின் பண்டிகை தேவைகளை எங்கள் விற்பனை ஒருங்கிணைப்பாளர் சரிபார்த்து, 24 மணி நேரத்திற்குள் உங்களைத் தொடர்புகொள்வார்.'}
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="bg-[#7A0C1E] text-white hover:bg-[#911327] font-semibold text-xs py-2 px-5 rounded-xl cursor-pointer transition-all mt-4"
                >
                  {language === 'en' ? 'Submit Another Request' : 'மற்றொரு கோரிக்கையைச் சமர்ப்பிக்கவும்'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <h2 className="font-sans font-bold text-base text-slate-800 border-b border-slate-100 pb-2.5">
                  {language === 'en' ? 'Festival Bulk Quotation Form' : 'விழா மொத்த விலை கோரிக்கை படிவம்'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600">
                      {language === 'en' ? 'Contact Person Name' : 'தொடர்பு கொள்ள வேண்டியவர் பெயர்'} <span className="text-[#7A0C1E]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#7A0C1E] rounded-xl py-2 px-3.5 text-xs text-slate-800 focus:outline-hidden"
                      placeholder="e.g., Rajesh Kumar"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600">
                      {language === 'en' ? 'Organization / Temple Name' : 'அமைப்பு / கோவில் பெயர்'} <span className="text-[#7A0C1E]">*</span>
                    </label>
                    <input
                      type="text"
                      name="org_name"
                      required
                      value={formData.org_name}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#7A0C1E] rounded-xl py-2 px-3.5 text-xs text-slate-800 focus:outline-hidden"
                      placeholder="e.g., Arulmigu Mariamman Temple Committee"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600">
                      {language === 'en' ? 'WhatsApp / Contact Number' : 'வாட்ஸ்அப் / தொடர்பு எண்'} <span className="text-[#7A0C1E]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contact_number"
                      required
                      value={formData.contact_number}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#7A0C1E] rounded-xl py-2 px-3.5 text-xs text-slate-800 focus:outline-hidden font-mono"
                      placeholder="e.g., +91 98401 23456"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600">
                      {language === 'en' ? 'Preferred Delivery District' : 'வழங்கப்பட வேண்டிய மாவட்டம்'}
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#7A0C1E] rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-hidden"
                    >
                      {DISTRICT_OPTIONS.map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600">
                      {language === 'en' ? 'Estimated Budget (INR)' : 'மதிப்பிடப்பட்ட வரவுசெலவுத் திட்டம்'}
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#7A0C1E] rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-hidden font-mono"
                    >
                      <option value="₹20,000 - ₹50,000">₹20,000 - ₹50,000</option>
                      <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                      <option value="₹1,00,000 - ₹3,00,000">₹1,00,000 - ₹3,00,000</option>
                      <option value="₹3,00,000+">₹3,00,000+ (Grand Celebrations)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600">
                      {language === 'en' ? 'Preferred Delivery Date' : 'விருப்பமான டெலிவரி தேதி'}
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="preferred_delivery_date"
                        value={formData.preferred_delivery_date}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#7A0C1E] rounded-xl py-2 px-3.5 text-xs text-slate-800 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600">
                    {language === 'en' ? 'Additional Information / Special Fireworks requests' : 'கூடுதல் தகவல் / சிறப்பு பட்டாசு தேவைகள்'}
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#7A0C1E] rounded-xl py-2 px-3.5 text-xs text-slate-800 focus:outline-hidden"
                    placeholder={language === 'en' 
                      ? 'List any specific items like multi-shot sky rockets, color smoke, garlands, or silent options needed...' 
                      : 'உங்களுக்குத் தேவையான மல்டி-ஷாட் ராக்கெட்டுகள், வண்ணப் புகைகள், வாணவேடிக்கைகள் அல்லது பிற தேவைகளைக் குறிப்பிடவும்...'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#7A0C1E] hover:bg-[#911327] text-[#D4AF37] hover:text-white font-sans font-bold text-xs sm:text-sm py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting 
                      ? (language === 'en' ? 'Submitting Request...' : 'சமர்ப்பிக்கப்படுகிறது...') 
                      : (language === 'en' ? 'Submit Quotation Request' : 'விலை கோரிக்கையைச் சமர்ப்பிக்கவும்')}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
