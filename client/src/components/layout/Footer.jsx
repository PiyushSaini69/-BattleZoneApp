import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Gamepad2 } from 'lucide-react';

export default function Footer({ setCurrentPage }) {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  
  // Account for both explicit 'dark' selection and 'system' resolving to dark mode
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <footer className={`relative overflow-hidden transition-colors duration-500 border-t ${
      darkMode 
        ? 'bg-[#0B0F1A] border-white/5 text-slate-500' 
        : 'bg-white border-slate-200 text-slate-700'
    }`}>
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-brand-purple/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="md:col-span-1 space-y-6">
            <div 
              onClick={() => setCurrentPage('landing')} 
              className="flex items-center gap-3 cursor-pointer select-none font-display font-extrabold text-xl tracking-wider bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent hover:scale-102 transition"
            >
              <Gamepad2 className="text-brand-purple" />
              BATTLEZONE
            </div>
            <p className="text-sm font-medium leading-relaxed">
              Deep-intelligence esports tournament hosting. Live slot allocation, match lobbies chat, and automated prize pools payouts. All in one place.
            </p>
          </div>

          {/* Links Columns */}
          <div className="space-y-6">
            <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${darkMode ? 'text-white' : 'text-slate-900'}`}>Product</h4>
            <ul className="space-y-4 text-sm font-semibold">
              <li>
                <span onClick={() => setCurrentPage('tournaments')} className="hover:text-brand-purple cursor-pointer transition-colors">
                  Tournaments
                </span>
              </li>
              <li>
                <span onClick={() => setCurrentPage('leaderboard')} className="hover:text-brand-purple cursor-pointer transition-colors">
                  Leaderboard
                </span>
              </li>
              <li>
                <span onClick={() => setCurrentPage('support')} className="hover:text-brand-purple cursor-pointer transition-colors">
                  Support Helpdesk
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${darkMode ? 'text-white' : 'text-slate-900'}`}>Company</h4>
            <ul className="space-y-4 text-sm font-semibold">
              <li><span onClick={() => setCurrentPage('about')} className="hover:text-brand-purple cursor-pointer transition-colors">About Us</span></li>
              <li><span onClick={() => setCurrentPage('careers')} className="hover:text-brand-purple cursor-pointer transition-colors">Careers</span></li>
              <li><span onClick={() => setCurrentPage('contact')} className="hover:text-brand-purple cursor-pointer transition-colors">Contact</span></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${darkMode ? 'text-white' : 'text-slate-900'}`}>Resources</h4>
            <ul className="space-y-4 text-sm font-semibold">
              <li><span onClick={() => setCurrentPage('rules')} className="hover:text-brand-purple cursor-pointer transition-colors">Rules Documentation</span></li>
              <li><span onClick={() => setCurrentPage('help')} className="hover:text-brand-purple cursor-pointer transition-colors">Help Center</span></li>
            </ul>
          </div>


        </div>

        <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
          <div className="text-[12px] font-black uppercase tracking-widest flex items-center gap-2">
            <span className={darkMode ? 'text-slate-600' : 'text-slate-500'}>&copy; {new Date().getFullYear()}</span>
            <span className={`hover:text-brand-purple transition-colors cursor-pointer ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              BattleZone Esports Pvt Ltd
            </span>
          </div>
          <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest">
            <span onClick={() => setCurrentPage('privacy')} className="hover:text-brand-purple cursor-pointer transition-colors">Privacy</span>
            <span onClick={() => setCurrentPage('terms')} className="hover:text-brand-purple cursor-pointer transition-colors">Terms</span>
            <span onClick={() => setCurrentPage('cookies')} className="hover:text-brand-purple cursor-pointer transition-colors">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
