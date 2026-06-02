import React, { useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { ThemeContext } from '../context/ThemeContext';
import { ShieldCheck, Trophy, Users, Star } from 'lucide-react';

const AboutUs = () => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="space-y-12">
      {/* Hero Block */}
      <div className="text-center py-10 space-y-4 relative">
        <div className="absolute inset-0 bg-brand-purple/5 filter blur-3xl rounded-full max-w-3xl mx-auto pointer-events-none"></div>
        <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-none bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-orange bg-clip-text text-transparent uppercase">
          OUR MISSION & STORY
        </h1>
        <p className={`max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-semibold ${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          We are the architects of deep-intelligence esports tournament hosting. Empowering competitive mobile and PC gamers with automated lobbies, live slot allocations, and instantaneous wallet payouts.
        </p>
      </div>

      {/* Philosophy Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard hoverEffect={true} glowColor="purple">
          <ShieldCheck className="text-brand-cyan mb-4" size={36} />
          <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Absolute Integrity</h3>
          <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            With our manual match verification protocols and state-of-the-art telemetry checks, we eliminate hackers and guarantee absolutely fair cash tournaments.
          </p>
        </GlassCard>

        <GlassCard hoverEffect={true} glowColor="cyan">
          <Trophy className="text-brand-cyan mb-4" size={36} />
          <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Esports Excellence</h3>
          <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            We bridge the gap between amateur competitive gaming and elite pro leagues. Register, allocate custom slots, and secure live lobby credentials easily.
          </p>
        </GlassCard>

        <GlassCard hoverEffect={true} glowColor="orange">
          <Users className="text-brand-orange mb-4" size={36} />
          <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Community Focused</h3>
          <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Built by hardcore competitive gamers for gamers. We offer instant UPI payouts and a seamless live chat lobby environment for teams to organize custom lobbies.
          </p>
        </GlassCard>
      </div>

      {/* Core Achievements Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center pt-6">
        <div className="space-y-4">
          <span className="px-2.5 py-1 text-[10px] font-display font-black bg-brand-purple text-white uppercase tracking-wider rounded">OUR STORY</span>
          <h2 className={`text-2xl sm:text-3xl font-display font-black tracking-wide uppercase ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>HOW WE SHAPED THE BATTLEGROUNDS</h2>
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Launched in 2026, BattleZone emerged to solve the major bottlenecks in the Indian competitive gaming catalog: delayed tournament results uploads, manual slot mess-ups, and painful prize withdrawal delays.
          </p>
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            By introducing an integrated wallet system supporting simulated payment gateways, secure custom lobbies, and automated slot allocations, we designed a premier destination where any player can convert gaming skills into real cash.
          </p>
        </div>

        <GlassCard glowColor="purple" className="space-y-4">
          <h3 className={`font-display font-extrabold text-sm uppercase border-b pb-3 ${
            darkMode ? 'text-white/80 border-white/5' : 'text-slate-700 border-slate-200'
          }`}>KEY TELEMETRIES IN 2026</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className={`p-4 border rounded-xl ${darkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[10px] uppercase block font-semibold ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>Active Warriors</span>
              <span className="font-display font-black text-xl text-brand-cyan">50,000+</span>
            </div>
            <div className={`p-4 border rounded-xl ${darkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[10px] uppercase block font-semibold ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>Cash Payouts</span>
              <span className="font-display font-black text-xl text-[#10B981]">₹15 Lakhs+</span>
            </div>
            <div className={`p-4 border rounded-xl ${darkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[10px] uppercase block font-semibold ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>Custom Matches</span>
              <span className="font-display font-black text-xl text-brand-orange">10,000+</span>
            </div>
            <div className={`p-4 border rounded-xl ${darkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[10px] uppercase block font-semibold ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>Support SLA Resolution</span>
              <span className="font-display font-black text-xl text-brand-purple">99.8%</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AboutUs;
