import React, { useState, useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { ThemeContext } from '../context/ThemeContext';
import { HelpCircle, ChevronDown, ChevronUp, AlertCircle, Wallet, Trophy } from 'lucide-react';

const HelpCenter = () => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  // FAQ state toggle index
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      category: "getting_started",
      icon: <HelpCircle className="text-brand-purple" size={18} />,
      question: "How do I register and allocate my tournament custom slot?",
      answer: "1. Head to the 'Tournaments' tab, select an active tournament game lobby (BGMI, Free Fire, Valorant) and click 'Enter Tournament Hub'.\n2. Add your verified gaming character UID inside your profile.\n3. Click 'Register & Pay Now' on the sidebar. The entry fee gets automatically deducted from your wallet cash balance, and a secure slot number is assigned to you instantly."
    },
    {
      category: "wallet_deposits",
      icon: <Wallet className="text-brand-cyan" size={18} />,
      question: "How does the Razorpay payment simulator deposit work?",
      answer: "Since our billing catalog is in sandbox test mode, adding deposit cash triggers a 'Razorpay Payment Simulator' window. You can click 'Success' to simulate a successful Razorpay gateway callback, and ₹100 or your deposited amount will instantly credit to your deposit ledger balance."
    },
    {
      category: "withdrawals",
      icon: <Wallet className="text-[#10B981]" size={18} />,
      question: "How do I withdraw my match winnings to my UPI ID?",
      answer: "Navigate to the 'Wallet' tab and locate 'RAISE payout request'. Input the withdrawal amount (minimum limit ₹100), key in your correct UPI ID (e.g. gamer@ybl), and hit 'Place payout Request'. Funds get locked, and once an executive approves it, the payoutcredits instantly."
    },
    {
      category: "rules",
      icon: <AlertCircle className="text-brand-orange" size={18} />,
      question: "What happens if a custom room match is cancelled?",
      answer: "If a moderator cancels a custom lobby tournament bracket due to server lags or technical configurations errors, 100% of the tournament entry fee gets immediately auto-refunded to all registered players wallets instantly. You will receive an automated socket notification ticker alert."
    },
    {
      category: "anti_cheat",
      icon: <Trophy className="text-brand-purple" size={18} />,
      question: "What triggers an automated profile ban holds?",
      answer: "Our automated anti-cheat telemetry parses game score placements datasets, aggregate stats, and lobbies coordinate placements daily. Any player caught wallhacking, speedhacking, aim-locking, config-manipulating, or teaming up in solo rooms is permanently banned and wallet holdings are forfeited."
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Block */}
      <div className="text-center py-10 space-y-4 relative">
        <div className="absolute inset-0 bg-brand-cyan/5 filter blur-3xl rounded-full max-w-3xl mx-auto pointer-events-none"></div>
        <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-none bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-orange bg-clip-text text-transparent uppercase">
          WARRIORS HELP CENTER
        </h1>
        <p className={`max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-semibold ${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Got questions? Discover walkthroughs on lobbies slots allocations, payment simulated order verifications, UPI withdrawals, and fair play anti-cheat investigations.
        </p>
      </div>

      {/* Accordions list */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h2 className={`text-xl font-display font-black uppercase tracking-wider text-center mb-6 ${
          darkMode ? 'text-white' : 'text-slate-850'
        }`}>FREQUENTLY ASKED QUESTIONS</h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={idx}
                className={`border rounded-2xl overflow-hidden transition-all duration-350 ${
                  darkMode 
                    ? 'border-white/5 bg-black/20' 
                    : 'border-slate-200 bg-white shadow-sm'
                }`}
              >
                {/* Header item */}
                <div
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                  className={`p-4 flex justify-between items-center cursor-pointer transition select-none ${
                    isOpen 
                      ? (darkMode ? 'bg-white/5' : 'bg-slate-50') 
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {faq.icon}
                    <h3 className={`font-display font-bold text-xs sm:text-sm tracking-wide ${
                      darkMode ? 'text-white hover:text-brand-cyan' : 'text-slate-800 hover:text-brand-purple'
                    }`}>
                      {faq.question}
                    </h3>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-brand-cyan" /> : <ChevronDown size={16} className={darkMode ? 'text-slate-400' : 'text-slate-600'} />}
                </div>

                {/* Content collapsible block */}
                {isOpen && (
                  <div className={`p-4 border-t text-xs leading-relaxed whitespace-pre-line ${
                    darkMode ? 'border-white/5 text-slate-300' : 'border-slate-100 text-slate-600 bg-slate-50/50'
                  }`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support desk redirect suggestion */}
      <div className="max-w-xl mx-auto text-center pt-6 space-y-4">
        <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
          Still need custom assist? If you've run into technical issues not resolved in the FAQs, raise a support query ticket.
        </p>
      </div>
    </div>
  );
};

export default HelpCenter;
