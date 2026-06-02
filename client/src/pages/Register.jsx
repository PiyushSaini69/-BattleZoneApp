import React, { useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { XCircle } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const Register = ({
  regUsername,
  setRegUsername,
  regEmail,
  setRegEmail,
  regPhone,
  setRegPhone,
  regPassword,
  setRegPassword,
  regRef,
  setRegRef,
  handleRegister,
  authError,
  setCurrentPage
}) => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="max-w-md mx-auto py-8">
      <GlassCard glowColor="cyan">
        <h2 className={`text-2xl font-display font-black text-center mb-6 ${darkMode ? 'text-white' : 'text-slate-800'}`}>WARRIOR REGISTRATION</h2>

        {authError && (
          <div className={`p-3 border rounded-lg text-xs mb-4 flex items-center gap-2 ${
            darkMode ? 'border-red-500/20 bg-red-500/5 text-red-400' : 'border-red-500/30 bg-red-500/10 text-red-600'
          }`}>
            <XCircle size={16} />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className={`text-xs font-semibold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>Username</label>
            <input
              type="text"
              value={regUsername}
              onChange={e => setRegUsername(e.target.value)}
              required
              className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-[#06B6D4] transition ${
                darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
              placeholder="e.g. ProGamer99"
            />
          </div>
          <div className="space-y-1">
            <label className={`text-xs font-semibold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>Email Address</label>
            <input
              type="email"
              value={regEmail}
              onChange={e => setRegEmail(e.target.value)}
              required
              className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-[#06B6D4] transition ${
                darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
              placeholder="ProGamer99@gmail.com"
            />
          </div>
          <div className="space-y-1">
            <label className={`text-xs font-semibold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>Phone Number (10 Digits)</label>
            <input
              type="text"
              value={regPhone}
              onChange={e => setRegPhone(e.target.value)}
              className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-[#06B6D4] transition ${
                darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
              placeholder="9876543210"
            />
          </div>
          <div className="space-y-1">
            <label className={`text-xs font-semibold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>Password</label>
            <input
              type="password"
              value={regPassword}
              onChange={e => setRegPassword(e.target.value)}
              required
              className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-[#06B6D4] transition ${
                darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
              placeholder="Min 8 chars, 1 upper, 1 special"
            />
          </div>
          <div className="space-y-1">
            <label className={`text-xs font-semibold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>Referral Code (Optional)</label>
            <input
              type="text"
              value={regRef}
              onChange={e => setRegRef(e.target.value)}
              className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-[#06B6D4] transition ${
                darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
              placeholder="e.g. DEEP456"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded-lg font-display font-black tracking-wider uppercase shadow-neon-cyan mt-4 hover:opacity-90 transition text-white"
          >
            CREATE ACCOUNT
          </button>
        </form>

        <div className={`mt-6 text-center text-xs ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>
          Already registered? <span onClick={() => setCurrentPage('login')} className="text-[#06B6D4] cursor-pointer hover:underline">Log in</span>
        </div>
      </GlassCard>
    </div>
  );
};


export default Register;
