import React, { useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import {
  Wallet as WalletIcon,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Plus,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const Wallet = ({
  wallet,
  transactions,
  depositAmount,
  setDepositAmount,
  withdrawAmount,
  setWithdrawAmount,
  withdrawMethod,
  setWithdrawMethod,
  withdrawUpi,
  setWithdrawUpi,
  handleInitiateDeposit,
  handleWithdrawal,
  showPaymentSimulator,
  setShowPaymentSimulator,
  pendingSimulatedTx,
  completeSimulatedDeposit
}) => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="grid md:grid-cols-3 gap-6">
      
      {/* Payment Simulator modal */}
      {showPaymentSimulator && pendingSimulatedTx && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className={`w-full max-w-md border rounded-2xl overflow-hidden shadow-neon-purple ${
            darkMode ? 'border-[#7C3AED]/40 bg-[#111827]' : 'border-[#7C3AED]/50 bg-white'
          }`}>
            <div className={`p-4 border-b flex justify-between items-center ${
              darkMode ? 'bg-[#7C3AED]/20 border-[#7C3AED]/20' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-[#06B6D4]" />
                <span className={`font-display font-semibold tracking-wider ${darkMode ? 'text-white' : 'text-slate-800'}`}>RAZORPAY SIMULATOR</span>
              </div>
              <span className={`text-xs ${darkMode ? 'text-white/50' : 'text-slate-400'}`}>TEST MODE</span>
            </div>
            
            <div className="p-6 text-center space-y-4">
              <span className={`text-sm ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>Depositing funds to BattleZone Wallet</span>
              <div className="text-3xl font-display font-black text-[#06B6D4]">₹{pendingSimulatedTx.amount}</div>
              <span className={`text-xs font-mono block ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>Order ID: {pendingSimulatedTx.orderId}</span>
              
              <div className={`border rounded-xl p-4 text-xs text-left space-y-1 ${
                darkMode ? 'bg-black/30 border-white/5 text-white/60' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <span className={`font-semibold block ${darkMode ? 'text-white' : 'text-slate-800'}`}>Simulator Controls:</span>
                <span>Select payment resolution scenario below to test callback triggers and notifications updates.</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => completeSimulatedDeposit('success')}
                  className="bg-[#10B981] text-white py-3 rounded-lg font-display text-xs font-bold uppercase hover:bg-emerald-600 transition"
                >
                  🟢 Success
                </button>
                <button
                  onClick={() => completeSimulatedDeposit('fail')}
                  className="bg-[#EF4444] text-white py-3 rounded-lg font-display text-xs font-bold uppercase hover:bg-rose-600 transition"
                >
                  🔴 Fail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet balances view */}
      <div className="space-y-6">
        <GlassCard glowColor="purple">
          <h3 className={`font-display font-bold text-sm uppercase border-b pb-3 mb-4 ${
            darkMode ? 'text-white/70 border-white/5' : 'text-slate-700 border-slate-200'
          }`}>WALLET LEDGER BALANCES</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className={darkMode ? 'text-white/40' : 'text-slate-500'}>Real Money Deposited</span>
              <span className={`font-display font-extrabold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>₹{wallet.depositBalance}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className={darkMode ? 'text-white/40' : 'text-slate-500'}>Tournament Winnings</span>
              <span className="font-display font-extrabold text-sm text-[#06B6D4]">₹{wallet.winningBalance}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className={darkMode ? 'text-white/40' : 'text-slate-500'}>Referrals Bonus Balance</span>
              <span className="font-display font-extrabold text-sm text-[#7C3AED]">₹{wallet.bonusBalance}</span>
            </div>
            
            <div className={`border-t pt-4 flex justify-between items-center ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
              <span className={`font-display font-black text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>TOTAL COINS VALUE</span>
              <span className="font-display font-black text-xl text-[#06B6D4]">₹{wallet.totalBalance}</span>
            </div>
          </div>
        </GlassCard>

        {/* Raising Withdrawals Form */}
        <GlassCard glowColor="orange">
          <h3 className={`font-display font-bold text-sm uppercase border-b pb-3 mb-4 ${
            darkMode ? 'text-white/70 border-white/5' : 'text-slate-700 border-slate-200'
          }`}>RAISE payout request</h3>
          
          <form onSubmit={handleWithdrawal} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className={`uppercase block ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>Amount (Min ₹100)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
                required
                min="100"
                className={`w-full border rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F97316] ${
                  darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                placeholder="Amount to withdraw"
              />
            </div>

            <div className="space-y-1">
              <label className={`uppercase block ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>UPI Identifier ID</label>
              <input
                type="text"
                value={withdrawUpi}
                onChange={e => setWithdrawUpi(e.target.value)}
                required
                className={`w-full border rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F97316] ${
                  darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                placeholder="e.g. gamer@ybl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#F97316] text-black rounded-lg font-display font-black uppercase text-xs tracking-wider shadow-neon-orange mt-2 hover:opacity-90 transition"
            >
              PLACE payout REQUEST
            </button>
          </form>
        </GlassCard>
      </div>

      {/* Deposits and transactions history */}
      <div className="md:col-span-2 space-y-6">
        <GlassCard>
          <h3 className={`font-display font-bold text-sm uppercase border-b pb-3 mb-4 ${
            darkMode ? 'text-white/80 border-white/5' : 'text-slate-700 border-slate-200'
          }`}>DEPOSIT CASH COINS</h3>
          
          <form onSubmit={handleInitiateDeposit} className="flex gap-4">
            <div className="relative flex-grow">
              <span className={`absolute left-3 top-2.5 text-sm font-semibold font-display ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>₹</span>
              <input
                type="number"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                required
                min="50"
                max="50000"
                className={`w-full border rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED] font-semibold ${
                  darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                placeholder="100"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:opacity-90 transition font-display font-bold text-xs uppercase tracking-wide flex items-center gap-1"
            >
              <Plus size={16} /> ADD CASH
            </button>
          </form>
        </GlassCard>

        {/* Transactions list ledger */}
        <GlassCard>
          <h3 className={`font-display font-bold text-sm uppercase border-b pb-3 mb-4 ${
            darkMode ? 'text-white/80 border-white/5' : 'text-slate-700 border-slate-200'
          }`}>TRANSACTIONS HISTORY LEDGER</h3>
          
          {transactions.length === 0 ? (
            <div className={`p-6 text-center text-xs ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>No transactions recorded yet. Fill deposit to activate!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className={`border-b uppercase ${darkMode ? 'border-white/10 text-white/40' : 'border-slate-200 text-slate-500'}`}>
                    <th className="py-2">Type</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Details</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx._id} className={`border-b ${darkMode ? 'border-white/5 hover:bg-white/3' : 'border-slate-100 hover:bg-slate-50'}`}>
                      <td className={`py-3 flex items-center gap-1.5 font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        {tx.type === 'deposit' || tx.type === 'prize_credit' || tx.type === 'bonus' || tx.type === 'referral_bonus' ? (
                          <ArrowDownLeft size={14} className="text-[#10B981]" />
                        ) : (
                          <ArrowUpRight size={14} className="text-[#EF4444]" />
                        )}
                        <span className="capitalize">{tx.type.replace('_', ' ')}</span>
                      </td>
                      <td className={`py-3 font-display font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>₹{tx.amount}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.status === 'completed' ? 'bg-[#10B981]/20 text-[#10B981]' : tx.status === 'failed' ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className={`py-3 max-w-[200px] truncate ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>{tx.description}</td>
                      <td className={`py-3 ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};


export default Wallet;
