import React, { useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { Gamepad2, Send } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const MatchRoom = ({
  selectedTournament,
  roomDetails,
  chatMessages,
  chatInput,
  setChatInput,
  sendRoomChatMessage,
  chatEndRef,
  user
}) => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="grid md:grid-cols-3 gap-6">
      
      {/* Left credentials panels */}
      <div className="md:col-span-2 space-y-6">
        <GlassCard glowColor="cyan">
          <div className={`flex justify-between items-center border-b pb-3 mb-4 ${
            darkMode ? 'border-white/5' : 'border-slate-200'
          }`}>
            <h2 className="text-xl font-display font-black tracking-wide text-[#06B6D4] uppercase">Match Lobbies Credentials</h2>
            <span className="px-2 py-0.5 text-[9px] font-display font-black bg-[#10B981] text-black uppercase tracking-wider rounded">ROOM OPEN</span>
          </div>

          <div className={`border rounded-xl p-4 space-y-3 ${
            darkMode ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`flex justify-between border-b pb-2 text-xs ${
              darkMode ? 'border-white/5' : 'border-slate-200'
            }`}>
              <span className={darkMode ? 'text-white/40' : 'text-slate-500'}>ROOM ID</span>
              <span className={`font-mono font-bold text-sm select-all ${darkMode ? 'text-white' : 'text-slate-800'}`}>{roomDetails.roomId}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className={darkMode ? 'text-white/40' : 'text-slate-500'}>PASSWORD</span>
              <span className="font-mono font-bold text-[#F97316] text-sm select-all">{roomDetails.roomPassword}</span>
            </div>
          </div>

          <div className={`border rounded-xl p-4 mt-6 text-xs space-y-1 ${
            darkMode ? 'bg-[#06B6D4]/5 border-[#06B6D4]/20 text-white/70' : 'bg-cyan-50 border-cyan-200 text-slate-700'
          }`}>
            <span className={`font-display font-bold uppercase block ${darkMode ? 'text-white' : 'text-slate-800'}`}>MATCHROOM INSTRUCTIONS</span>
            <span>1. Open the respective gaming client (BGMI / Valorant).</span>
            <span>2. Select "Custom Room" lobby search, search ID: {roomDetails.roomId}.</span>
            <span>3. Input lobby password, sit in your designated Slot assigned by moderator!</span>
          </div>
        </GlassCard>
      </div>

      {/* Chat Room panel */}
      <div className={`flex flex-col h-[500px] border rounded-2xl overflow-hidden shadow-2xl ${
        darkMode ? 'border-white/10 bg-[#111827]' : 'border-slate-300 bg-white'
      }`}>
        <div className={`p-3 border-b flex gap-2 items-center ${
          darkMode ? 'border-white/5 bg-black/20 text-white' : 'border-slate-200 bg-slate-50 text-slate-800'
        }`}>
          <Gamepad2 size={16} className="text-[#7C3AED]" />
          <span className="font-display font-semibold text-xs tracking-wider uppercase">Live Room Chat</span>
        </div>

        {/* Messages box */}
        <div className="flex-grow p-4 overflow-y-auto space-y-3 text-xs">
          {chatMessages.length === 0 ? (
            <div className={`text-center py-12 ${darkMode ? 'text-white/35' : 'text-slate-400'}`}>Lobby chat active. Send a message to coordinate slot placements!</div>
          ) : (
            chatMessages.map((msg, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-[#06B6D4]">{msg.username}</span>
                  <span className={`text-[9px] ${darkMode ? 'text-white/30' : 'text-slate-400'}`}>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className={`p-2 rounded-lg border inline-block max-w-full break-words ${
                  darkMode ? 'bg-white/5 border-white/5 text-white/80' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  {msg.message}
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef}></div>
        </div>

        {/* Chat Input */}
        <div className={`p-3 border-t flex gap-2 ${
          darkMode ? 'border-white/5 bg-black/20' : 'border-slate-200 bg-slate-50'
        }`}>
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendRoomChatMessage()}
            className={`flex-grow border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#7C3AED] ${
              darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-slate-300 text-slate-800'
            }`}
            placeholder="Type match coordinates..."
          />
          <button
            onClick={sendRoomChatMessage}
            className="p-2 bg-[#7C3AED] rounded-lg hover:opacity-90 transition text-white"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};


export default MatchRoom;
