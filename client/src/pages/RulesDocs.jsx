import React, { useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { ThemeContext } from '../context/ThemeContext';
import { ShieldCheck, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';

const RulesDocs = () => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="space-y-12">
      {/* Hero Block */}
      <div className="text-center py-10 space-y-4 relative">
        <div className="absolute inset-0 bg-brand-purple/5 filter blur-3xl rounded-full max-w-3xl mx-auto pointer-events-none"></div>
        <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-none bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-orange bg-clip-text text-transparent uppercase">
          RULES & REGULATIONS DOCUMENT
        </h1>
        <p className={`max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-semibold ${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          To guarantee an elite, uncompromised, and fair competitive environment, all registered players must strictly adhere to the guidelines outlined below.
        </p>
      </div>

      {/* Rules categories */}
      <div className="space-y-8">
        
        {/* Section 1: Platform & Accounts */}
        <GlassCard glowColor="purple">
          <div className="flex items-center gap-3 border-b pb-4 mb-4 border-white/5 dark:border-white/5">
            <ShieldCheck size={24} className="text-brand-purple" />
            <h2 className={`font-display font-black text-lg uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              Section 1: Account & Gaming UID policies
            </h2>
          </div>
          <div className={`space-y-3 text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <p>1.1. **Single Account Limit**: Each player is permitted to operate exactly one BattleZone account. Operating clone accounts or sybil profiles results in immediate permanent bans and active wallet locks.</p>
            <p>1.2. **Game UID Integrity**: You must register your exact gaming UID (BGMI Character ID / Riot Tag) inside your player Profile. Entering matching lobbies with non-registered UIDs is detected automatically by anti-cheat telemetries, resulting in lobby kicks and slot forfeits.</p>
            <p>1.3. **No Account Transfers**: Players are strictly prohibited from lending accounts or sharing login keys. You cannot play tournaments on behalf of another user.</p>
          </div>
        </GlassCard>

        {/* Section 2: Lobby Codes and Slots */}
        <GlassCard glowColor="cyan">
          <div className="flex items-center gap-3 border-b pb-4 mb-4 border-white/5 dark:border-white/5">
            <HelpCircle size={24} className="text-brand-cyan" />
            <h2 className={`font-display font-black text-lg uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              Section 2: Lobbies codes & slot allocation rules
            </h2>
          </div>
          <div className={`space-y-3 text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <p>2.1. ** Lobbies Revelations**: Lobbies credentials (Room ID and Room Password) are revealed inside the active Tournament Hub match room exactly **15 minutes before the scheduled time**.</p>
            <p>2.2. **Slot Allocation**: Players must sit exactly in their assigned slot numbers (slot coordinates visible inside the registered players panel). Sitting in someone else's slot triggers a lobby kick by the custom room operator.</p>
            <p>2.3. **Lobbies Punctuality**: Lobbies start precisely at the scheduled time. Players failing to join custom lobbies before start times forfeit their slot entries. No refunds are credited for late joins.</p>
          </div>
        </GlassCard>

        {/* Section 3: Anti-Cheat and Fair Play */}
        <GlassCard glowColor="orange">
          <div className="flex items-center gap-3 border-b pb-4 mb-4 border-white/5 dark:border-white/5">
            <AlertCircle size={24} className="text-brand-orange" />
            <h2 className={`font-display font-black text-lg uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              Section 3: Anti-Cheat & Fair Play policies
            </h2>
          </div>
          <div className={`space-y-3 text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <p>3.1. **Third-Party Hacks**: The use of aimbots, speedhacks, ESP layouts, triggerbots, wallhacks, or customized configs is strictly illegal. Our automated telemetries monitor game aggregates daily. Bypassing anti-cheat results in permanent hardware bans.</p>
            <p>3.2. **Teaming-Up & Collusion**: Teaming-up in solo brackets or coordinate match manipulations leads to direct disqualifications. The prize pools are locked, and entry fees are forfeited.</p>
            <p>3.3. **Malicious Exploiting**: Exploiting custom map glitches, under-textured geometry, or lobby coordination glitches is classified as foul play, resulting in match scores forfeits.</p>
          </div>
        </GlassCard>

        {/* Section 4: Refunds & Payouts */}
        <GlassCard>
          <div className="flex items-center gap-3 border-b pb-4 mb-4 border-white/5 dark:border-white/5">
            <RefreshCw size={24} className="text-brand-cyan" />
            <h2 className={`font-display font-black text-lg uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              Section 4: Financial ledger refunds & payouts policies
            </h2>
          </div>
          <div className={`space-y-3 text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <p>4.1. **Cancellation & Refunds**: If a custom tournament gets cancelled by an administrator (due to technical server lags or moderator unavailability), 100% of entry fees are immediately auto-refunded to all registered player deposit balances.</p>
            <p>4.2. **Manual Placements Verification**: Tournament match placements results and kill scores aggregates are manually verified by operations executives. Prizes credits are added to player winning wallets within 12h of custom room matches completion.</p>
            <p>4.3. **Payout limits**: The minimum withdrawal limit is ₹100. Payout withdrawals raised via UPI IDs are verified, processed, and credited to your verified bank accounts within 24h.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default RulesDocs;
