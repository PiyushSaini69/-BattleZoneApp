import React, { useContext, useEffect, useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import {
  Gamepad2, Trophy, Wallet as WalletIcon, AlertTriangle,
  Zap, Shield, Users, Star, ChevronRight, Flame,
  Target, Award, TrendingUp, Clock, Crosshair, Swords
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

/* ─── Floating particle background ─────────────────────────── */
const Particles = ({ darkMode }) => {
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 6,
    dur: Math.random() * 8 + 6,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {dots.map(d => (
          <circle
            key={d.id}
            cx={`${d.x}%`}
            cy={`${d.y}%`}
            r={d.size}
            fill={darkMode ? 'rgba(124,58,237,0.35)' : 'rgba(124,58,237,0.18)'}
            style={{
              animation: `floatDot ${d.dur}s ${d.delay}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </svg>
      <style>{`
        @keyframes floatDot {
          from { transform: translateY(0px) scale(1); opacity: 0.4; }
          to   { transform: translateY(-28px) scale(1.4); opacity: 1; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.85); opacity: 0.7; }
          100% { transform: scale(1.15); opacity: 0; }
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #7C3AED, #06B6D4, #F97316, #7C3AED);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .stat-card:hover .stat-num { animation: countUp 0.4s ease forwards; }
        .game-badge:hover { transform: scale(1.08) rotate(-1deg); }
        .cta-btn:hover { transform: scale(1.04); box-shadow: 0 0 32px rgba(249,115,22,0.6); }
      `}</style>
    </div>
  );
};

/* ─── Live ticker ───────────────────────────────────────────── */
const LiveTicker = ({ darkMode }) => {
  const items = [
    '🏆 ArjunXPro won ₹2,400 in BGMI Solo',
    '⚡ Free Fire Lone Wolf — 6 slots left!',
    '🎯 SniperKing killed 14 in last match',
    '💸 ₹18,000 prize pool — Valorant Finals tonight',
    '🔥 NightCrawler squad climbed to #1',
    '🕹️ New BGMI Classic lobby open now',
  ];
  const doubled = [...items, ...items];

  return (
    <div className={`overflow-hidden rounded-xl border py-2 px-0 flex items-center gap-3 ${
      darkMode ? 'bg-slate-900/60 border-brand-purple/20' : 'bg-slate-100 border-slate-200'
    }`}>
      <span className={`shrink-0 px-3 text-xs font-black uppercase tracking-widest rounded-full ml-3 py-1 ${
        darkMode ? 'bg-red-500 text-white' : 'bg-red-500 text-white'
      }`}>LIVE</span>
      <div className="overflow-hidden flex-1">
        <div
          className={`flex gap-10 whitespace-nowrap text-xs font-semibold ${
            darkMode ? 'text-slate-300' : 'text-slate-700'
          }`}
          style={{ animation: 'ticker 30s linear infinite' }}
        >
          {doubled.map((item, i) => (
            <span key={i} className="shrink-0">{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Stats row ─────────────────────────────────────────────── */
const stats = [
  { icon: Users, label: 'Active Players', value: '82,400+', color: 'text-brand-cyan' },
  { icon: Trophy, label: 'Prize Paid Out', value: '₹1.2 Cr+', color: 'text-brand-orange' },
  { icon: Swords, label: 'Matches Hosted', value: '14,800+', color: 'text-brand-purple' },
  { icon: Star, label: 'Avg. Rating', value: '4.9 / 5', color: 'text-yellow-400' },
];

/* ─── Supported games ────────────────────────────────────────── */
const games = [
  { name: 'BGMI', tag: 'Battle Royale', emoji: '🪖', color: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-500/30' },
  { name: 'Free Fire', tag: 'Lone Wolf', emoji: '🔥', color: 'from-red-500/20 to-orange-400/20', border: 'border-red-400/30' },
  { name: 'Valorant', tag: 'Spike Rush', emoji: '🎯', color: 'from-rose-500/20 to-pink-500/20', border: 'border-rose-400/30' },
  { name: 'Clash Royale', tag: 'Arena', emoji: '⚔️', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-400/30' },
];

/* ─── Feature cards ──────────────────────────────────────────── */
const features = [
  {
    icon: Zap,
    iconColor: 'text-yellow-400',
    bg: 'from-yellow-500/10 to-transparent',
    border: 'border-yellow-500/20',
    title: 'Lightning Matchmaking',
    desc: 'Auto-fill lobbies in under 60 seconds. Room credentials delivered the moment your slot confirms — no waiting, no chasing admins.',
  },
  {
    icon: Shield,
    iconColor: 'text-brand-cyan',
    bg: 'from-cyan-500/10 to-transparent',
    border: 'border-cyan-500/20',
    title: 'Anti-Cheat Verified',
    desc: 'Every match is manually reviewed. Suspicious kill ratios flagged instantly. Your winnings are safe from hackers and smurfs.',
  },
  {
    icon: TrendingUp,
    iconColor: 'text-green-400',
    bg: 'from-green-500/10 to-transparent',
    border: 'border-green-500/20',
    title: 'Leaderboard Rankings',
    desc: 'Earn points per kill & placement. Climb weekly ranks for bonus prize multipliers. Top 10 get permanent profile badges.',
  },
  {
    icon: Clock,
    iconColor: 'text-brand-orange',
    bg: 'from-orange-500/10 to-transparent',
    border: 'border-orange-500/20',
    title: '24h Result Payouts',
    desc: 'Winnings computed within hours of match end. UPI transfer arrives before you sleep. No coin-to-cash delays.',
  },
  {
    icon: Target,
    iconColor: 'text-brand-purple',
    bg: 'from-purple-500/10 to-transparent',
    border: 'border-purple-500/20',
    title: 'Solo & Squad Modes',
    desc: 'Go Lone Wolf or build your 4-man squad. Separate prize pools per mode ensure fair competition at every level.',
  },
  {
    icon: Award,
    iconColor: 'text-pink-400',
    bg: 'from-pink-500/10 to-transparent',
    border: 'border-pink-500/20',
    title: 'Special Events',
    desc: 'Weekend mega-tournaments with ₹50,000+ prize pools. Seasonal championships with exclusive in-game title rewards.',
  },
];

/* ═══════════════════════════════════════════════════════════════
   LANDING
═══════════════════════════════════════════════════════════════ */
const Landing = ({ announcements, setCurrentPage }) => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="space-y-10 relative">

      {/* ── Particles ── */}
      <Particles darkMode={darkMode} />

      {/* ── Announcements ── */}
      {announcements?.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {announcements.map(ann => (
            <div
              key={ann._id}
              className={`p-4 border rounded-2xl flex gap-3 items-start backdrop-blur-sm transition-all duration-300 ${
                ann.type === 'warning'
                  ? darkMode
                    ? 'border-yellow-500/30 bg-yellow-500/8 shadow-[0_0_20px_rgba(234,179,8,0.08)]'
                    : 'border-yellow-300 bg-yellow-50'
                  : darkMode
                    ? 'border-brand-purple/30 bg-brand-purple/8 shadow-[0_0_20px_rgba(124,58,237,0.08)]'
                    : 'border-purple-200 bg-purple-50'
              }`}
            >
              <div className={`mt-0.5 p-1.5 rounded-lg ${ann.type === 'warning' ? 'bg-yellow-500/15' : 'bg-brand-purple/15'}`}>
                <AlertTriangle
                  className={ann.type === 'warning' ? 'text-yellow-400' : 'text-brand-purple'}
                  size={18}
                />
              </div>
              <div>
                <h4 className={`font-display font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  {ann.title}
                </h4>
                <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {ann.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Live Ticker ── */}
      <LiveTicker darkMode={darkMode} />

      {/* ── Hero ── */}
      <div className="relative text-center py-14 space-y-6">
        {/* Glow blobs */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-purple/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute top-12 left-1/4 w-48 h-48 bg-brand-cyan/10 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute top-12 right-1/4 w-48 h-48 bg-brand-orange/10 blur-[60px] rounded-full pointer-events-none" />

        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-2 ${
          darkMode ? 'border-brand-purple/40 bg-brand-purple/10 text-brand-purple' : 'border-purple-300 bg-purple-50 text-purple-600'
        }`}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          India's #1 Esports Platform
        </div>

        <h1 className="text-5xl sm:text-7xl font-display font-black tracking-tight leading-none">
          <span className="shimmer-text">INDIA'S PREMIER</span>
          <br />
          <span className={darkMode ? 'text-white' : 'text-slate-900'}>ESPORTS HUB</span>
        </h1>

        <p className={`max-w-2xl mx-auto text-base sm:text-lg leading-relaxed ${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Compete in paid &amp; free <strong className={darkMode ? 'text-white' : 'text-slate-800'}>BGMI, Free Fire &amp; Valorant</strong> tournaments.
          Win real cash prizes credited instantly to your UPI wallet. Live slots. Live lobbies. No BS.
        </p>

        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <button
            onClick={() => setCurrentPage('tournaments')}
            className={`cta-btn px-8 py-4 bg-brand-orange rounded-2xl font-display font-black tracking-wider uppercase text-sm transition-all duration-200 flex items-center gap-2 ${
              darkMode ? 'text-slate-950' : 'text-white'
            }`}
          >
            <Flame size={18} />
            DISCOVER MATCHES
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setCurrentPage('leaderboard')}
            className={`px-8 py-4 rounded-2xl font-display font-black tracking-wider uppercase text-sm border transition-all duration-200 hover:scale-104 flex items-center gap-2 ${
              darkMode
                ? 'border-brand-purple/40 text-brand-purple hover:bg-brand-purple/10'
                : 'border-purple-300 text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Trophy size={16} />
            LEADERBOARD
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className={`stat-card p-5 rounded-2xl border text-center backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 ${
              darkMode
                ? 'bg-slate-900/50 border-slate-700/50 hover:border-brand-purple/40'
                : 'bg-white border-slate-200 hover:border-purple-200 shadow-sm'
            }`}
          >
            <Icon className={`${color} mx-auto mb-2`} size={24} />
            <div className={`stat-num text-2xl font-display font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {value}
            </div>
            <div className={`text-xs mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Supported Games ── */}
      <div>
        <h2 className={`font-display font-black text-xl mb-4 uppercase tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          🎮 Supported Games
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {games.map(({ name, tag, emoji, color, border }) => (
            <div
              key={name}
              className={`game-badge p-5 rounded-2xl border bg-gradient-to-br ${color} ${border} cursor-pointer transition-all duration-200 ${
                darkMode ? '' : 'shadow-sm'
              }`}
            >
              <div className="text-3xl mb-2">{emoji}</div>
              <div className={`font-display font-black text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>{name}</div>
              <div className={`text-xs mt-0.5 font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{tag}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Core 3 Cards (original) ── */}
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard hoverEffect glowColor="purple">
          <div className={`p-2 rounded-xl w-fit mb-4 ${darkMode ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
            <WalletIcon className="text-brand-cyan" size={28} />
          </div>
          <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Instant Withdrawals</h3>
          <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Fast transaction cycles. Claim your tournament payouts straight to your bank account or UPI ID, verified within 24 hours.
          </p>
          <div className={`mt-4 text-xs font-bold flex items-center gap-1 ${darkMode ? 'text-brand-cyan' : 'text-cyan-600'}`}>
            <Zap size={12} /> Avg. payout in 4 hrs
          </div>
        </GlassCard>

        <GlassCard hoverEffect glowColor="cyan">
          <div className={`p-2 rounded-xl w-fit mb-4 ${darkMode ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
            <Trophy className="text-brand-orange" size={28} />
          </div>
          <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Real Prize Pools</h3>
          <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Earn competitive rewards based on match position and kill aggregates. Fair play with manual results verification done daily.
          </p>
          <div className={`mt-4 text-xs font-bold flex items-center gap-1 ${darkMode ? 'text-brand-orange' : 'text-orange-600'}`}>
            <Flame size={12} /> Up to ₹50,000 per event
          </div>
        </GlassCard>

        <GlassCard hoverEffect glowColor="orange">
          <div className={`p-2 rounded-xl w-fit mb-4 ${darkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
            <Gamepad2 className="text-brand-purple" size={28} />
          </div>
          <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Supported Games</h3>
          <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            BGMI, Clash Royale, Free Fire Lone Wolf custom lobbies, Valorant Spike Rush. Room credentials revealed instantly on slot confirmation.
          </p>
          <div className={`mt-4 text-xs font-bold flex items-center gap-1 ${darkMode ? 'text-brand-purple' : 'text-purple-600'}`}>
            <Crosshair size={12} /> 4 games &amp; growing
          </div>
        </GlassCard>
      </div>

      {/* ── Extended Features 6-grid ── */}
      <div>
        <h2 className={`font-display font-black text-xl mb-4 uppercase tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          ⚡ Why Players Choose Us
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, iconColor, bg, border, title, desc }) => (
            <div
              key={title}
              className={`p-5 rounded-2xl border bg-gradient-to-br ${bg} ${border} transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                darkMode ? 'hover:shadow-black/40' : 'shadow-sm hover:shadow-slate-200'
              }`}
            >
              <div className={`p-2 rounded-xl w-fit mb-3 ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
                <Icon className={iconColor} size={22} />
              </div>
              <h4 className={`font-display font-bold text-sm mb-1.5 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{title}</h4>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div className={`relative overflow-hidden rounded-3xl p-8 text-center border ${
        darkMode
          ? 'bg-gradient-to-r from-brand-purple/20 via-brand-cyan/10 to-brand-orange/20 border-brand-purple/30'
          : 'bg-gradient-to-r from-purple-50 via-cyan-50 to-orange-50 border-purple-200'
      }`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM3QzNBRUQiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDB2NmgNdiA2aC02di02aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40 pointer-events-none" />
        <Swords className={`mx-auto mb-3 ${darkMode ? 'text-brand-purple' : 'text-purple-500'}`} size={36} />
        <h2 className={`font-display font-black text-2xl sm:text-3xl mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Ready to Compete?
        </h2>
        <p className={`text-sm mb-6 max-w-md mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Join 82,000+ players already winning real cash. New lobbies open every hour.
        </p>
        <button
          onClick={() => setCurrentPage('tournaments')}
          className={`cta-btn px-10 py-4 bg-brand-orange rounded-2xl font-display font-black tracking-wider uppercase text-sm transition-all duration-200 inline-flex items-center gap-2 ${
            darkMode ? 'text-slate-950' : 'text-white'
          }`}
        >
          <Flame size={18} />
          JOIN A TOURNAMENT NOW
        </button>
      </div>

    </div>
  );
};

export default Landing;