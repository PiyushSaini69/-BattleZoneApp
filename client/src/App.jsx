import React, { useState, useEffect, useRef, useContext } from 'react';
import { request, saveTokens, clearTokens, getAccessToken } from './services/api';
import { initiateSocketConnection, disconnectSocket, getSocket } from './services/socket';

// Import layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Import page views
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import MatchRoom from './pages/MatchRoom';
import Leaderboard from './pages/Leaderboard';
import Support from './pages/Support';
import Admin from './pages/Admin';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import RulesDocs from './pages/RulesDocs';
import HelpCenter from './pages/HelpCenter';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';


import { CheckCircle, XCircle } from 'lucide-react';
import { ThemeContext } from './context/ThemeContext';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

const App = () => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  const navigate = useNavigate();
  const location = useLocation();

  // Resolve active navbar item from path
  const getCurrentPageFromPath = () => {
    const path = location.pathname;
    if (path === '/') return 'landing';
    if (path === '/tournaments') return 'tournaments';
    if (path === '/leaderboard') return 'leaderboard';
    if (path === '/support') return 'support';
    if (path === '/admin') return 'admin';
    if (path === '/profile') return 'profile';
    if (path === '/wallet') return 'wallet';
    if (path === '/login') return 'login';
    if (path === '/register') return 'register';
    if (path === '/about') return 'about';
    if (path === '/careers') return 'careers';
    if (path === '/contact') return 'contact';
    if (path === '/rules') return 'rules';
    if (path === '/help') return 'help';
    if (path === '/privacy') return 'privacy';
    if (path === '/terms') return 'terms';
    if (path === '/cookies') return 'cookies';
    if (path.startsWith('/tournaments/')) {
      if (path.split('/')[2] === 'room') return 'match-room';
      return 'tournament-detail';
    }
    return 'landing';
  };


  const currentPage = getCurrentPageFromPath();

  const setCurrentPage = (page) => {
    if (page === 'landing') navigate('/');
    else if (page === 'tournament-detail') {
      if (selectedSlug) navigate(`/tournaments/${selectedSlug}`);
    } else if (page === 'match-room') {
      if (selectedTournament) navigate(`/tournaments/room/${selectedTournament._id}`);
    } else {
      navigate(`/${page}`);
    }
  };

  // Authentication & Session state
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [authError, setAuthError] = useState('');

  
  // Wallet & transaction state
  const [wallet, setWallet] = useState({ depositBalance: 0, winningBalance: 0, bonusBalance: 0, totalBalance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState('100');
  const [withdrawAmount, setWithdrawAmount] = useState('100');
  const [withdrawMethod, setWithdrawMethod] = useState('upi');
  const [withdrawUpi, setWithdrawUpi] = useState('');
  const [showPaymentSimulator, setShowPaymentSimulator] = useState(false);
  const [pendingSimulatedTx, setPendingSimulatedTx] = useState(null);
  
  // Tournaments state
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [participants, setParticipants] = useState([]);
  const [gameFilter, setGameFilter] = useState('');
  const [registerGameUID, setRegisterGameUID] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  
  // Match Room Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);
  
  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  
  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState([]);
  const [lbPeriod, setLbPeriod] = useState('alltime');
  const [lbMetric, setLbMetric] = useState('points');
  
  // Support state
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('payment');
  const [ticketReplyInput, setTicketReplyInput] = useState('');
  
  // Admin Panel state
  const [adminStats, setAdminStats] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminWithdrawals, setAdminWithdrawals] = useState([]);
  const [showCreateTournamentModal, setShowCreateTournamentModal] = useState(false);
  const [newTTitle, setNewTTitle] = useState('');
  const [newTGame, setNewTGame] = useState('bgmi');
  const [newTMode, setNewTMode] = useState('battle_royale');
  const [newTType, setNewTType] = useState('solo');
  const [newTFee, setNewTFee] = useState('20');
  const [newTPool, setNewTPool] = useState('1000');
  const [newTSlots, setNewTSlots] = useState('50');
  const [newTTime, setNewTTime] = useState('');
  
  // Announcement state
  const [announcements, setAnnouncements] = useState([]);
  
  // Toast notifications helper
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Initial boot: verify active session & load announcements
  useEffect(() => {
    const checkActiveSession = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          const res = await request('/user/profile');
          if (res.success) {
            setUser(res.data);
            initiateSocket(res.data.id);
            loadWalletData();
            loadNotifications();
          }
        } catch (err) {
          console.log('Session expired or invalid token');
          clearTokens();
        }
      }
      setLoadingUser(false);
    };

    checkActiveSession();
    loadAnnouncements();
    loadTournaments();
  }, []);

  // Listen to path transitions for dynamic data sync and PWA deep linking
  useEffect(() => {
    const syncRouteData = async () => {
      const path = location.pathname;
      if (path.startsWith('/tournaments/')) {
        const parts = path.split('/');
        if (parts[2] === 'room') {
          const tId = parts[3];
          if (tId && (!selectedTournament || selectedTournament._id !== tId)) {
            try {
              const res = await request('/tournaments');
              if (res.success) {
                const t = res.data.tournaments.find(x => x._id === tId);
                if (t) {
                  setSelectedTournament(t);
                  const roomRes = await request(`/tournaments/${tId}/room`);
                  if (roomRes.success) setRoomDetails(roomRes.data);
                  const socket = getSocket();
                  if (socket) {
                     socket.emit('join:room_chat', tId);
                     setChatMessages([]);
                  }
                }
              }
            } catch (e) {}
          }
        } else {
          const slug = parts[2];
          if (slug && slug !== 'room' && (!selectedTournament || selectedTournament.slug !== slug)) {
            try {
              const res = await request(`/tournaments/${slug}`);
              if (res.success) {
                setSelectedTournament(res.data.tournament);
                setSelectedSlug(slug);
                const partRes = await request(`/tournaments/${res.data.tournament._id}/participants`);
                if (partRes.success) setParticipants(partRes.data);
              }
            } catch (e) {}
          }
        }
      } else if (path === '/tournaments') {
        loadTournaments();
      } else if (path === '/leaderboard') {
        loadLeaderboard();
      } else if (path === '/support') {
        loadTickets();
      } else if (path === '/admin') {
        loadAdminDashboard();
      } else if (path === '/wallet') {
        loadWalletData();
      }
    };
    syncRouteData();
  }, [location.pathname]);


  // 2. Setup Socket connections
  const initiateSocket = (userId) => {
    const socket = initiateSocketConnection(userId);
    
    socket.on('tournament:slot_update', (data) => {
      setTournaments(prev => prev.map(t => {
        if (t._id === data.tournamentId) {
          return { ...t, filledSlots: data.filledSlots };
        }
        return t;
      }));
      
      setSelectedTournament(prev => {
        if (prev && prev._id === data.tournamentId) {
          return { ...prev, filledSlots: data.filledSlots };
        }
        return prev;
      });
    });

    socket.on('notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadNotifCount(c => c + 1);
      showToast(`🔔 ${notif.title}: ${notif.message}`);
    });

    socket.on('wallet:update', (data) => {
      setWallet(data);
    });

    // Real-time synchronization when a tournament completes
    socket.on('tournament:completed', (data) => {
      setTournaments(prev => prev.map(t => {
        if (t._id === data.tournamentId) return { ...t, status: 'completed' };
        return t;
      }));
      setSelectedTournament(prev => {
        if (prev && prev._id === data.tournamentId) return { ...prev, status: 'completed' };
        return prev;
      });
      showToast(`🏆 Tournament Completed: ${data.title}! Prize credits processed.`);
    });

    // Real-time synchronization when a tournament is cancelled
    socket.on('tournament:cancelled', (data) => {
      setTournaments(prev => prev.map(t => {
        if (t._id === data.tournamentId) return { ...t, status: 'cancelled' };
        return t;
      }));
      setSelectedTournament(prev => {
        if (prev && prev._id === data.tournamentId) return { ...prev, status: 'cancelled' };
        return prev;
      });
      showToast(`🚫 Tournament Cancelled: ${data.title}. Fees refunded.`);
    });

    // Real-time synchronization when room details are set by admin
    socket.on('tournament:room_update', (data) => {
      setTournaments(prev => prev.map(t => {
        if (t._id === data.tournamentId) return { ...t, status: 'live' };
        return t;
      }));
      setSelectedTournament(prev => {
        if (prev && prev._id === data.tournamentId) return { ...prev, status: 'live' };
        return prev;
      });
      showToast(`🔑 Match Room Details are now active for your tournament!`);
    });

    socket.on('room:message', (msg) => {
      setChatMessages(prev => [...prev, msg]);
    });
  };

  const loadAnnouncements = async () => {
    try {
      const res = await request('/admin/announcements');
      if (res.success) setAnnouncements(res.data);
    } catch (err) {
      setAnnouncements([
        { _id: '1', title: '🎁 Welcome BattleZone Warriors!', content: 'Sign up today and get ₹10 bonus cash instantly! Register for premium solo tournaments today.', type: 'promo' },
        { _id: '2', title: '🛡️ Fair Play & Security Guidelines', content: 'Our state-of-the-art anti-cheat is active. Team-teaming or hacking results in permanent bans and wallet forfeit.', type: 'warning' }
      ]);
    }
  };

  const loadTournaments = async (game = '') => {
    try {
      const res = await request(`/tournaments?game=${game}`);
      if (res.success) {
        setTournaments(res.data.tournaments);
      }
    } catch (err) {
      showToast('Error fetching tournaments catalog', 'error');
    }
  };

  const loadWalletData = async () => {
    try {
      const res = await request('/wallet');
      if (res.success) setWallet(res.data);
      
      const txRes = await request('/wallet/transactions');
      if (txRes.success) setTransactions(txRes.data.transactions);
    } catch (err) {}
  };

  const loadNotifications = async () => {
    try {
      const res = await request('/notifications');
      if (res.success) {
        setNotifications(res.data.notifications);
        setUnreadNotifCount(res.data.notifications.filter(n => !n.isRead).length);
      }
    } catch (err) {}
  };

  const loadLeaderboard = async () => {
    try {
      const res = await request(`/leaderboard?period=${lbPeriod}&metric=${lbMetric}`);
      if (res.success) setLeaderboard(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    if (currentPage === 'leaderboard') loadLeaderboard();
  }, [lbPeriod, lbMetric, currentPage]);

  const loadTickets = async () => {
    try {
      const res = await request('/support/tickets');
      if (res.success) setTickets(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    if (currentPage === 'support') loadTickets();
  }, [currentPage]);

  // Auth Handling
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      
      if (res.success) {
        saveTokens(res.data.accessToken, res.data.refreshToken);
        setUser(res.data.user);
        initiateSocket(res.data.user.id);
        loadWalletData();
        loadNotifications();
        showToast(`Welcome back, ${res.data.user.username}!`);
        setCurrentPage('tournaments');
      }
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleGoogleLogin = async (payload) => {
    setAuthError('');
    try {
      const res = await request('/auth/google-login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      if (res.success) {
        saveTokens(res.data.accessToken, res.data.refreshToken);
        setUser(res.data.user);
        initiateSocket(res.data.user.id);
        loadWalletData();
        loadNotifications();
        showToast(res.data.isNewUser ? `Welcome to BattleZone, ${res.data.user.username}!` : `Welcome back, ${res.data.user.username}!`);
        setCurrentPage('tournaments');
      }
    } catch (err) {
      setAuthError(err.message);
      showToast(err.message, 'error');
    }
  };

  const handleForgotPassword = async (email) => {
    return await request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  };

  const handleResetPassword = async (email, otp, newPassword) => {
    return await request('/auth/reset-password-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword })
    });
  };

  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRef, setRegRef] = useState('');
  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: regUsername,
          email: regEmail,
          password: regPassword,
          phone: regPhone || undefined,
          referralCode: regRef || undefined
        })
      });

      if (res.success) {
        showToast('Registration successful! Please login.');
        setCurrentPage('login');
      }
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    clearTokens();
    disconnectSocket();
    setUser(null);
    showToast('Logged out successfully.');
    setCurrentPage('landing');
  };

  // Deposit handling
  const handleInitiateDeposit = async (e) => {
    e.preventDefault();
    try {
      const res = await request('/wallet/deposit', {
        method: 'POST',
        body: JSON.stringify({ amount: parseFloat(depositAmount) })
      });

      if (res.success) {
        setPendingSimulatedTx(res.data);
        setShowPaymentSimulator(true);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const completeSimulatedDeposit = async (status) => {
    setShowPaymentSimulator(false);
    if (status === 'fail') {
      showToast('Payment cancelled/failed in Razorpay gateway.', 'error');
      return;
    }

    try {
      const res = await request('/wallet/deposit/verify', {
        method: 'POST',
        body: JSON.stringify({
          razorpay_order_id: pendingSimulatedTx.orderId,
          razorpay_payment_id: `pay_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          razorpay_signature: 'mock_signature'
        })
      });

      if (res.success) {
        showToast(`₹${pendingSimulatedTx.amount} credited successfully!`);
        loadWalletData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Withdrawals handling
  const handleWithdrawal = async (e) => {
    e.preventDefault();
    try {
      const res = await request('/wallet/withdraw', {
        method: 'POST',
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          method: withdrawMethod,
          upiId: withdrawMethod === 'upi' ? withdrawUpi : undefined
        })
      });

      if (res.success) {
        showToast(res.message);
        loadWalletData();
        setWithdrawUpi('');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Tournament operations
  const viewTournamentDetail = async (slug) => {
    try {
      const res = await request(`/tournaments/${slug}`);
      if (res.success) {
        setSelectedTournament(res.data.tournament);
        setSelectedSlug(slug);
        setCurrentPage('tournament-detail');
        const partRes = await request(`/tournaments/${res.data.tournament._id}/participants`);
        if (partRes.success) setParticipants(partRes.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRegisterTournament = async () => {
    if (!registerGameUID) {
      showToast('Your Gaming UID is required!', 'error');
      return;
    }

    try {
      const res = await request(`/tournaments/${selectedTournament._id}/register`, {
        method: 'POST',
        body: JSON.stringify({ gameUID: registerGameUID })
      });

      if (res.success) {
        showToast(`Slot assigned successfully! Slot #${res.data.slotNumber}`);
        setShowRegisterModal(false);
        setRegisterGameUID('');
        viewTournamentDetail(selectedSlug);
        loadWalletData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const enterMatchRoom = async (tournament) => {
    try {
      const res = await request(`/tournaments/${tournament._id}/room`);
      if (res.success) {
        setRoomDetails(res.data);
        setSelectedTournament(tournament);
        setCurrentPage('match-room');
        
        const socket = getSocket();
        if (socket) {
          socket.emit('join:room_chat', tournament._id);
          setChatMessages([]);
        }
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const sendRoomChatMessage = () => {
    if (!chatInput.trim()) return;
    const socket = getSocket();
    if (socket) {
      socket.emit('send:message', {
        tournamentId: selectedTournament._id,
        username: user.username,
        message: chatInput.trim(),
        avatar: user.avatar
      });
      setChatInput('');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Support Ticket handling
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await request('/support/tickets', {
        method: 'POST',
        body: JSON.stringify({
          subject: newTicketSubject,
          category: newTicketCategory,
          message: newTicketMessage
        })
      });

      if (res.success) {
        showToast('Support ticket raised successfully!');
        setNewTicketSubject('');
        setNewTicketMessage('');
        loadTickets();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleReplyTicket = async (e) => {
    e.preventDefault();
    if (!ticketReplyInput.trim()) return;

    try {
      const res = await request(`/support/tickets/${selectedTicket._id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ message: ticketReplyInput })
      });

      if (res.success) {
        setTicketReplyInput('');
        const detRes = await request(`/support/tickets/${selectedTicket._id}`);
        if (detRes.success) setSelectedTicket(detRes.data);
        loadTickets();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const viewTicketDetails = async (ticket) => {
    try {
      const res = await request(`/support/tickets/${ticket._id}`);
      if (res.success) {
        setSelectedTicket(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Admin Dashboard stats
  const loadAdminDashboard = async () => {
    try {
      const res = await request('/admin/dashboard');
      if (res.success) setAdminStats(res.data);

      const usersRes = await request('/admin/users');
      if (usersRes.success) setAdminUsers(usersRes.data.users);

      const wdRes = await request('/admin/withdrawals');
      if (wdRes.success) setAdminWithdrawals(wdRes.data.withdrawals);
    } catch (err) {
      showToast('Failed to load administrative panels. Insufficient permissions.', 'error');
    }
  };

  useEffect(() => {
    if (currentPage === 'admin') loadAdminDashboard();
  }, [currentPage]);

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    try {
      const res = await request('/admin/tournaments', {
        method: 'POST',
        body: JSON.stringify({
          title: newTTitle,
          game: newTGame,
          gameMode: newTMode,
          tournamentType: newTType,
          entryFee: parseFloat(newTFee),
          prizePool: parseFloat(newTPool),
          totalSlots: parseInt(newTSlots),
          scheduledAt: new Date(newTTime)
        })
      });

      if (res.success) {
        showToast('Tournament catalog successfully created!');
        setShowCreateTournamentModal(false);
        loadTournaments();
        loadAdminDashboard();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCancelTournament = async (tId) => {
    if (!confirm('Are you sure you want to cancel this tournament? This will auto-refund entry fees to all players!')) return;
    try {
      const res = await request(`/admin/tournaments/${tId}/cancel`, { method: 'PATCH' });
      if (res.success) {
        showToast('Tournament cancelled successfully. Auto-refunds credited.');
        loadTournaments();
        loadAdminDashboard();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleApproveWithdrawal = async (wId) => {
    try {
      const res = await request(`/admin/withdrawals/${wId}/approve`, {
        method: 'PATCH',
        body: JSON.stringify({ transferReference: `REF-${Math.floor(Math.random()*9000000)}` })
      });
      if (res.success) {
        showToast('Withdrawal marked as transferred.');
        loadAdminDashboard();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRejectWithdrawal = async (wId) => {
    const reason = prompt('Please enter a rejection reason:');
    if (!reason) return;
    try {
      const res = await request(`/admin/withdrawals/${wId}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason })
      });
      if (res.success) {
        showToast('Withdrawal rejected. locked funds refunded to player.');
        loadAdminDashboard();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const triggerMockResults = async (tournament) => {
    try {
      const usersList = await request('/admin/users');
      const resultsArray = usersList.data.users.slice(0, 3).map((u, index) => ({
        userId: u._id,
        kills: Math.floor(Math.random() * 8),
        rank: index + 1,
        points: (3 - index) * 10
      }));

      const res = await request(`/admin/tournaments/${tournament._id}/results`, {
        method: 'POST',
        body: JSON.stringify({ playerResults: resultsArray })
      });

      if (res.success) {
        showToast('Dynamic results uploaded. Prize credits processed.');
        loadTournaments();
        loadAdminDashboard();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const markAllNotifsRead = async () => {
    try {
      await request('/notifications/mark-all-read', { method: 'PATCH' });
      setUnreadNotifCount(0);
      loadNotifications();
    } catch (err) {}
  };

  return (
    <div className={`min-h-screen flex flex-col font-body transition-colors duration-500 ${
      darkMode ? 'bg-[#0B0F1A] text-white' : 'bg-[#F8FAFC] text-slate-800'
    }`}>

      {/* Toast Alert Popups */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-neon-purple border glass-panel transition-all duration-300 flex items-center gap-2 ${
          toast.type === 'error' ? 'border-red-500/50 text-red-400' : 'border-[#7C3AED]/50 text-purple-300'
        }`}>
          {toast.type === 'error' ? <XCircle size={18} /> : <CheckCircle size={18} />}
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Navigation Header layout */}
      <Navbar
        user={user}
        wallet={wallet}
        unreadNotifCount={unreadNotifCount}
        showNotifPanel={showNotifPanel}
        setShowNotifPanel={setShowNotifPanel}
        notifications={notifications}
        markAllNotifsRead={markAllNotifsRead}
        handleLogout={handleLogout}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />

      {/* Pages render routes */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 py-8">
        <Routes>
          <Route path="/" element={<Landing announcements={announcements} setCurrentPage={setCurrentPage} />} />
          
          <Route path="/login" element={user ? <Navigate to="/tournaments" replace /> : <Login
            loginEmail={loginEmail}
            setLoginEmail={setLoginEmail}
            loginPassword={loginPassword}
            setLoginPassword={setLoginPassword}
            handleLogin={handleLogin}
            authError={authError}
            setCurrentPage={setCurrentPage}
            handleGoogleLogin={handleGoogleLogin}
            handleForgotPassword={handleForgotPassword}
            handleResetPassword={handleResetPassword}
          />} />

          <Route path="/register" element={user ? <Navigate to="/tournaments" replace /> : <Register
            regUsername={regUsername}
            setRegUsername={setRegUsername}
            regEmail={regEmail}
            setRegEmail={setRegEmail}
            regPhone={regPhone}
            setRegPhone={setRegPhone}
            regPassword={regPassword}
            setRegPassword={setRegPassword}
            regRef={regRef}
            setRegRef={setRegRef}
            handleRegister={handleRegister}
            authError={authError}
            setCurrentPage={setCurrentPage}
          />} />


          <Route path="/profile" element={user ? <Profile
            user={user}
            setUser={setUser}
            showToast={showToast}
          /> : <Navigate to="/login" replace />} />

          <Route path="/wallet" element={user ? <Wallet
            wallet={wallet}
            transactions={transactions}
            depositAmount={depositAmount}
            setDepositAmount={setDepositAmount}
            withdrawAmount={withdrawAmount}
            setWithdrawAmount={setWithdrawAmount}
            withdrawMethod={withdrawMethod}
            setWithdrawMethod={setWithdrawMethod}
            withdrawUpi={withdrawUpi}
            setWithdrawUpi={setWithdrawUpi}
            handleInitiateDeposit={handleInitiateDeposit}
            handleWithdrawal={handleWithdrawal}
            showPaymentSimulator={showPaymentSimulator}
            setShowPaymentSimulator={setShowPaymentSimulator}
            pendingSimulatedTx={pendingSimulatedTx}
            completeSimulatedDeposit={completeSimulatedDeposit}
          /> : <Navigate to="/login" replace />} />

          <Route path="/tournaments" element={<Tournaments
            tournaments={tournaments}
            gameFilter={gameFilter}
            setGameFilter={setGameFilter}
            loadTournaments={loadTournaments}
            viewTournamentDetail={viewTournamentDetail}
          />} />

          <Route path="/tournaments/:slug" element={selectedTournament ? <TournamentDetail
            selectedTournament={selectedTournament}
            participants={participants}
            user={user}
            enterMatchRoom={enterMatchRoom}
            showRegisterModal={showRegisterModal}
            setShowRegisterModal={setShowRegisterModal}
            registerGameUID={registerGameUID}
            setRegisterGameUID={setRegisterGameUID}
            handleRegisterTournament={handleRegisterTournament}
            setCurrentPage={setCurrentPage}
          /> : <div className="text-center py-12">Loading Tournament Hub...</div>} />

          <Route path="/tournaments/room/:id" element={user ? (selectedTournament && roomDetails ? <MatchRoom
            selectedTournament={selectedTournament}
            roomDetails={roomDetails}
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            sendRoomChatMessage={sendRoomChatMessage}
            chatEndRef={chatEndRef}
            user={user}
          /> : <div className="text-center py-12">Synchronizing Chat Lobby...</div>) : <Navigate to="/login" replace />} />

          <Route path="/leaderboard" element={<Leaderboard
            leaderboard={leaderboard}
            lbPeriod={lbPeriod}
            setLbPeriod={setLbPeriod}
            lbMetric={lbMetric}
            setLbMetric={setLbMetric}
          />} />

          <Route path="/support" element={user ? <Support
            tickets={tickets}
            selectedTicket={selectedTicket}
            setSelectedTicket={setSelectedTicket}
            newTicketSubject={newTicketSubject}
            setNewTicketSubject={setNewTicketSubject}
            newTicketMessage={newTicketMessage}
            setNewTicketMessage={setNewTicketMessage}
            newTicketCategory={newTicketCategory}
            setNewTicketCategory={setNewTicketCategory}
            ticketReplyInput={ticketReplyInput}
            setTicketReplyInput={setTicketReplyInput}
            handleCreateTicket={handleCreateTicket}
            handleReplyTicket={handleReplyTicket}
            viewTicketDetails={viewTicketDetails}
          /> : <Navigate to="/login" replace />} />

          <Route path="/admin" element={(user && ['admin', 'superadmin', 'moderator'].includes(user.role)) ? <Admin
            adminStats={adminStats}
            tournaments={tournaments}
            adminWithdrawals={adminWithdrawals}
            showCreateTournamentModal={showCreateTournamentModal}
            setShowCreateTournamentModal={setShowCreateTournamentModal}
            newTTitle={newTTitle}
            setNewTTitle={setNewTTitle}
            newTGame={newTGame}
            setNewTGame={setNewTGame}
            newTMode={newTMode}
            setNewTMode={setNewTMode}
            newTType={newTType}
            setNewTType={setNewTType}
            newTFee={newTFee}
            setNewTFee={setNewTFee}
            newTPool={newTPool}
            setNewTPool={setNewTPool}
            newTSlots={newTSlots}
            setNewTSlots={setNewTSlots}
            newTTime={newTTime}
            setNewTTime={setNewTTime}
            handleCreateTournament={handleCreateTournament}
            handleCancelTournament={handleCancelTournament}
            handleApproveWithdrawal={handleApproveWithdrawal}
            handleRejectWithdrawal={handleRejectWithdrawal}
            triggerMockResults={triggerMockResults}
            loadAdminDashboard={loadAdminDashboard}
            showToast={showToast}
          /> : <Navigate to="/" replace />} />

          <Route path="/about" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rules" element={<RulesDocs />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>


      {/* Footer layout */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default App;
