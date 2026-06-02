import React, { useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { ThemeContext } from '../context/ThemeContext';
import { ShieldCheck, Eye, Database, Lock, Mail } from 'lucide-react';

const Privacy = () => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <div className="text-center py-10 space-y-4 relative">
        <div className="absolute inset-0 bg-brand-purple/5 filter blur-3xl rounded-full max-w-3xl mx-auto pointer-events-none"></div>
        <span className="px-2.5 py-1 text-[10px] font-display font-black bg-brand-purple text-white uppercase tracking-wider rounded">LEGAL CENTER</span>
        <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-none bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-orange bg-clip-text text-transparent uppercase">
          PRIVACY POLICY
        </h1>
        <p className={`max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-semibold ${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          BattleZone is dedicated to safeguarding your digital competitive data. This document outlines what telemetries we analyze, how we protect your wallet details, and our fair-play cookie configurations.
        </p>
        <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'} font-medium`}>
          Last Updated: June 1, 2026
        </p>
      </div>

      {/* Core Privacy Pillars */}
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard hoverEffect={true} glowColor="purple">
          <Eye className="text-brand-purple mb-4" size={36} />
          <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Data Transparency</h3>
          <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            We believe in complete ownership of stats. You have the right to request full archival exports of your entire tournament matches record and deposit ledgers.
          </p>
        </GlassCard>

        <GlassCard hoverEffect={true} glowColor="cyan">
          <ShieldCheck className="text-brand-cyan mb-4" size={36} />
          <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Anti-Cheat Telemetry</h3>
          <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            To prevent wallhacks and emulator bypasses, our client tracks verified tournament match slot configurations and matches them with game server IDs.
          </p>
        </GlassCard>

        <GlassCard hoverEffect={true} glowColor="orange">
          <Lock className="text-brand-orange mb-4" size={36} />
          <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Secured Withdrawals</h3>
          <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            All simulated withdrawal structures and UPI configurations are encrypted at rest with industry-standard AES-256 databases.
          </p>
        </GlassCard>
      </div>

      {/* Main Text Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Detailed Sections */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard glowColor="purple">
            <h2 className={`text-xl font-display font-black uppercase tracking-wider mb-4 border-b pb-2 ${
              darkMode ? 'text-white border-white/5' : 'text-slate-900 border-slate-200'
            }`}>
              1. Information We Collect
            </h2>
            <div className={`space-y-4 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                To provide high-octane esports matching services, BattleZone collects specific data profiles during account creation and custom lobby slot assignment:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className={darkMode ? 'text-white' : 'text-slate-800'}>Profile Information:</strong> Username, Email, Phone Number, and avatar configuration used to establish your player dashboard.
                </li>
                <li>
                  <strong className={darkMode ? 'text-white' : 'text-slate-800'}>Gaming Identifiers:</strong> Your in-game UID (e.g. BGMI ID, Free Fire ID) to correctly assign custom lobby slots and calculate team kills dynamically.
                </li>
                <li>
                  <strong className={darkMode ? 'text-white' : 'text-slate-800'}>Financial Records:</strong> Transaction logs, mock payment gateway feedback, and registered UPI handles to process deposits and prize payouts.
                </li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard glowColor="cyan">
            <h2 className={`text-xl font-display font-black uppercase tracking-wider mb-4 border-b pb-2 ${
              darkMode ? 'text-white border-white/5' : 'text-slate-900 border-slate-200'
            }`}>
              2. How We Utilize Your Telemetry
            </h2>
            <div className={`space-y-4 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                Your data is exclusively processed to ensure the integrity of the competitive ladders. We utilize this information to:
              </p>
              <ul className="list-decimal pl-5 space-y-2">
                <li>Automate room password distribution to verified tournament registrants.</li>
                <li>Analyze game statistics (match rank, final placement, kills) to render live leaderboards.</li>
                <li>Identify patterns of collusive teaming or hacking by analyzing match screenshots uploaded during disputes.</li>
                <li>Ensure KYC validation and prevent multi-account referral abuses to maintain game balance.</li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard glowColor="orange">
            <h2 className={`text-xl font-display font-black uppercase tracking-wider mb-4 border-b pb-2 ${
              darkMode ? 'text-white border-white/5' : 'text-slate-900 border-slate-200'
            }`}>
              3. Data Retention and Deletions
            </h2>
            <div className={`space-y-4 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                We store account metadata for as long as you maintain an active player record. If you wish to delete your account or wipe your tournament leaderboard score history, you can raise an official ticket in the Support Helpdesk.
              </p>
              <p>
                Once processed, your personal data will be completely expunged from all active nodes, preserving only anonymous match statistics to avoid breaking the histories of tournaments you previously joined.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Right Col: Contact & Highlights sidebar */}
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <Database className="text-brand-orange" size={28} />
            <h4 className={`font-display font-bold text-sm uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              DATA STORAGE CENTERS
            </h4>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Our MERN database assets are hosted in secured, state-compliant servers in Mumbai, India. We do not distribute, sell, or rent your mobile handles or transaction slips to 3rd party advertisement grids.
            </p>
          </GlassCard>

          <GlassCard className="space-y-4 border-brand-purple/20 bg-brand-purple/5">
            <ShieldCheck className="text-brand-purple" size={28} />
            <h4 className={`font-display font-bold text-sm uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              GDPR & COMPLIANCE
            </h4>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              We adhere to deep-integrity Indian digital privacy directives alongside global GDPR standards. Request, update, or remove your competitive credentials by reaching out to our data controller.
            </p>
          </GlassCard>

          <GlassCard className="space-y-4">
            <Mail className="text-brand-cyan" size={28} />
            <h4 className={`font-display font-bold text-sm uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              PRIVACY HELPLINE
            </h4>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Got queries regarding anti-cheat scans or banking logs? Contact our security officer directly:
            </p>
            <div className={`p-3 border rounded-xl font-mono text-xs text-center ${
              darkMode ? 'bg-black/20 border-white/5 text-white/90' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              privacy@battlezone.gg
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
