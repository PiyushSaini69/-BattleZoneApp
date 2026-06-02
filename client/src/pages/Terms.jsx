import React, { useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { ThemeContext } from '../context/ThemeContext';
import { ShieldAlert, Award, CreditCard, Scale, HelpCircle } from 'lucide-react';

const Terms = () => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <div className="text-center py-10 space-y-4 relative">
        <div className="absolute inset-0 bg-brand-cyan/5 filter blur-3xl rounded-full max-w-3xl mx-auto pointer-events-none"></div>
        <span className="px-2.5 py-1 text-[10px] font-display font-black bg-brand-cyan text-white uppercase tracking-wider rounded">RULES OF ENGAGEMENT</span>
        <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-none bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-orange bg-clip-text text-transparent uppercase">
          TERMS OF SERVICE
        </h1>
        <p className={`max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-semibold ${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Welcome to BattleZone. By accessing our platform, tournament lobbies, or simulated wallet engines, you agree to comply with our competitive code of conduct.
        </p>
        <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'} font-medium`}>
          Last Updated: June 1, 2026
        </p>
      </div>

      {/* Core Term Pillars */}
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard hoverEffect={true} glowColor="cyan">
          <ShieldAlert className="text-brand-cyan mb-4" size={36} />
          <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Zero Hack Policy</h3>
          <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Any usage of wallhacks, auto-aimers, network lag switches, or companion simulators will trigger immediate, permanent account bans and forfeiture of wallet funds.
          </p>
        </GlassCard>

        <GlassCard hoverEffect={true} glowColor="purple">
          <Award className="text-brand-purple mb-4" size={36} />
          <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Tournament Slots</h3>
          <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Lobby slots are assigned in real-time. Players must enter correct gaming UIDs. Failure to enter correct IDs will result in slot allocation forfeiture without refunds.
          </p>
        </GlassCard>

        <GlassCard hoverEffect={true} glowColor="orange">
          <CreditCard className="text-brand-orange mb-4" size={36} />
          <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Simulated Payouts</h3>
          <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Deposits and withdrawals are managed in Indian Rupees (₹). Simulated transaction logs mimic production APIs to test esports payout infrastructures.
          </p>
        </GlassCard>
      </div>

      {/* Detailed Document Text */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Terms */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard glowColor="cyan">
            <h2 className={`text-xl font-display font-black uppercase tracking-wider mb-4 border-b pb-2 ${
              darkMode ? 'text-white border-white/5' : 'text-slate-900 border-slate-200'
            }`}>
              1. Account Eligibility & Registration
            </h2>
            <div className={`space-y-4 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                To participate in BattleZone cash lobbies, you must satisfy the following criteria:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>You must be at least 18 years of age (or have explicit parental guidance if under age).</li>
                <li>You must possess a valid, active gaming UID associated with compatible game clients (e.g. Krafton BGMI).</li>
                <li>You must not reside in Indian states where local ordinances restrict pay-to-play skill gaming (such as Assam, Odisha, Telangana, Andhra Pradesh, Sikkim, and Nagaland).</li>
                <li>You are allowed to register exactly one account. Alternate profiles created to exploit the ₹10 sign-up bonus will be flagged by telemetry systems and banned.</li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard glowColor="purple">
            <h2 className={`text-xl font-display font-black uppercase tracking-wider mb-4 border-b pb-2 ${
              darkMode ? 'text-white border-white/5' : 'text-slate-900 border-slate-200'
            }`}>
              2. Simulated Wallets & UPI Transactions
            </h2>
            <div className={`space-y-4 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                BattleZone employs a simulated dual-balance wallet system comprising a Deposit Balance, Winning Balance, and a promotional Bonus Balance:
              </p>
              <ul className="list-decimal pl-5 space-y-2">
                <li>
                  <strong className={darkMode ? 'text-white' : 'text-slate-800'}>Deposits:</strong> Handled through simulated payment grids. Mock credit responses trigger instantaneous virtual deposit allocations to your wallet.
                </li>
                <li>
                  <strong className={darkMode ? 'text-white' : 'text-slate-800'}>Prize Earnings:</strong> Distributed to your Winning Balance within 15 minutes of tournament result uploads by our admin desk.
                </li>
                <li>
                  <strong className={darkMode ? 'text-white' : 'text-slate-800'}>Withdrawals:</strong> Processed to verified UPI addresses. Administrative staff review all withdrawal tickets within a maximum 24-hour SLA to check for anti-cheat clearances.
                </li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard glowColor="orange">
            <h2 className={`text-xl font-display font-black uppercase tracking-wider mb-4 border-b pb-2 ${
              darkMode ? 'text-white border-white/5' : 'text-slate-900 border-slate-200'
            }`}>
              3. Custom Lobby Slot Regulations
            </h2>
            <div className={`space-y-4 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                Once registered for a tournament, you are allocated a live slot number. Lobbies are hosted via custom in-game rooms:
              </p>
              <p>
                Room IDs and Passwords are automatically distributed in the real-time match room page 15 minutes prior to the scheduled launch. You are required to join your assigned slot. Entering alternate slots or inviting unregistered teammates will trigger an immediate kick from the lobby and disqualification without fee refunds.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Right Col: Sidebar info */}
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <Scale className="text-brand-cyan" size={28} />
            <h4 className={`font-display font-bold text-sm uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              LEGAL LIMITATIONS
            </h4>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              BattleZone is a skill-based competitive tournament host. We do not support, endorse, or host games of absolute chance, sports betting, or interactive slots.
            </p>
          </GlassCard>

          <GlassCard className="space-y-4 border-brand-orange/20 bg-brand-orange/5">
            <ShieldAlert className="text-brand-orange" size={28} />
            <h4 className={`font-display font-bold text-sm uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              ANTI-COLLUSION CHECKS
            </h4>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Our staff actively inspects custom match replays. If two independent solo competitors are found to be cooperating (teaming) inside a battle royale lobby, both accounts will face immediate bans and balance forfeiture.
            </p>
          </GlassCard>

          <GlassCard className="space-y-4">
            <HelpCircle className="text-brand-purple" size={28} />
            <h4 className={`font-display font-bold text-sm uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              DISPUTE DESK
            </h4>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Have questions regarding specific leaderboard points allocations or withdrawal validations? Open an official ticket at:
            </p>
            <div className={`p-3 border rounded-xl font-mono text-xs text-center ${
              darkMode ? 'bg-black/20 border-white/5 text-white/90' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              legal@battlezone.gg
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Terms;
