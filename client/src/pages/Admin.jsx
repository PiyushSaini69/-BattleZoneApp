import React, { useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { ShieldCheck, Plus } from 'lucide-react';
import { request } from '../services/api';
import { ThemeContext } from '../context/ThemeContext';

const Admin = ({
  adminStats,
  tournaments,
  adminWithdrawals,
  showCreateTournamentModal,
  setShowCreateTournamentModal,
  newTTitle,
  setNewTTitle,
  newTGame,
  setNewTGame,
  newTMode,
  setNewTMode,
  newTType,
  setNewTType,
  newTFee,
  setNewTFee,
  newTPool,
  setNewTPool,
  newTSlots,
  setNewTSlots,
  newTTime,
  setNewTTime,
  handleCreateTournament,
  handleCancelTournament,
  handleApproveWithdrawal,
  handleRejectWithdrawal,
  triggerMockResults,
  loadAdminDashboard,
  showToast
}) => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="space-y-8">
      {/* Header widgets */}
      <div className={`flex justify-between items-center border-b pb-3 ${darkMode ? 'border-white/5' : 'border-slate-200'}`}>
        <h2 className="text-2xl font-display font-black tracking-wide text-[#F97316] flex items-center gap-2">
          <ShieldCheck /> ADMINISTRATIVE OPERATIONS
        </h2>
        
        <button
          onClick={() => setShowCreateTournamentModal(true)}
          className="px-4 py-2 bg-[#F97316] text-white rounded-lg hover:scale-102 transition font-display font-black text-xs uppercase flex items-center gap-1 shadow-neon-orange"
        >
          <Plus size={16} /> Create Tournament
        </button>
      </div>

      {/* Aggregated widgets cards */}
      {adminStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="p-4">
            <span className={`text-[10px] uppercase block font-semibold ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>ALL-TIME REVENUE</span>
            <span className="font-display font-black text-lg text-[#10B981]">₹{adminStats.revenue.total}</span>
          </GlassCard>
          <GlassCard className="p-4">
            <span className={`text-[10px] uppercase block font-semibold ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>REGISTERED USERS</span>
            <span className="font-display font-black text-lg text-[#06B6D4]">{adminStats.users.total}</span>
          </GlassCard>
          <GlassCard className="p-4">
            <span className={`text-[10px] uppercase block font-semibold ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>ACTIVE PLAYERS TODAY</span>
            <span className="font-display font-black text-lg text-[#7C3AED]">{adminStats.users.activeToday}</span>
          </GlassCard>
          <GlassCard className="p-4">
            <span className={`text-[10px] uppercase block font-semibold ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>PENDING PAYOUTS</span>
            <span className="font-display font-black text-lg text-[#F97316]">₹{adminStats.withdrawals.pendingAmount}</span>
          </GlassCard>
        </div>
      )}

      {/* Actions listings */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Active tournament controls */}
        <GlassCard>
          <h3 className={`font-display font-bold text-sm uppercase border-b pb-3 mb-4 ${
            darkMode ? 'text-white/80 border-white/5' : 'text-slate-700 border-slate-200'
          }`}>TOURNAMENTS ENGINE CONTROLS</h3>
          
          {tournaments.length === 0 ? (
            <div className={`p-6 text-center text-xs ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>No tournaments created. Seed now!</div>
          ) : (
            <div className="space-y-4">
              {tournaments.map(t => (
                <div key={t._id} className={`p-3 border rounded-xl space-y-2 ${
                  darkMode ? 'border-white/5 bg-black/20' : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-[#06B6D4] font-mono uppercase">{t.game} ({t.tournamentType})</span>
                      <h4 className={`font-display font-extrabold text-sm leading-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t.title}</h4>
                    </div>
                    
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      t.status === 'completed' ? 'bg-[#10B981]/20 text-[#10B981]' : t.status === 'cancelled' ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  {t.status !== 'completed' && t.status !== 'cancelled' && (
                    <div className="space-y-3 pt-1">
                      <div className="flex gap-2">
                        {!t.roomId && (
                          <button
                            onClick={() => {
                              const id = prompt('Enter Room ID:');
                              const pass = prompt('Enter Room Password:');
                              if (id && pass) {
                                request(`/admin/tournaments/${t._id}/room`, {
                                  method: 'PATCH',
                                  body: JSON.stringify({ roomId: id, roomPassword: pass })
                                }).then(r => {
                                  if (r.success) {
                                    showToast('Room ID & Password saved.');
                                    loadAdminDashboard();
                                  }
                                });
                              }
                            }}
                            className="px-3 py-1.5 border border-[#06B6D4]/30 bg-[#06B6D4]/5 text-[#06B6D4] hover:bg-[#06B6D4]/15 rounded text-[10px] font-bold uppercase transition"
                          >
                            🔑 Set Room
                          </button>
                        )}
                        <button
                          onClick={() => triggerMockResults(t)}
                          className="px-3 py-1.5 border border-success/30 bg-success/5 text-[#10B981] hover:bg-success/15 rounded text-[10px] font-bold uppercase transition"
                        >
                          🏆 Complete & Pay
                        </button>
                        <button
                          onClick={() => handleCancelTournament(t._id)}
                          className="px-3 py-1.5 border border-danger/30 bg-danger/5 text-[#EF4444] hover:bg-danger/15 rounded text-[10px] font-bold uppercase transition"
                        >
                          🚫 Cancel
                        </button>
                      </div>

                      {/* Display Room ID & Password under the card if configured */}
                      {t.roomId && t.roomPassword && (
                        <div className={`p-2.5 rounded-lg border flex flex-col gap-1 text-[11px] ${
                          darkMode ? 'bg-black/35 border-white/5 text-slate-300' : 'bg-slate-100/50 border-slate-200 text-slate-600'
                        }`}>
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="opacity-60 uppercase font-bold text-[9px] tracking-wider">ROOM CONFIGURATION</span>
                            <span className="text-[9px] font-bold text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded uppercase">
                              Configured
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                              <div>
                                <span className="opacity-50">Room ID:</span>{' '}
                                <strong className={`font-mono text-xs ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t.roomId}</strong>
                              </div>
                              <div>
                                <span className="opacity-50">Password:</span>{' '}
                                <strong className={`font-mono text-xs ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t.roomPassword}</strong>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const id = prompt('Edit Room ID:', t.roomId);
                                const pass = prompt('Edit Room Password:', t.roomPassword);
                                if (id && pass) {
                                  request(`/admin/tournaments/${t._id}/room`, {
                                    method: 'PATCH',
                                    body: JSON.stringify({ roomId: id, roomPassword: pass })
                                  }).then(r => {
                                    if (r.success) {
                                      showToast('Room details updated.');
                                      loadAdminDashboard();
                                    }
                                  });
                                }
                              }}
                              className="text-[9px] text-[#06B6D4] hover:underline font-bold uppercase"
                            >
                              Edit details
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Pending Withdrawals queue list */}
        <GlassCard>
          <h3 className={`font-display font-bold text-sm uppercase border-b pb-3 mb-4 ${
            darkMode ? 'text-white/80 border-white/5' : 'text-slate-700 border-slate-200'
          }`}>PENDING PAYOUTS QUEUE</h3>
          
          {adminWithdrawals.length === 0 ? (
            <div className={`p-8 text-center text-xs ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>No pending withdrawals registered! Great!</div>
          ) : (
            <div className="space-y-4">
              {adminWithdrawals.map(w => (
                <div key={w._id} className={`p-3 border rounded-xl flex justify-between items-center text-xs ${
                  darkMode ? 'border-white/5 bg-black/20' : 'border-slate-200 bg-slate-50'
                }`}>
                  <div>
                    <span className="font-semibold text-[#06B6D4] uppercase">{w.method} Payout</span>
                    <h4 className={`font-display font-extrabold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>₹{w.amount}</h4>
                    <span className={`text-[10px] block mt-1 ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>To: {w.upiId || w.userId?.email}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveWithdrawal(w._id)}
                      className="px-2.5 py-1.5 bg-[#10B981] rounded text-[10px] font-bold text-black uppercase hover:opacity-90 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectWithdrawal(w._id)}
                      className="px-2.5 py-1.5 bg-[#EF4444] rounded text-[10px] font-bold text-white uppercase hover:opacity-90 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Create Tournament Input modal popup */}
      {showCreateTournamentModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className={`w-full max-w-md border rounded-2xl p-6 shadow-neon-purple relative max-h-[90vh] overflow-y-auto ${
            darkMode ? 'border-white/10 bg-[#111827]' : 'border-slate-300 bg-white'
          }`}>
            <h3 className="font-display font-black text-xl text-[#F97316] mb-4 uppercase">CREATE TOURNAMENT</h3>
            
            <form onSubmit={handleCreateTournament} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className={darkMode ? 'text-white/40' : 'text-slate-500'}>Tournament Title</label>
                <input
                  type="text"
                  value={newTTitle}
                  onChange={e => setNewTTitle(e.target.value)}
                  required
                  className={`w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#7C3AED] transition ${
                    darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                  placeholder="e.g. BGMI Pro Championship"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={darkMode ? 'text-white/40' : 'text-slate-500'}>Game</label>
                  <select
                    value={newTGame}
                    onChange={e => setNewTGame(e.target.value)}
                    className={`w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#7C3AED] font-semibold transition ${
                      darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="bgmi">BGMI</option>
                    <option value="free_fire">Free Fire</option>
                    <option value="valorant">Valorant</option>
                    <option value="cod_mobile">CODM</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={darkMode ? 'text-white/40' : 'text-slate-500'}>Mode</label>
                  <select
                    value={newTMode}
                    onChange={e => setNewTMode(e.target.value)}
                    className={`w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#7C3AED] font-semibold transition ${
                      darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="battle_royale">Battle Royale</option>
                    <option value="lone_wolf">Lone Wolf</option>
                    <option value="clash_squad">Clash Squad</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className={darkMode ? 'text-white/40' : 'text-slate-500'}>Entry Fee</label>
                  <input
                    type="number"
                    value={newTFee}
                    onChange={e => setNewTFee(e.target.value)}
                    required
                    className={`w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#7C3AED] transition ${
                      darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={darkMode ? 'text-white/40' : 'text-slate-500'}>Prize Pool</label>
                  <input
                    type="number"
                    value={newTPool}
                    onChange={e => setNewTPool(e.target.value)}
                    required
                    className={`w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#7C3AED] transition ${
                      darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={darkMode ? 'text-white/40' : 'text-slate-500'}>Slots</label>
                  <input
                    type="number"
                    value={newTSlots}
                    onChange={e => setNewTSlots(e.target.value)}
                    required
                    className={`w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#7C3AED] transition ${
                      darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={darkMode ? 'text-white/40' : 'text-slate-500'}>Schedule Start Time</label>
                <input
                  type="datetime-local"
                  value={newTTime}
                  onChange={e => setNewTTime(e.target.value)}
                  required
                  className={`w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#7C3AED] transition ${
                    darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-grow py-3 bg-[#F97316] text-white rounded-lg font-display font-black uppercase tracking-wider hover:opacity-95 transition"
                >
                  CREATE
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateTournamentModal(false)}
                  className={`px-4 py-3 border rounded-lg font-semibold uppercase transition ${
                    darkMode ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  CLOSE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default Admin;
