import React, { useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { User as UserIcon } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const Support = ({
  tickets,
  selectedTicket,
  setSelectedTicket,
  newTicketSubject,
  setNewTicketSubject,
  newTicketMessage,
  setNewTicketMessage,
  newTicketCategory,
  setNewTicketCategory,
  ticketReplyInput,
  setTicketReplyInput,
  handleCreateTicket,
  handleReplyTicket,
  viewTicketDetails
}) => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="grid md:grid-cols-3 gap-6">
      
      {/* Raise new support ticket */}
      <GlassCard className="h-fit">
        <h3 className={`font-display font-bold text-sm uppercase border-b pb-3 mb-4 ${
          darkMode ? 'text-white/80 border-white/5' : 'text-slate-700 border-slate-200'
        }`}>RAISE support query</h3>
        
        <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className={`uppercase block font-semibold text-[10px] ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>Category</label>
            <select
              value={newTicketCategory}
              onChange={e => setNewTicketCategory(e.target.value)}
              className={`w-full border rounded-lg p-2.5 focus:outline-none focus:border-brand-purple font-semibold transition ${
                darkMode 
                  ? 'bg-[#111827] border-white/10 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="payment" className={darkMode ? 'bg-[#111827] text-white' : 'bg-white text-slate-800'}>Payment / Wallet deposit</option>
              <option value="tournament" className={darkMode ? 'bg-[#111827] text-white' : 'bg-white text-slate-800'}>Tournament Lobby slot</option>
              <option value="account" className={darkMode ? 'bg-[#111827] text-white' : 'bg-white text-slate-800'}>Profile details / Ban holds</option>
              <option value="technical" className={darkMode ? 'bg-[#111827] text-white' : 'bg-white text-slate-800'}>Technical glitch</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className={`uppercase block font-semibold text-[10px] ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>Subject / Issue Summary</label>
            <input
              type="text"
              value={newTicketSubject}
              onChange={e => setNewTicketSubject(e.target.value)}
              required
              className={`w-full border rounded-lg p-2.5 focus:outline-none focus:border-brand-purple transition ${
                darkMode 
                  ? 'bg-black/40 border-white/10 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
              placeholder="Short description of query"
            />
          </div>

          <div className="space-y-1">
            <label className={`uppercase block font-semibold text-[10px] ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>Details messages</label>
            <textarea
              value={newTicketMessage}
              onChange={e => setNewTicketMessage(e.target.value)}
              required
              rows="4"
              className={`w-full border rounded-lg p-2.5 focus:outline-none focus:border-brand-purple resize-none transition ${
                darkMode 
                  ? 'bg-black/40 border-white/10 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
              placeholder="Explain the problem in detail"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-purple text-white rounded-lg font-display font-bold uppercase text-xs tracking-wider shadow-neon-purple mt-2 hover:opacity-90 transition"
          >
            SUBMIT TICKET
          </button>
        </form>
      </GlassCard>

      {/* List queries / query details chat */}
      <div className="md:col-span-2 space-y-6">
        
        {selectedTicket ? (
          <GlassCard>
            <div className={`flex justify-between items-center border-b pb-3 mb-4 ${
              darkMode ? 'border-white/5' : 'border-slate-200'
            }`}>
              <div>
                <span className="text-[10px] font-mono text-brand-cyan uppercase">{selectedTicket.ticketId}</span>
                <h3 className="font-display font-extrabold text-base text-text-primary">{selectedTicket.subject}</h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className={`text-xs ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                ← Back
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-3 mb-4 p-3 bg-bg-tertiary rounded-xl">
              {selectedTicket.messages.map((m, idx) => (
                <div key={idx} className={`p-3 border rounded-lg text-xs space-y-1 ${
                  darkMode ? 'border-white/5 bg-bg-secondary' : 'border-slate-200 bg-white'
                }`}>
                  <div className={`flex justify-between text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span className={`font-bold uppercase ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{m.senderRole === 'user' ? 'You' : 'BattleZone Support'}</span>
                    <span>{new Date(m.sentAt).toLocaleString()}</span>
                  </div>
                  <p className="text-text-primary">{m.message}</p>
                </div>
              ))}
            </div>

            {selectedTicket.status !== 'closed' ? (
              <form onSubmit={handleReplyTicket} className="flex gap-2">
                <input
                  type="text"
                  value={ticketReplyInput}
                  onChange={e => setTicketReplyInput(e.target.value)}
                  required
                  className={`flex-grow border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-purple transition ${
                    darkMode 
                      ? 'bg-black/40 border-white/10 text-white' 
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                  placeholder="Reply to support executive..."
                />

                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-purple text-white rounded-lg hover:opacity-90 font-display font-bold text-xs uppercase"
                >
                  REPLY
                </button>
              </form>
            ) : (
              <div className={`p-3 border text-xs text-center rounded-lg ${
                darkMode ? 'border-red-500/20 bg-red-500/5 text-red-400' : 'border-red-500/30 bg-red-500/10 text-red-600'
              }`}>
                🔒 This ticket has been marked RESOLVED / CLOSED.
              </div>
            )}
          </GlassCard>
        ) : (
          <GlassCard>
            <h3 className={`font-display font-bold text-sm uppercase border-b pb-3 mb-4 ${
              darkMode ? 'text-white/80 border-white/5' : 'text-slate-700 border-slate-200'
            }`}>ACTIVE SUPPORT TICKETS</h3>
            
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted">No queries raised yet. Fill form to request assistance!</div>
            ) : (
              <div className="space-y-3">
                {tickets.map(t => (
                  <div
                    key={t._id}
                    onClick={() => viewTicketDetails(t)}
                    className={`p-4 border rounded-xl flex justify-between items-center cursor-pointer transition ${
                      darkMode ? 'border-white/5 bg-bg-tertiary hover:bg-white/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-mono text-brand-cyan">{t.ticketId}</span>
                      <h4 className="font-display font-extrabold text-sm mt-0.5 text-text-primary">{t.subject}</h4>
                      <span className="text-[9px] text-text-secondary uppercase block mt-1">Category: {t.category}</span>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        t.status === 'resolved' || t.status === 'closed' ? 'bg-success/20 text-[#10B981]' : 'bg-warning/20 text-[#F59E0B]'
                      }`}>
                        {t.status}
                      </span>
                      <span className="text-[9px] text-text-muted block mt-2">{new Date(t.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        )}
      </div>
    </div>
  );
};


export default Support;
