import React, { useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { User as UserIcon } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const Leaderboard = ({
  leaderboard,
  lbPeriod,
  setLbPeriod,
  lbMetric,
  setLbMetric
}) => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="space-y-6">
      <div className={`flex justify-between items-center border-b pb-3 ${
        darkMode ? 'border-white/5' : 'border-slate-200'
      }`}>
        <h2 className={`text-2xl font-display font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          LEADERBOARD PLACEMENTS
        </h2>
        
        {/* Period toggler */}
        <div className="flex gap-2">
          {['alltime', 'monthly', 'weekly', 'daily'].map(per => (
            <button
              key={per}
              onClick={() => setLbPeriod(per)}
              className={`px-3 py-1 text-xs font-semibold uppercase rounded-lg border transition ${
                lbPeriod === per 
                  ? 'bg-brand-purple border-brand-purple text-white' 
                  : (darkMode ? 'border-white/10 bg-white/5 text-slate-400 hover:text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900')
              }`}
            >
              {per}
            </button>
          ))}
        </div>
      </div>

      {/* rankings lists */}
      <GlassCard>
        <div className={`flex justify-between mb-4 text-xs font-semibold uppercase ${
          darkMode ? 'text-slate-500' : 'text-slate-400'
        }`}>
          <span>Rank</span>
          <span>Warrior Details</span>
          <span>Placements score</span>
        </div>

        {leaderboard.length === 0 ? (
          <div className={`p-8 text-center text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            No ranking data logged for this period. Register for a match to score points!
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map(lb => (
              <div
                key={lb.userId}
                className={`flex justify-between items-center p-3 border rounded-xl transition ${
                  lb.rank === 1 
                    ? (darkMode ? 'border-brand-orange/40 bg-brand-orange/5' : 'border-brand-orange/50 bg-brand-orange/5')
                    : lb.rank === 2 
                      ? (darkMode ? 'border-brand-cyan/20 bg-brand-cyan/5' : 'border-brand-cyan/35 bg-brand-cyan/5')
                      : (darkMode ? 'border-white/5 bg-black/20' : 'border-slate-200 bg-slate-50')
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-display font-black text-sm w-6 text-center ${
                    lb.rank === 1 ? 'text-brand-orange' : lb.rank === 2 ? 'text-brand-cyan' : (darkMode ? 'text-slate-500' : 'text-slate-400')
                  }`}>
                    #{lb.rank}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-purple/20 flex items-center justify-center overflow-hidden border border-white/10 dark:border-white/10">
                      {lb.avatar ? <img src={lb.avatar} className="object-cover w-full h-full" alt="avatar" /> : <UserIcon size={14} />}
                    </div>
                    <span className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      {lb.displayName}
                    </span>
                  </div>
                </div>

                <span className="font-display font-black text-sm text-brand-cyan">{lb.value}</span>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default Leaderboard;
