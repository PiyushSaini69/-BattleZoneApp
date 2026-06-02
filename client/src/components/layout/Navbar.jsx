import React, { useState, useContext } from 'react';
import { Gamepad2, Wallet as WalletIcon, Bell, User as UserIcon, LogOut, ShieldCheck, Menu, X, Sparkles } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

const Navbar = ({
  user,
  wallet,
  unreadNotifCount,
  showNotifPanel,
  setShowNotifPanel,
  notifications,
  markAllNotifsRead,
  handleLogout,
  setCurrentPage,
  currentPage
}) => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Group paths under conceptual parents for high-end active highlighting
  const isTournamentTabActive = ['tournaments', 'tournament-detail', 'match-room'].includes(currentPage);
  const isProfileTabActive = currentPage === 'profile';

  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-colors duration-500 ${
      darkMode 
        ? 'bg-[#0B0F1A] border-white/5 text-slate-400' 
        : 'bg-white border-slate-200 text-slate-700'
    }`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo with high-end hex gradient compatibility */}
        <div
          onClick={() => setCurrentPage('landing')}
          className="flex items-center gap-1.5 sm:gap-2 cursor-pointer font-display font-extrabold text-base sm:text-xl tracking-wider select-none bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent hover:scale-102 transition"
        >
          <Gamepad2 className="text-[#7C3AED]" size={18} />
          BATTLEZONE
        </div>

        {/* Navigation Links */}
        <nav className={`hidden md:flex gap-6 items-center text-sm font-semibold tracking-wider uppercase ${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          <span
            onClick={() => setCurrentPage('tournaments')}
            className={`cursor-pointer hover:text-[#06B6D4] transition py-1 ${
              isTournamentTabActive ? 'text-[#06B6D4] border-b-2 border-[#06B6D4]' : ''
            }`}
          >
            Tournaments
          </span>
          <span
            onClick={() => setCurrentPage('leaderboard')}
            className={`cursor-pointer hover:text-[#06B6D4] transition py-1 ${
              currentPage === 'leaderboard' ? 'text-[#06B6D4] border-b-2 border-[#06B6D4]' : ''
            }`}
          >
            Leaderboard
          </span>
          <span
            onClick={() => setCurrentPage('support')}
            className={`cursor-pointer hover:text-[#06B6D4] transition py-1 ${
              currentPage === 'support' ? 'text-[#06B6D4] border-b-2 border-[#06B6D4]' : ''
            }`}
          >
            Support
          </span>
          {user && (user.role === 'admin' || user.role === 'superadmin' || user.role === 'moderator') && (
            <span
              onClick={() => setCurrentPage('admin')}
              className={`cursor-pointer text-[#F97316] hover:text-orange-400 flex items-center gap-1 transition py-1 ${
                currentPage === 'admin' ? 'border-b-2 border-[#F97316]' : ''
              }`}
            >
              <ShieldCheck size={16} /> Admin
            </span>
          )}
        </nav>

        {/* Profile Actions */}
        <div className="flex gap-2 sm:gap-4 items-center">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {user ? (
            <>
              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifPanel(!showNotifPanel);
                    if (!showNotifPanel) markAllNotifsRead();
                  }}
                  className={`p-2 border rounded-lg transition ${
                    darkMode ? 'border-white/5 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <Bell size={18} className={darkMode ? 'text-slate-300' : 'text-slate-600'} />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold text-white">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {showNotifPanel && (
                  <div className={`absolute right-0 mt-2 w-80 border rounded-xl overflow-hidden shadow-2xl z-50 ${
                    darkMode ? 'border-white/10 bg-[#111827]' : 'border-slate-200 bg-white'
                  }`}>
                    <div className={`p-3 border-b flex justify-between items-center ${
                      darkMode ? 'border-white/5 bg-black/20 text-white' : 'border-slate-100 bg-slate-50 text-slate-800'
                    }`}>
                      <span className="font-display font-semibold text-xs">NOTIFICATIONS</span>
                      <span onClick={() => setShowNotifPanel(false)} className="text-[10px] text-slate-400 cursor-pointer hover:text-slate-600">CLOSE</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">No notifications yet.</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n._id} className={`p-3 border-b transition ${
                            darkMode ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'
                          }`}>
                            <span className="font-semibold text-xs block text-[#06B6D4]">{n.title}</span>
                            <span className={`text-[11px] block mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{n.message}</span>
                            <span className="text-[9px] text-slate-400 block mt-1">{new Date(n.createdAt).toLocaleDateString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Wallet Balance Widget */}
              <div
                onClick={() => setCurrentPage('wallet')}
                className={`hidden sm:flex items-center gap-2 cursor-pointer border px-3 py-1.5 rounded-lg transition ${
                  currentPage === 'wallet'
                    ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-[#06B6D4]'
                    : darkMode ? 'border-[#7C3AED]/20 bg-[#7C3AED]/5 hover:bg-[#7C3AED]/10' : 'border-[#7C3AED]/35 bg-[#7C3AED]/5 hover:bg-[#7C3AED]/10'
                }`}
              >
                <WalletIcon size={16} className="text-[#06B6D4]" />
                <span className="font-display font-bold text-sm text-[#06B6D4]">₹{wallet.totalBalance}</span>
              </div>

              {/* Profile Avatar Click (Added high-end active highlighting & dynamic display name support) */}
              <div
                onClick={() => setCurrentPage('profile')}
                className={`flex items-center gap-1.5 sm:gap-2 cursor-pointer border px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg transition ${
                  isProfileTabActive
                    ? 'border-[#06B6D4] bg-[#06B6D4]/15 text-[#06B6D4] shadow-neon-cyan'
                    : darkMode ? 'border-white/5 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center overflow-hidden border ${
                  isProfileTabActive ? 'border-[#06B6D4]' : 'border-[#7C3AED]/25 bg-[#7C3AED]/10'
                }`}>
                  {user.avatar ? <img src={user.avatar} referrerPolicy="no-referrer" className="object-cover w-full h-full" alt="avatar" /> : <UserIcon size={16} />}
                </div>
                <span className={`hidden sm:inline text-sm font-semibold tracking-wider ${
                  isProfileTabActive
                    ? 'text-[#06B6D4] font-bold'
                    : darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {user.displayName || user.username}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`hidden sm:block p-2 border rounded-lg transition ${
                  darkMode ? 'border-white/5 bg-white/5 hover:bg-red-500/20' : 'border-slate-200 bg-slate-50 hover:bg-red-500/10 hover:text-red-500'
                }`}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => setCurrentPage('login')}
                className={`px-4 py-2 border rounded-lg text-sm font-semibold transition ${
                  darkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setCurrentPage('register')}
                className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded-lg hover:opacity-90 text-sm font-semibold text-white shadow-neon-purple transition"
              >
                Join Platform
              </button>
            </div>
          )}

          {/* Hamburger Toggle Button (mobile only) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 md:hidden border rounded-lg transition ${
              darkMode 
                ? 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-300' 
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-b px-4 py-4 space-y-3 transition-colors duration-300 ${
          darkMode ? 'bg-[#0B0F1A] border-white/5' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col gap-2 font-display font-bold uppercase text-xs tracking-wider">
            {/* Added dynamic active page tracking for mobile items too */}
            <span
              onClick={() => {
                setCurrentPage('tournaments');
                setIsMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-lg cursor-pointer hover:bg-brand-cyan/10 hover:text-[#06B6D4] transition ${
                isTournamentTabActive ? 'text-[#06B6D4] bg-[#06B6D4]/5' : darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Tournaments
            </span>
            <span
              onClick={() => {
                setCurrentPage('leaderboard');
                setIsMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-lg cursor-pointer hover:bg-brand-cyan/10 hover:text-[#06B6D4] transition ${
                currentPage === 'leaderboard' ? 'text-[#06B6D4] bg-[#06B6D4]/5' : darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Leaderboard
            </span>
            <span
              onClick={() => {
                setCurrentPage('support');
                setIsMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-lg cursor-pointer hover:bg-brand-cyan/10 hover:text-[#06B6D4] transition ${
                currentPage === 'support' ? 'text-[#06B6D4] bg-[#06B6D4]/5' : darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Support
            </span>

            {/* Added: Custom 'My Profile' mobile navigation dropdown link */}
            {user && (
              <span
                onClick={() => {
                  setCurrentPage('profile');
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg cursor-pointer hover:bg-brand-cyan/10 hover:text-[#06B6D4] transition flex items-center gap-2.5 ${
                  isProfileTabActive ? 'text-[#06B6D4] bg-[#06B6D4]/5' : darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-[#7C3AED]/30 flex items-center justify-center overflow-hidden border border-[#7C3AED]/30">
                  {user.avatar ? <img src={user.avatar} referrerPolicy="no-referrer" className="object-cover w-full h-full" alt="avatar" /> : <UserIcon size={12} />}
                </div>
                <span className="flex items-center gap-1">
                  My Profile 
                  <Sparkles size={11} className="text-[#06B6D4]" />
                </span>
              </span>
            )}

            {user && (user.role === 'admin' || user.role === 'superadmin' || user.role === 'moderator') && (
              <span
                onClick={() => {
                  setCurrentPage('admin');
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg cursor-pointer hover:bg-brand-orange/10 hover:text-[#F97316] transition flex items-center gap-1.5 ${
                  currentPage === 'admin' ? 'text-[#F97316] bg-[#F97316]/5' : darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                <ShieldCheck size={14} /> Admin Panel
              </span>
            )}

            {user && (
              <div
                onClick={() => {
                  setCurrentPage('wallet');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex sm:hidden items-center justify-between px-3 py-2.5 rounded-lg border cursor-pointer ${
                  currentPage === 'wallet'
                    ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-[#06B6D4]'
                    : darkMode ? 'border-[#7C3AED]/20 bg-[#7C3AED]/5 hover:bg-[#7C3AED]/10' : 'border-[#7C3AED]/35 bg-[#7C3AED]/5 hover:bg-[#7C3AED]/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <WalletIcon size={14} className="text-[#06B6D4]" />
                  <span className="text-[10px] text-slate-400">WALLET BALANCE</span>
                </div>
                <span className="font-display font-black text-sm text-[#06B6D4]">₹{wallet.totalBalance}</span>
              </div>
            )}

            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 mt-2 px-3 py-2.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition font-display font-bold uppercase text-xs tracking-wider"
              >
                <LogOut size={14} /> Log Out
              </button>
            )}

            {!user && (
              <div className="flex flex-col gap-2 pt-3 border-t border-dashed dark:border-white/5 border-slate-200">
                <span className={`text-[10px] uppercase font-bold tracking-wider block ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Account Actions
                </span>
                <button
                  onClick={() => {
                    setCurrentPage('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-2.5 border rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                    darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Login to Account
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('register');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-neon-purple transition text-center"
                >
                  Join Platform
                </button>
              </div>
            )}

            {/* Mode Toggling */}
            <div className="pt-3 border-t border-dashed dark:border-white/5 border-slate-200">
              <span className={`text-[10px] uppercase font-bold tracking-wider block mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Appearance Theme
              </span>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Select Visual Mode:
                </span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
