import React, { useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { ThemeContext } from '../context/ThemeContext';
import { Mail, ShieldAlert, MessageSquare, Compass, PhoneCall } from 'lucide-react';

const Contact = () => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="space-y-12">
      {/* Hero Block */}
      <div className="text-center py-10 space-y-4 relative">
        <div className="absolute inset-0 bg-brand-orange/5 filter blur-3xl rounded-full max-w-3xl mx-auto pointer-events-none"></div>
        <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-none bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-orange bg-clip-text text-transparent uppercase">
          COMMUNICATE WITH US
        </h1>
        <p className={`max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-semibold ${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Got financial transaction failures? Want to sponsor a custom BGMI/Valorant community bracket? Get connected with our anti-cheat moderators, developers, and support helpdesk.
        </p>
      </div>

      {/* Contacts Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Support Helpdesk card */}
        <GlassCard hoverEffect={true} glowColor="purple" className="flex flex-col justify-between">
          <div>
            <MessageSquare className="text-brand-cyan mb-4" size={32} />
            <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Player Support</h3>
            <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              For deposit failures, slot allocation errors, UPI withdrawal delays, or general match lobbies chat coord assistance.
            </p>
          </div>
          <div className="mt-6 text-xs font-semibold text-brand-cyan uppercase tracking-wider">
            Raise Ticket on Support Dashboard
          </div>
        </GlassCard>

        {/* Business Collaborations card */}
        <GlassCard hoverEffect={true} glowColor="cyan" className="flex flex-col justify-between">
          <div>
            <Mail className="text-brand-purple mb-4" size={32} />
            <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Business & Press</h3>
            <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Esports sponsors inquiries, colleges championship partnerships, media coverage, and Series-A funding integrations.
            </p>
          </div>
          <div className={`mt-6 text-xs font-mono font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            partners@battlezone.in
          </div>
        </GlassCard>

        {/* Anti Cheat & Abuse card */}
        <GlassCard hoverEffect={true} glowColor="orange" className="flex flex-col justify-between">
          <div>
            <ShieldAlert className="text-brand-orange mb-4" size={32} />
            <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Fair Play & Hackers</h3>
            <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Report teaming-up, character UID anomalies, anti-cheat bypass attempts, and fraudulent game result screens uploads.
            </p>
          </div>
          <div className={`mt-6 text-xs font-mono font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            fairplay@battlezone.in
          </div>
        </GlassCard>
      </div>

      {/* HQ Detail & Interactive Details */}
      <div className="grid md:grid-cols-2 gap-8 items-center pt-6">
        <div className="space-y-4">
          <span className="px-2.5 py-1 text-[10px] font-display font-black bg-brand-orange text-white uppercase tracking-wider rounded">OUR BASE</span>
          <h2 className={`text-2xl sm:text-3xl font-display font-black tracking-wide uppercase ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>BATTLEZONE HEADQUARTERS</h2>
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            **BattleZone Esports Pvt Ltd**
          </p>
          <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Level 5, Skyview Tower C, Tech Park Phase 2,<br />
            HSR Layout, Bengaluru, Karnataka — 560102
          </p>
          
          <div className="pt-2 flex gap-4 text-xs font-semibold select-none">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-brand-cyan" />
              <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>HSR Layout HQ</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall size={16} className="text-brand-orange" />
              <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>+91 80 4999 2200</span>
            </div>
          </div>
        </div>

        <GlassCard glowColor="cyan" className="space-y-4">
          <h3 className={`font-display font-extrabold text-sm uppercase border-b pb-3 ${
            darkMode ? 'text-white/80 border-white/5' : 'text-slate-700 border-slate-200'
          }`}>ESTIMATED RESPONSE LATENCIES</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 border rounded-xl border-white/5 bg-black/20 dark:border-white/5 dark:bg-black/20">
              <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>Support desk Tickets</span>
              <span className="font-semibold text-brand-cyan">Under 30 Minutes</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-xl border-white/5 bg-black/20 dark:border-white/5 dark:bg-black/20">
              <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>Partnerships & Sponsorships</span>
              <span className="font-semibold text-[#10B981]">Within 24 Hours</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-xl border-white/5 bg-black/20 dark:border-white/5 dark:bg-black/20">
              <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>Fair Play Investigations</span>
              <span className="font-semibold text-brand-orange">Within 2 Hours</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Contact;
