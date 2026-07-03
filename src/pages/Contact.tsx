import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, Flame, Star, Clock, Globe } from 'lucide-react';
import DecorativeBorder from '../components/DecorativeBorder';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      alert('Please fill out all fields.');
      return;
    }

    setSubmitting(true);

    // Simulate async submission pipeline
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    }, 1200);
  };

  const FAQS = [
    {
      q: 'Do you deliver safely to residential apartments?',
      a: 'Yes, we pack all firecrackers inside fireproof, moisture-sealed containers. Our courier partners are certified for hazardous cargo transit under Class 1.4G guidelines, ensuring safe residential handovers.',
    },
    {
      q: 'Are your green crackers legally permitted?',
      a: 'Absolutely. Every product we offer carries a valid PESO registration number and uses alternative formulation technology (barium-free / low emissions), making them fully compliant with Supreme Court directions.',
    },
    {
      q: 'Can I cancel or modify my preorder before Diwali?',
      a: 'Yes! You can cancel or change your delivery date and product assortment up to 72 hours before your scheduled dispatch slot by sending an email with your Order ID.',
    },
    {
      q: 'What is your refund policy for failed fuses?',
      a: 'Our products are tested for a 99% ignition success rate. In the rare event of a dud cracker, do not attempt to light it again. Simply take a quick photo of the unburned product and send it to us for an instant refund/credit!',
    },
  ];

  return (
    <div className="w-full bg-[#FFF8F0] pb-12 text-left" id="contact-page-container">
      {/* Banner / Header */}
      <div className="bg-[#7A0C1E] text-white py-10 px-6 text-center border-b border-[#D4AF37]/30">
        <div className="max-w-3xl mx-auto">
          <span className="text-[#D4AF37] text-xs font-mono font-bold tracking-widest uppercase block mb-1">
            SUPPORT & ENQUIRIES
          </span>
          <h1 className="font-sans font-extrabold text-3xl text-white">
            Get In Touch
          </h1>
          <p className="text-xs md:text-sm text-[#FFF8F0]/75 mt-2 max-w-xl mx-auto leading-relaxed">
            Have questions about regional municipal guidelines, bulk wholesale pricing, or secure preorders? Reach out to our Sivakasi helpdesk today.
          </p>
        </div>
      </div>

      <DecorativeBorder />

      {/* Main Grid: Form and Contact details */}
      <section className="max-w-[1240px] mx-auto px-5 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8" id="contact-main-grid">
          
          {/* Left Column: Coordinates & Socials */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-[#D4AF37]/20 shadow-xs space-y-5">
              <h3 className="font-sans font-bold text-slate-800 text-sm pb-2 border-b">
                Dharakashan Cracker Store
              </h3>
              
              <div className="space-y-4">
                {/* Email */}
                <div className="flex gap-3 text-xs text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-[#7A0C1E]/5 flex items-center justify-center text-[#7A0C1E] flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Support Maildesk</h4>
                    <p className="font-mono mt-0.5">contact@dharakashancrackers.com</p>
                    <p className="text-[10px] text-slate-400">Response within 4 hours</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-3 text-xs text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-[#7A0C1E]/5 flex items-center justify-center text-[#7A0C1E] flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Customer Helpline</h4>
                    <p className="font-mono mt-0.5">+91 86680 45519</p>
                    <p className="text-[10px] text-slate-400">Call or WhatsApp anytime</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-3 text-xs text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-[#7A0C1E]/5 flex items-center justify-center text-[#7A0C1E] flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Store Address</h4>
                    <p className="mt-0.5 leading-relaxed">
                      45, Vandalur Main Road, Chengalpattu District, Tamil Nadu – 626123
                    </p>
                  </div>
                </div>

                {/* Store Hours */}
                <div className="flex gap-3 text-xs text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-[#7A0C1E]/5 flex items-center justify-center text-[#7A0C1E] flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Store Hours</h4>
                    <p className="mt-0.5 leading-relaxed font-mono">
                      Mon–Sat, 9:00 AM – 8:00 PM
                    </p>
                  </div>
                </div>

                {/* Website */}
                <div className="flex gap-3 text-xs text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-[#7A0C1E]/5 flex items-center justify-center text-[#7A0C1E] flex-shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Official Website</h4>
                    <a 
                      href="https://dharakashancrackerstore.vercel.app/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#7A0C1E] hover:underline block mt-0.5 font-mono break-all"
                    >
                      dharakashancrackerstore.vercel.app
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Badging widget */}
            <div className="bg-[#7A0C1E] text-[#FFF8F0] rounded-2xl p-5 border border-[#D4AF37]/30 shadow-md">
              <h4 className="font-sans font-bold text-[#D4AF37] text-xs uppercase tracking-wider mb-2">
                ⚠️ Emergency & Safety Support
              </h4>
              <p className="text-[11px] text-[#FFF8F0]/70 leading-relaxed">
                In case of transport inquiries, regulatory questions, or bulk school preorders, you can contact our special safety logistics pilot directly at <b className="text-white font-mono">+91 86680 45519</b>.
              </p>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 border border-[#D4AF37]/15 shadow-sm">
            <h3 className="font-sans font-bold text-slate-800 text-sm pb-3 border-b mb-4">
              Send Support Message
            </h3>

            {submitted ? (
              <div className="py-10 text-center space-y-3 animate-scale" id="contact-success-msg">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Send className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-800">Message Received!</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  We have queued your ticket in our CRM system. A Sivakasi safety coordinator will reach out to you via email shortly!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" id="contact-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sanjeev Kumar"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7A0C1E] focus:ring-1 focus:ring-[#7A0C1E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7A0C1E] focus:ring-1 focus:ring-[#7A0C1E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject of inquiry *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Bulk pre-booking discount details"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7A0C1E] focus:ring-1 focus:ring-[#7A0C1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your concerns or wholesale queries here..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7A0C1E] focus:ring-1 focus:ring-[#7A0C1E] resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#7A0C1E] hover:bg-[#911327] text-[#D4AF37] font-sans font-bold text-xs py-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Dispatch Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <DecorativeBorder />

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-5 py-6">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold text-[#7A0C1E] uppercase tracking-widest block font-mono">
            HAVE QUESTIONS?
          </span>
          <h2 className="font-sans font-extrabold text-2xl text-slate-800 tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
          <div className="w-12 h-1 bg-[#D4AF37] mx-auto mt-2.5 rounded-full"></div>
        </div>

        <div className="space-y-4" id="contact-faqs-list">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-xs text-left"
            >
              <h4 className="font-sans font-bold text-slate-800 text-xs sm:text-sm flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-[#7A0C1E] mt-0.5 flex-shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-500 mt-2 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
