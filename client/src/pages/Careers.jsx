import React, { useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { ThemeContext } from '../context/ThemeContext';
import { Briefcase, MapPin, DollarSign, Clock, Gamepad2 } from 'lucide-react';

const Careers = () => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  const jobs = [
    {
      title: "Senior MERN Stack Architect",
      department: "Engineering (Web Platforms)",
      location: "Bengaluru, India (Hybrid)",
      salary: "₹18L - ₹26L per annum",
      type: "Full-Time",
      description: "Own the core lobbies coordination engine, high-concurrency Node.js socket servers, automated Razorpay transactions integrations, and premium MERN React layout architectures."
    },
    {
      title: "Esports Lobbies & Anti-Cheat Lead",
      department: "Operations & Fair Play Control",
      location: "Remote (India)",
      salary: "₹6L - ₹10L per annum",
      type: "Full-Time",
      description: "Direct custom lobby parameters, perform automated anti-cheat telemetry sweeps, verify custom mobile aggregates placements, and process live player score uploads."
    },
    {
      title: "Customer Success Support Advisor",
      department: "User Operations Support",
      location: "New Delhi, India (On-Site)",
      salary: "₹4L - ₹6L per annum",
      type: "Full-Time",
      description: "Manage active support queues, approve verified wallet withdrawals requests, process payouts balances refunds on tournament cancellations, and provide high-fidelity tickets chat helpdesk support."
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Block */}
      <div className="text-center py-10 space-y-4 relative">
        <div className="absolute inset-0 bg-brand-cyan/5 filter blur-3xl rounded-full max-w-3xl mx-auto pointer-events-none"></div>
        <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-none bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-orange bg-clip-text text-transparent uppercase">
          JOIN THE WARRIORS ENGINE
        </h1>
        <p className={`max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-semibold ${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Shape the future of competitive mobile gaming in India. Help us scale high-concurrency custom tournament platforms, build instant financial ledger integrations, and build absolute trust in MERN gaming.
        </p>
      </div>

      {/* Philosophy banner */}
      <div className={`p-6 border rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between ${
        darkMode ? 'border-brand-purple/20 bg-brand-purple/5' : 'border-brand-purple/30 bg-brand-purple/5'
      }`}>
        <div className="space-y-2">
          <h3 className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>🛠️ WHY JOIN BATTLEZONE?</h3>
          <p className={`text-xs max-w-xl leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            We offer pre-Series A equity plans, complete remote flexibility for engineering roles, premium gaming setup hardware stipends, and an incredibly fast-paced, MERN-centric developer catalog.
          </p>
        </div>
        <span className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-cyan text-white text-xs font-display font-black rounded-lg uppercase tracking-wider shadow-neon-purple shrink-0">
          COMPETE & GROW
        </span>
      </div>

      {/* Jobs Listing Grid */}
      <div className="space-y-6">
        <h2 className={`text-xl font-display font-black uppercase tracking-wider ${
          darkMode ? 'text-white' : 'text-slate-850'
        }`}>ACTIVE OPENINGS ({jobs.length})</h2>

        <div className="space-y-4">
          {jobs.map((job, idx) => (
            <GlassCard key={idx} hoverEffect={true} glowColor={idx === 0 ? 'purple' : idx === 1 ? 'cyan' : 'orange'} className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 mb-4 select-none border-white/5 dark:border-white/5">
                <div>
                  <span className="px-2 py-0.5 text-[9px] font-display font-black uppercase tracking-wider rounded bg-brand-purple text-white mb-2 inline-block">
                    {job.department}
                  </span>
                  <h3 className={`font-display font-black text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    {job.title}
                  </h3>
                </div>

                <span className="px-3 py-1 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold rounded-lg uppercase">
                  {job.type}
                </span>
              </div>

              <p className={`text-xs leading-relaxed mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {job.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-brand-cyan" />
                  <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-[#10B981]" />
                  <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>{job.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-brand-orange" />
                  <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>Immediate Joining</span>
                </div>
              </div>

              <button
                onClick={() => alert(`Please send your updated Resume/CV and MERN GitHub profile links directly to careers@battlezone.in with the subject line [MERN APPLICATION]: ${job.title}`)}
                className={`w-full mt-6 py-2.5 rounded-lg text-xs font-display font-black uppercase tracking-widest transition ${
                  darkMode 
                    ? 'bg-white/5 border border-white/10 hover:bg-white/10 text-white' 
                    : 'bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800'
                }`}
              >
                APPLY FOR THIS ROLE
              </button>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Careers;
