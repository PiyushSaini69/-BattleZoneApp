import React, { useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import CountdownTimer from '../components/ui/CountdownTimer';
import { ThemeContext } from '../context/ThemeContext';

const TournamentDetail = ({
  selectedTournament,
  participants,
  user,
  enterMatchRoom,
  showRegisterModal,
  setShowRegisterModal,
  registerGameUID,
  setRegisterGameUID,
  handleRegisterTournament,
  setCurrentPage
}) => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="grid md:grid-cols-3 gap-6">
      
      {/* Header and Details left side panel */}
      <div className="md:col-span-2 space-y-6">
        <GlassCard>
          <div className="flex justify-between items-center mb-4">
            <span className="px-2 py-0.5 text-xs font-display font-black uppercase rounded bg-[#7C3AED] text-white">
              {selectedTournament.game.toUpperCase().replace('_', ' ')}
            </span>
            {selectedTournament.status === 'completed' ? (
              <span className="px-2.5 py-0.5 text-[10px] font-display font-bold uppercase border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] rounded">
                COMPLETED
              </span>
            ) : selectedTournament.status === 'cancelled' ? (
              <span className="px-2.5 py-0.5 text-[10px] font-display font-bold uppercase border border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444] rounded">
                CANCELLED
              </span>
            ) : selectedTournament.status === 'live' ? (
              <span className="px-2.5 py-0.5 text-[10px] font-display font-bold uppercase border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B] rounded animate-pulse">
                LIVE NOW
              </span>
            ) : (
              <CountdownTimer targetDate={selectedTournament.scheduledAt} />
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-wide text-[#06B6D4]">{selectedTournament.title}</h2>
          <p className={`text-sm mt-3 leading-relaxed ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>{selectedTournament.description}</p>
          
          <div className={`grid grid-cols-3 gap-4 border-y py-4 mt-6 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
            <div>
              <span className={`text-[10px] block ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>PRIZE POOL</span>
              <span className={`font-display font-black text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>₹{selectedTournament.prizePool}</span>
            </div>
            <div>
              <span className={`text-[10px] block ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>ENTRY FEE</span>
              <span className="font-display font-black text-lg text-[#F97316]">{selectedTournament.entryFee === 0 ? 'FREE' : `₹${selectedTournament.entryFee}`}</span>
            </div>
            <div>
              <span className={`text-[10px] block ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>GAME MODE</span>
              <span className={`font-display font-black text-xs uppercase mt-1 block ${darkMode ? 'text-white' : 'text-slate-800'}`}>{selectedTournament.gameMode.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <h4 className={`font-display font-bold text-sm tracking-wide ${darkMode ? 'text-white' : 'text-slate-800'}`}>OFFICIAL RULES & REGULATIONS</h4>
            <ul className={`list-disc pl-5 text-xs space-y-1 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
              {selectedTournament.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        </GlassCard>

        {/* Participants registration block */}
        <GlassCard>
          <h3 className="font-display font-black text-lg text-[#06B6D4] mb-4 uppercase">Registered Players</h3>
          
          {participants.length === 0 ? (
            <div className={`p-6 text-center text-xs ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>No participants registered yet. Be the first to grab a slot!</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {participants.map(part => (
                <div key={part.slotNumber} className={`flex justify-between items-center p-3 border rounded-xl ${
                  darkMode ? 'border-white/5 bg-black/20' : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-xs ${darkMode ? 'text-white/35' : 'text-slate-400'}`}>#{part.slotNumber}</span>
                    <span className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{part.displayName}</span>
                  </div>
                  <span className={`text-[10px] font-mono ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>{part.gameUID}</span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Action register sidebar */}
      <div className="space-y-6">
        <GlassCard glowColor="purple">
          <h3 className={`font-display font-extrabold text-sm uppercase border-b pb-3 mb-4 ${
            darkMode ? 'text-white/80 border-white/5' : 'text-slate-700 border-slate-200'
          }`}>MATCH SCHEDULE & SLOTS</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between text-xs">
              <span className={darkMode ? 'text-white/40' : 'text-slate-500'}>Match Schedule</span>
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{new Date(selectedTournament.scheduledAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className={darkMode ? 'text-white/40' : 'text-slate-500'}>Registered Slots</span>
              <span className="font-semibold text-[#06B6D4]">{selectedTournament.filledSlots} / {selectedTournament.totalSlots}</span>
            </div>
          </div>

          <div className="pt-6">
            {selectedTournament.status === 'completed' ? (
              <div className="w-full text-center py-4 bg-[#10B981]/15 border border-[#10B981]/30 rounded-xl">
                <span className="font-display font-black text-xs text-[#10B981] uppercase tracking-widest block">
                  🏆 TOURNAMENT COMPLETED
                </span>
                <span className={`text-[10px] block mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Results are posted & prizes credited!
                </span>
              </div>
            ) : selectedTournament.status === 'cancelled' ? (
              <div className="w-full text-center py-4 bg-[#EF4444]/15 border border-[#EF4444]/30 rounded-xl">
                <span className="font-display font-black text-xs text-[#EF4444] uppercase tracking-widest block">
                  🚫 TOURNAMENT CANCELLED
                </span>
                <span className={`text-[10px] block mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  This event was cancelled. Fees refunded.
                </span>
              </div>
            ) : user ? (
              <>
                {participants.some(p => p.username === user.username) ? (
                  <button
                    onClick={() => enterMatchRoom(selectedTournament)}
                    className="w-full py-3 bg-[#10B981] rounded-xl font-display font-black tracking-wider uppercase shadow-lg text-black hover:opacity-90 transition"
                  >
                    🟢 ENTER MATCH ROOM
                  </button>
                ) : (
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    disabled={selectedTournament.filledSlots >= selectedTournament.totalSlots}
                    className="w-full py-3 bg-[#F97316] rounded-xl font-display font-black tracking-wider uppercase shadow-neon-orange hover:scale-102 transition disabled:opacity-50 text-white"
                  >
                    {selectedTournament.filledSlots >= selectedTournament.totalSlots ? 'ALL SLOTS FULL' : 'REGISTER & PAY NOW'}
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className={`w-full py-3 border rounded-xl font-display font-bold uppercase tracking-wider transition ${
                  darkMode ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                LOGIN TO REGISTER
              </button>
            )}
          </div>
        </GlassCard>

        {/* Prize distribution breakdown */}
        <GlassCard>
          <h3 className={`font-display font-extrabold text-sm uppercase border-b pb-3 mb-4 ${
            darkMode ? 'text-white/80 border-white/5' : 'text-slate-700 border-slate-200'
          }`}>PRIZE DISTRIBUTION</h3>
          <div className="space-y-3">
            {selectedTournament.prizeDistribution.map(dist => (
              <div key={dist.rank} className={`flex justify-between items-center text-xs p-2 border rounded-lg ${
                darkMode ? 'border-white/5 bg-black/20' : 'border-slate-200 bg-slate-50'
              }`}>
                <span className={`font-semibold ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>Rank #{dist.rank} Placement</span>
                <span className="font-display font-extrabold text-[#06B6D4] text-sm">₹{dist.amount} ({dist.percentage}%)</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Registration popup modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className={`w-full max-w-md border rounded-2xl p-6 shadow-neon-orange relative ${
            darkMode ? 'border-white/10 bg-[#111827]' : 'border-slate-300 bg-white'
          }`}>
            <h3 className="font-display font-black text-xl text-[#F97316] mb-4 uppercase">JOIN THE BATTLE</h3>
            <p className={`text-xs mb-4 leading-relaxed ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
              Confirm your registration for this tournament. The entry fee of <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>₹{selectedTournament.entryFee}</span> will be deducted automatically from your active deposit and bonus balances.
            </p>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>Your Gaming UID</label>
                <input
                  type="text"
                  value={registerGameUID}
                  onChange={e => setRegisterGameUID(e.target.value)}
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-[#F97316] transition ${
                    darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                  placeholder="Enter Game character ID / Nickname"
                  required
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  onClick={handleRegisterTournament}
                  className="flex-grow py-3 bg-[#F97316] text-white rounded-lg font-display font-black uppercase text-xs tracking-wider hover:opacity-90 transition"
                >
                  CONFIRM & PAY
                </button>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className={`px-4 py-3 border rounded-lg text-xs font-semibold uppercase transition ${
                    darkMode ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default TournamentDetail;
