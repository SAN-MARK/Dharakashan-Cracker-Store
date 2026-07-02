import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, Heart } from 'lucide-react';
import { UserSession } from '../types';

// Import our generated hero banner
import heroBanner from '../assets/images/hero_banner_diwali_1782969842884.jpg';

interface LoginProps {
  handleLoginSuccess: (name: string, email: string) => void;
}

export default function Login({ handleLoginSuccess }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && !fullName) {
      alert('Please enter your full name.');
      return;
    }

    setLoading(true);

    // Simulate authentication pipeline
    setTimeout(() => {
      setLoading(false);
      const name = isSignUp ? fullName : email.split('@')[0];
      setSuccessMsg(isSignUp ? 'Registration Successful! Greeting you now...' : 'Welcome back! Logging you in...');
      
      setTimeout(() => {
        handleLoginSuccess(name, email);
      }, 800);
    }, 1200);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#FFF8F0] flex items-center justify-center p-4 md:p-8" id="login-page-container">
      <div className="bg-white rounded-3xl overflow-hidden border border-[#D4AF37]/25 shadow-2xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Festive Ambient Hero Panel (Responsive Stack) */}
        <div className="relative bg-slate-900 overflow-hidden flex flex-col justify-end p-6 md:p-10 text-white min-h-[160px] md:min-h-[480px]">
          {/* Hero background */}
          <img
            src={heroBanner}
            alt="Fireworks at night backdrop"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#110103] via-black/40 to-[#110103]/30"></div>

          <div className="relative z-10 space-y-2 text-left">
            <span className="text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-widest bg-[#D4AF37]/20 border border-[#D4AF37]/30 py-0.5 px-2 rounded-full inline-block">
              Premium Safe Sourcing
            </span>
            <h2 className="font-sans font-extrabold text-xl md:text-3xl text-white tracking-tight">
              {isSignUp ? 'Join the Celebration!' : 'Welcome Back!'}
            </h2>
            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
              Register or sign in to save your delivery addresses, track your prep-diwali dispatches, and access family wholesale discounts.
            </p>

            <div className="hidden md:flex items-center gap-2 pt-4 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Sivakasi Form-24 Compliant Green Crackers</span>
            </div>
          </div>
        </div>

        {/* Right Side: High-Density Elegant Form */}
        <div className="p-6 md:p-10 flex flex-col justify-center text-left bg-white">
          <div className="mb-6">
            <h3 className="font-sans font-extrabold text-xl text-slate-800 tracking-tight">
              {isSignUp ? 'Create Festive Account' : 'Sign In To Dharakshan'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isSignUp ? 'Get access to direct Sivakasi wholesale prices' : 'Access your cart and secure order histories'}
            </p>
          </div>

          {successMsg ? (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 py-10 animate-scale">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-bold text-sm">{successMsg}</h4>
              <p className="text-xs text-slate-500">Preparing your personalized dashboard. Shubh Deepavali!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" id="login-signup-form">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g., Sanjeev Kumar"
                      className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7A0C1E] focus:ring-1 focus:ring-[#7A0C1E]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7A0C1E] focus:ring-1 focus:ring-[#7A0C1E]"
                  />
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (For Dispatch SMS) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 98765 43210"
                    className="w-full text-xs px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7A0C1E] focus:ring-1 focus:ring-[#7A0C1E]"
                  />
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">Security Password *</label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => alert('Password reset directions have been dispatched to your email address!')}
                      className="text-[10px] font-semibold text-[#7A0C1E] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7A0C1E] focus:ring-1 focus:ring-[#7A0C1E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Checkboxes */}
              {isSignUp ? (
                <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer select-none py-1">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 accent-[#7A0C1E]"
                  />
                  <span>
                    I agree to local <b>Municipal Safe Storage Regulations</b> and declare that firecrackers will only be used under expert adult supervision.
                  </span>
                </label>
              ) : (
                <div className="flex items-center justify-between text-xs text-slate-500 py-1">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-[#7A0C1E]"
                    />
                    <span>Remember My Session</span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7A0C1E] hover:bg-[#911327] text-[#D4AF37] font-sans font-bold text-xs py-3.5 rounded-xl shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span>{isSignUp ? 'Create Festive Account' : 'Secure Festive Log In'}</span>
                )}
              </button>

              {/* Alternative Switch */}
              <div className="text-center pt-3 text-xs text-slate-500">
                {isSignUp ? (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(false)}
                      className="font-bold text-[#7A0C1E] hover:underline"
                    >
                      Login Here
                    </button>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(true)}
                      className="font-bold text-[#7A0C1E] hover:underline"
                    >
                      Sign Up Here
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
