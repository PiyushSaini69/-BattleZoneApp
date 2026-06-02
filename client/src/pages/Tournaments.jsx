import React, { useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import CountdownTimer from '../components/ui/CountdownTimer';
import { ThemeContext } from '../context/ThemeContext';

const Tournaments = ({
  tournaments,
  gameFilter,
  setGameFilter,
  loadTournaments,
  viewTournamentDetail
}) => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className={`text-2xl font-display font-black tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          ACTIVE ESPORTS TOURNAMENTS
        </h2>
        
        {/* Game Filters */}
        <div className="flex gap-2">
          {['', 'bgmi', 'free_fire', 'valorant', 'cod_mobile'].map(game => (
            <button
              key={game}
              onClick={() => {
                setGameFilter(game);
                loadTournaments(game);
              }}
              className={`px-3 py-1.5 text-xs font-semibold uppercase rounded-lg border transition ${
                gameFilter === game 
                  ? 'bg-brand-purple border-brand-purple text-white' 
                  : (darkMode ? 'border-white/10 bg-white/5 text-slate-400 hover:text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900')
              }`}
            >
              {game === '' ? 'ALL' : game.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog items list */}
      {tournaments.length === 0 ? (
        <div className={`p-12 text-center border rounded-xl font-semibold ${
          darkMode ? 'border-white/5 bg-white/3 text-slate-500' : 'border-slate-100 bg-slate-50 text-slate-400'
        }`}>
          No active tournaments found in database. Check back soon or load the admin seeds!
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map(t => (
            <GlassCard key={t._id} hoverEffect={true} glowColor={t.game === 'bgmi' ? 'purple' : t.game === 'valorant' ? 'cyan' : 'orange'}>
              <div className="flex justify-between items-center mb-3">
                <span className="px-2 py-0.5 text-[9px] font-display font-black uppercase tracking-wider rounded bg-brand-cyan text-black">
                  {t.game.toUpperCase().replace('_', ' ')}
                </span>
                {t.status === 'completed' ? (
                  <span className="px-2.5 py-0.5 text-[9px] font-display font-bold uppercase border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] rounded">
                    COMPLETED
                  </span>
                ) : t.status === 'cancelled' ? (
                  <span className="px-2.5 py-0.5 text-[9px] font-display font-bold uppercase border border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444] rounded">
                    CANCELLED
                  </span>
                ) : t.status === 'live' ? (
                  <span className="px-2.5 py-0.5 text-[9px] font-display font-bold uppercase border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B] rounded animate-pulse">
                    LIVE NOW
                  </span>
                ) : (
                  <CountdownTimer targetDate={t.scheduledAt} />
                )}
              </div>

              <h3 className={`font-display font-extrabold text-base tracking-wide line-clamp-1 mb-2 ${
                darkMode ? 'text-white' : 'text-slate-800'
              }`}>{t.title}</h3>
              
              <div className={`grid grid-cols-2 gap-2 text-xs border-t pt-3 mt-3 ${
                darkMode ? 'text-slate-400 border-white/5' : 'text-slate-500 border-slate-100'
              }`}>
                <div>
                  <span className="text-[10px] block opacity-60">PRIZE POOL</span>
                  <span className={`font-display font-black text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>₹{t.prizePool}</span>
                </div>
                <div>
                  <span className="text-[10px] block opacity-60">ENTRY FEE</span>
                  <span className="font-display font-black text-sm text-brand-orange">{t.entryFee === 0 ? 'FREE' : `₹${t.entryFee}`}</span>
                </div>
                <div className="col-span-2 pt-1">
                  <div className="flex justify-between text-[10px] mb-1 font-semibold">
                    <span>Slots Allocation</span>
                    <span className="text-brand-cyan">{t.filledSlots} / {t.totalSlots}</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                    darkMode ? 'bg-white/10' : 'bg-slate-200'
                  }`}>
                    <div
                      className="bg-brand-cyan h-full rounded-full transition-all duration-300"
                      style={{ width: `${(t.filledSlots / t.totalSlots) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {t.status === 'completed' ? (
                <button
                  onClick={() => viewTournamentDetail(t.slug)}
                  className={`w-full mt-4 py-2 border rounded-lg transition text-xs font-display font-bold uppercase tracking-wider ${
                    darkMode 
                      ? 'border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20' 
                      : 'border-[#10B981]/40 bg-[#10B981]/5 text-[#10B981] hover:bg-[#10B981]/15'
                  }`}
                >
                  🏆 VIEW MATCH RESULTS
                </button>
              ) : t.status === 'cancelled' ? (
                <button
                  onClick={() => viewTournamentDetail(t.slug)}
                  className={`w-full mt-4 py-2 border rounded-lg transition text-xs font-display font-bold uppercase tracking-wider ${
                    darkMode 
                      ? 'border-white/10 bg-white/5 text-slate-500 hover:text-slate-400' 
                      : 'border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-500'
                  }`}
                >
                  🚫 VIEW STATUS / ARCHIVE
                </button>
              ) : (
                <button
                  onClick={() => viewTournamentDetail(t.slug)}
                  className={`w-full mt-4 py-2 border rounded-lg transition text-xs font-display font-bold uppercase tracking-wider ${
                    darkMode 
                      ? 'border-[#7C3AED]/30 bg-[#7C3AED]/10 text-[#7C3AED] hover:bg-[#7C3AED]/20' 
                      : 'border-[#7C3AED]/40 bg-[#7C3AED]/5 text-[#7C3AED] hover:bg-[#7C3AED]/15'
                  }`}
                >
                  ENTER TOURNAMENT HUB
                </button>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tournaments;
