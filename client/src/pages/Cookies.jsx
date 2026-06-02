import React, { useContext, useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { ThemeContext } from '../context/ThemeContext';
import { Cookie, Monitor, ShieldCheck, ToggleLeft, ToggleRight, Check } from 'lucide-react';

const Cookies = () => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  // Interactive local states for simulating cookie toggles
  const [analyticalCookies, setAnalyticalCookies] = useState(true);
  const [marketingCookies, setMarketingCookies] = useState(false);
  const [clearedPref, setClearedPref] = useState(false);

  const handleClearPreferences = () => {
    setClearedPref(true);
    setAnalyticalCookies(false);
    setMarketingCookies(false);
    setTimeout(() => {
      setClearedPref(false);
    }, 3000);
  };

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <div className="text-center py-10 space-y-4 relative">
        <div className="absolute inset-0 bg-brand-orange/5 filter blur-3xl rounded-full max-w-3xl mx-auto pointer-events-none"></div>
        <span className="px-2.5 py-1 text-[10px] font-display font-black bg-brand-orange text-white uppercase tracking-wider rounded">PREFERENCES</span>
        <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-none bg-gradient-to-r from-brand-orange via-brand-cyan to-brand-purple bg-clip-text text-transparent uppercase">
          COOKIE POLICY
        </h1>
        <p className={`max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-semibold ${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          BattleZone uses secure localized tracking tokens. Learn how we utilize session keys to sustain persistent themes, keep you logged in, and verify anti-cheat slot assignments.
        </p>
        <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'} font-medium`}>
          Last Updated: June 1, 2026
        </p>
      </div>

      {/* Core Cookie Tiers */}
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard hoverEffect={true} glowColor="orange">
          <Cookie className="text-brand-orange mb-4" size={36} />
          <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Session Tokens</h3>
          <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Secure JSON Web Tokens (JWT) are stored in client headers to preserve your login session. These are vital for accessing matches and wallet ledgers.
          </p>
        </GlassCard>

        <GlassCard hoverEffect={true} glowColor="cyan">
          <Monitor className="text-brand-cyan mb-4" size={36} />
          <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>UI Configurations</h3>
          <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            We persist your visual system choices (Dark, Light, or System resolved) so your competitive dashboard remains optimized to your eyes.
          </p>
        </GlassCard>

        <GlassCard hoverEffect={true} glowColor="purple">
          <ShieldCheck className="text-brand-purple mb-4" size={36} />
          <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Security Integrity</h3>
          <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Anti-Cross Site Request Forgery (CSRF) cookies protect your UPI withdraw submissions, guaranteeing secure and authentic transaction calls.
          </p>
        </GlassCard>
      </div>

      {/* Interactive Cookie Settings panel */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details and Configurator */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard glowColor="orange" className="space-y-6">
            <div className="border-b pb-4">
              <h2 className={`text-xl font-display font-black uppercase tracking-wider ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                COOKIE PREFERENCES MANAGER
              </h2>
              <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Toggle non-essential trackers. Strictly necessary cookies are mandatory as they sustain authentication and wallet operations.
              </p>
            </div>

            {/* Toggle list */}
            <div className="space-y-4">
              {/* Row 1: Strictly Necessary (Locked) */}
              <div className={`flex items-center justify-between p-4 border rounded-xl ${
                darkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="space-y-1 pr-4">
                  <span className={`text-xs font-bold uppercase tracking-wider block ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    Authentication & Security (Strictly Necessary)
                  </span>
                  <span className={`text-[11px] block leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Sustains login sessions via JWT, anti-forgery guards, and server-sent telemetry channels.
                  </span>
                </div>
                <div className="text-brand-orange text-xs font-bold uppercase px-3 py-1 border border-brand-orange/20 bg-brand-orange/10 rounded">
                  ALWAYS ON
                </div>
              </div>

              {/* Row 2: Analytical tracking */}
              <div className={`flex items-center justify-between p-4 border rounded-xl ${
                darkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="space-y-1 pr-4">
                  <span className={`text-xs font-bold uppercase tracking-wider block ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    Analytical & Telemetry Cookie (Optional)
                  </span>
                  <span className={`text-[11px] block leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Anonymously evaluates network request times and active page transitions to improve dashboard response speed.
                  </span>
                </div>
                <button
                  onClick={() => setAnalyticalCookies(!analyticalCookies)}
                  className="transition duration-200 focus:outline-none"
                >
                  {analyticalCookies ? (
                    <ToggleRight size={38} className="text-brand-cyan" />
                  ) : (
                    <ToggleLeft size={38} className={`${darkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                  )}
                </button>
              </div>

              {/* Row 3: Marketing cookies */}
              <div className={`flex items-center justify-between p-4 border rounded-xl ${
                darkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="space-y-1 pr-4">
                  <span className={`text-xs font-bold uppercase tracking-wider block ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    Marketing & Referral Attribution (Optional)
                  </span>
                  <span className={`text-[11px] block leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Links signup bonuses with referral link clicks, ensuring referrers receive appropriate wallet cash distributions.
                  </span>
                </div>
                <button
                  onClick={() => setMarketingCookies(!marketingCookies)}
                  className="transition duration-200 focus:outline-none"
                >
                  {marketingCookies ? (
                    <ToggleRight size={38} className="text-brand-purple" />
                  ) : (
                    <ToggleLeft size={38} className={`${darkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                  )}
                </button>
              </div>
            </div>

            {/* Save Buttons block */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                onClick={handleClearPreferences}
                className={`text-[11px] font-black tracking-widest uppercase transition border hover:bg-slate-100 dark:hover:bg-white/5 px-4 py-2.5 rounded-xl ${
                  darkMode ? 'border-white/10 text-white' : 'border-slate-300 text-slate-700'
                }`}
              >
                RESTORE DEFAULTS
              </button>

              <button
                disabled={clearedPref}
                onClick={handleClearPreferences}
                className={`text-[11px] font-black tracking-widest uppercase transition px-6 py-2.5 rounded-xl flex items-center gap-2 ${
                  clearedPref 
                    ? 'bg-[#10B981] text-white cursor-default' 
                    : 'bg-brand-orange text-white hover:scale-102 hover:shadow-neon-orange/20'
                }`}
              >
                {clearedPref ? (
                  <>
                    <Check size={14} />
                    PREFERENCES UPDATED!
                  </>
                ) : (
                  'SAVE CHANGES'
                )}
              </button>
            </div>
          </GlassCard>

          <GlassCard glowColor="cyan">
            <h2 className={`text-xl font-display font-black uppercase tracking-wider mb-4 border-b pb-2 ${
              darkMode ? 'text-white border-white/5' : 'text-slate-900 border-slate-200'
            }`}>
              How to Disable Tracking via Your Browser
            </h2>
            <div className={`space-y-4 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                In addition to our Preference Manager, you can inspect, clear, and disable cookies straight from your web client configurations:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className={darkMode ? 'text-white' : 'text-slate-800'}>Google Chrome:</strong> Navigate to Settings &gt; Privacy and Security &gt; Third-party Cookies to block specific domain trackers.
                </li>
                <li>
                  <strong className={darkMode ? 'text-white' : 'text-slate-800'}>Safari (macOS/iOS):</strong> Open Settings &gt; Safari &gt; Advanced and enable "Block All Cookies" or configure Privacy settings.
                </li>
                <li>
                  <strong className={darkMode ? 'text-white' : 'text-slate-800'}>Mozilla Firefox:</strong> Go to Options &gt; Privacy & Security and select "Strict" tracking protection.
                </li>
              </ul>
              <p className="text-xs italic">
                Please note: Blocking essential BattleZone cookies will sign you out and cause active MatchRoom chat sockets to disconnect automatically.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Right Col: active cookie descriptors */}
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <h4 className={`font-display font-bold text-sm uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              BATTLEZONE ACTIVE TOKENS
            </h4>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              These are the precise values saved inside your local client to ensure proper operation:
            </p>

            <div className="space-y-3 font-mono text-[10px]">
              <div className={`p-2.5 border rounded-lg ${darkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-bold text-brand-orange block">battlezone_token</div>
                <div className={darkMode ? 'text-slate-400' : 'text-slate-500'}>JWT session validation key (Expires in 7 Days)</div>
              </div>

              <div className={`p-2.5 border rounded-lg ${darkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-bold text-brand-cyan block">battlezone_theme</div>
                <div className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Holds active visualization state: "dark" | "light" | "system"</div>
              </div>

              <div className={`p-2.5 border rounded-lg ${darkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-bold text-brand-purple block">battlezone_cookie_pref</div>
                <div className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Analytical and marketing approval states</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
