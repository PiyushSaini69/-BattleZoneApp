import React, { useState, useEffect, useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { XCircle, KeyRound, Mail, ShieldCheck, ArrowRight, Sparkles, Gamepad2, Chrome } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const MOCK_GAMERS = [
  {
    id: "g1",
    googleId: "1122334455",
    name: "Ninja (Tyler Blevins)",
    email: "ninja@battlezone.gg",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=ninja",
    title: "Fortnite Esports Legend",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "g2",
    googleId: "2233445566",
    name: "Shroud (Michael Grzesiek)",
    email: "shroud@battlezone.gg",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=shroud",
    title: "FPS Aim God & Valorant Pro",
    color: "from-slate-700 to-slate-900"
  },
  {
    id: "g3",
    googleId: "3344556677",
    name: "Valkyrae (Rachell)",
    email: "valkyrae@battlezone.gg",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=valkyrae",
    title: "Esports Queen & Co-Owner",
    color: "from-rose-500 to-pink-600"
  },
  {
    id: "g4",
    googleId: "4455667788",
    name: "S1mple (Oleksandr)",
    email: "s1mple@battlezone.gg",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=s1mple",
    title: "CS:GO GOAT & MVP Champion",
    color: "from-amber-500 to-orange-600"
  }
];

const Login = ({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  handleLogin,
  authError,
  setCurrentPage,
  handleGoogleLogin,
  handleForgotPassword,
  handleResetPassword
}) => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  // Forgot password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [devOtp, setDevOtp] = useState(''); // Dev helper auto-otp
  const [forgotLoading, setForgotLoading] = useState(false);

  // Google OAuth states
  const [showGamerChooser, setShowGamerChooser] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  // Google GSI Client Sign-In integration
  useEffect(() => {
    if (clientId) {
      const loadGsiScript = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              if (handleGoogleLogin) {
                handleGoogleLogin({ credential: response.credential });
              }
            }
          });
          window.google.accounts.id.renderButton(
            document.getElementById("googleGsiButton"),
            { 
              theme: darkMode ? "dark" : "outline", 
              size: "large", 
              width: "100%",
              text: "signin_with",
              shape: "rectangular"
            }
          );
        }
      };

      if (!document.getElementById("google-gsi-client")) {
        const script = document.createElement('script');
        script.id = "google-gsi-client";
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = loadGsiScript;
        document.body.appendChild(script);
      } else {
        loadGsiScript();
      }
    }
  }, [clientId, darkMode]);

  // Handle Google Login Click
  const onGoogleBtnClick = () => {
    if (clientId) {
      // If client ID exists, GSI handles or we trigger official prompt
      if (window.google?.accounts?.id) {
        window.google.accounts.id.prompt();
      }
    } else {
      // Fallback: Open premium developer mock chooser modal!
      setShowGamerChooser(true);
    }
  };

  // Trigger Mock Google Auth
  const handleSelectMockGamer = async (gamer) => {
    setShowGamerChooser(false);
    if (handleGoogleLogin) {
      await handleGoogleLogin({
        credential: `mock_google_token_${gamer.googleId}_${gamer.email}_${gamer.name}`,
        profile: {
          googleId: gamer.googleId,
          email: gamer.email,
          name: gamer.name,
          avatar: gamer.avatar
        }
      });
    }
  };

  // Trigger Forgot Password API
  const onForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setDevOtp('');
    setForgotLoading(true);

    try {
      if (!forgotEmail) throw new Error('Email is required.');
      const res = await handleForgotPassword(forgotEmail);
      setForgotSuccess(res.message || 'OTP verification code sent successfully.');
      if (res.data?.otpValue) {
        setDevOtp(res.data.otpValue);
      }
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.message || 'Failed to trigger reset. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Trigger Reset Password API
  const onResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setForgotLoading(true);

    try {
      if (!forgotOtp) throw new Error('OTP is required.');
      if (forgotNewPassword !== forgotConfirmPassword) {
        throw new Error('New password and confirm password do not match.');
      }
      if (forgotNewPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      await handleResetPassword(forgotEmail, forgotOtp, forgotNewPassword);
      setForgotSuccess('Password reset successful! You can now log in.');
      setTimeout(() => {
        setShowForgotModal(false);
        // Autofill login email
        setLoginEmail(forgotEmail);
        setLoginPassword('');
        // Reset modal state
        setForgotStep(1);
        setForgotEmail('');
        setForgotOtp('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
        setForgotSuccess('');
      }, 2500);
    } catch (err) {
      setForgotError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <GlassCard glowColor="purple">
        <h2 className={`text-2xl font-display font-black text-center mb-6 tracking-wide ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          LOGIN ACCESS
        </h2>
        
        {authError && (
          <div className={`p-3 border rounded-lg text-xs mb-4 flex items-center gap-2 ${
            darkMode ? 'border-red-500/20 bg-red-500/5 text-red-400' : 'border-red-500/30 bg-red-500/10 text-red-600'
          }`}>
            <XCircle size={16} />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className={`text-xs font-semibold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>Email Address</label>
            <input
              type="email"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              required
              className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-[#7C3AED] transition ${
                darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className={`text-xs font-semibold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>Password</label>
              <span 
                onClick={() => {
                  setForgotStep(1);
                  setForgotError('');
                  setForgotSuccess('');
                  setShowForgotModal(true);
                }} 
                className="text-xs text-[#06B6D4] hover:underline cursor-pointer font-medium"
              >
                Forgot Password?
              </span>
            </div>
            <input
              type="password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              required
              className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-[#7C3AED] transition ${
                darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded-lg font-display font-black tracking-wider uppercase shadow-neon-purple mt-2 hover:opacity-90 transition text-white text-sm"
          >
            AUTHENTICATE
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className={`w-full border-t ${darkMode ? 'border-white/10' : 'border-slate-200'}`}></div>
          <span className={`absolute px-3 text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'bg-[#0B0F1A] text-white/40' : 'bg-[#F8FAFC] text-slate-400'}`}>
            OR SECURE CONNECT
          </span>
        </div>

        {/* Google Sign-In Button */}
        {clientId ? (
          <div id="googleGsiButton" className="w-full overflow-hidden rounded-lg"></div>
        ) : (
          <button
            type="button"
            onClick={onGoogleBtnClick}
            className={`w-full py-2.5 px-4 border rounded-lg flex items-center justify-center gap-2.5 font-semibold text-xs tracking-wider uppercase transition ${
              darkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white shadow-sm' 
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
            }`}
          >
            <Chrome size={16} className="text-red-500" />
            <span>Continue with Google</span>
          </button>
        )}

        <div className={`mt-6 text-center text-xs ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>
          Don't have an account? <span onClick={() => setCurrentPage('register')} className="text-[#06B6D4] cursor-pointer hover:underline">Create Account</span>
        </div>
      </GlassCard>

      {/* 🌟 MOCK GOOGLE GAMER CHOOSER MODAL */}
      {showGamerChooser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300">
          <div className={`relative max-w-lg w-full rounded-2xl border p-6 shadow-2xl glass-panel ${
            darkMode ? 'bg-[#0B0F1A]/95 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-800'
          }`}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-display font-black flex items-center gap-2 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]">
                <Gamepad2 className="text-[#06B6D4]" />
                DEVELOPER GOOGLE ACCOUNTS
              </h3>
              <button 
                onClick={() => setShowGamerChooser(false)}
                className={`text-xs px-2 py-1 rounded hover:bg-white/10 transition ${darkMode ? 'text-white/60' : 'text-slate-500'}`}
              >
                CLOSE
              </button>
            </div>
            
            <p className={`text-xs mb-6 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
              Google Client Credentials are not configured in `.env`. Choose one of these simulated esport stars to instantly test Google authentication & profile onboarding!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-1">
              {MOCK_GAMERS.map((gamer) => (
                <div 
                  key={gamer.id}
                  onClick={() => handleSelectMockGamer(gamer)}
                  className={`group relative rounded-xl border p-4 cursor-pointer overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex flex-col gap-3 ${
                    darkMode 
                      ? 'bg-white/5 border-white/10 hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/5' 
                      : 'bg-slate-50 border-slate-200 hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/5'
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gamer.color} opacity-5 blur-xl group-hover:opacity-20 transition-opacity`}></div>
                  <div className="flex items-center gap-3">
                    <img 
                      src={gamer.avatar} 
                      alt={gamer.name}
                      className="w-10 h-10 rounded-full border border-white/20 shadow-md bg-black/20"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs truncate">{gamer.name}</h4>
                      <p className="text-[10px] text-white/50 truncate">{gamer.email}</p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="text-[10px] uppercase font-bold tracking-wider opacity-70 flex items-center gap-1">
                      <Sparkles size={10} className="text-[#06B6D4]" />
                      {gamer.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🔒 FORGOT PASSWORD (OTP RESET) MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300">
          <div className={`relative max-w-md w-full rounded-2xl border p-6 shadow-2xl glass-panel ${
            darkMode ? 'bg-[#0B0F1A]/95 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-800'
          }`}>
            
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-display font-black flex items-center gap-2 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]">
                <KeyRound size={20} className="text-[#7C3AED]" />
                PASSWORD RECOVERY
              </h3>
              <button 
                onClick={() => setShowForgotModal(false)}
                className={`text-xs px-2.5 py-1 rounded-md hover:bg-white/10 transition ${darkMode ? 'text-white/60' : 'text-slate-500'}`}
              >
                CANCEL
              </button>
            </div>

            {forgotError && (
              <div className={`p-3 border rounded-lg text-xs mb-4 flex items-center gap-2 ${
                darkMode ? 'border-red-500/20 bg-red-500/5 text-red-400' : 'border-red-500/30 bg-red-500/10 text-red-600'
              }`}>
                <XCircle size={16} />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className={`p-3 border rounded-lg text-xs mb-4 flex items-center gap-2 ${
                darkMode ? 'border-[#06B6D4]/20 bg-[#06B6D4]/5 text-cyan-400' : 'border-[#06B6D4]/30 bg-[#06B6D4]/10 text-cyan-700'
              }`}>
                <ShieldCheck size={16} />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {/* Dev Tooltip Helper */}
            {devOtp && (
              <div className="p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-lg text-xs mb-4 text-emerald-400 flex flex-col gap-1 shadow-inner animate-pulse">
                <span className="font-bold flex items-center gap-1.5">
                  <Sparkles size={14} className="text-emerald-400" />
                  DEVELOPER HELPER (DEV MODE)
                </span>
                <span>
                  The simulated OTP sent to console is: <strong className="text-white text-sm bg-emerald-600/30 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono tracking-wider">{devOtp}</strong>
                </span>
                <span 
                  onClick={() => setForgotOtp(devOtp)}
                  className="underline cursor-pointer hover:text-white mt-1 font-semibold text-[10px] uppercase"
                >
                  ⚡ Auto-fill OTP field
                </span>
              </div>
            )}

            {forgotStep === 1 ? (
              /* Phase 1: Email Request */
              <form onSubmit={onForgotPasswordSubmit} className="space-y-4">
                <p className={`text-xs ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
                  Enter your registered email address below. We'll generate and send a 6-digit verification OTP code to reset your password.
                </p>
                <div className="space-y-1">
                  <label className={`text-xs font-semibold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      required
                      placeholder="Enter registered email"
                      className={`w-full border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#7C3AED] transition ${
                        darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                    <Mail size={16} className={`absolute left-3 top-3.5 ${darkMode ? 'text-white/40' : 'text-slate-400'}`} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded-lg font-display font-black tracking-wider uppercase shadow-neon-purple mt-2 hover:opacity-90 transition text-white text-xs flex items-center justify-center gap-1"
                >
                  {forgotLoading ? 'GENERATING CODE...' : 'GENERATE RESET OTP'}
                  <ArrowRight size={14} />
                </button>
              </form>
            ) : (
              /* Phase 2: Verify OTP & New Password */
              <form onSubmit={onResetPasswordSubmit} className="space-y-4">
                <p className={`text-xs ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
                  We have simulated sending a code to <strong className="text-white">{forgotEmail}</strong>. Enter the OTP code along with your new password to verify.
                </p>

                <div className="space-y-1">
                  <label className={`text-xs font-semibold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={forgotOtp}
                    onChange={e => setForgotOtp(e.target.value)}
                    required
                    placeholder="Enter 6-digit code"
                    className={`w-full border rounded-lg p-3 text-sm text-center font-mono tracking-widest focus:outline-none focus:border-[#7C3AED] transition ${
                      darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-semibold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={forgotNewPassword}
                    onChange={e => setForgotNewPassword(e.target.value)}
                    required
                    placeholder="Min 6 characters"
                    className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-[#7C3AED] transition ${
                      darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-semibold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={forgotConfirmPassword}
                    onChange={e => setForgotConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter password"
                    className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-[#7C3AED] transition ${
                      darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className={`flex-1 py-3 border rounded-lg font-semibold uppercase tracking-wider transition text-xs ${
                      darkMode ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    BACK
                  </button>
                  
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-[2] py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg font-display font-black tracking-wider uppercase hover:opacity-90 transition text-white text-xs"
                  >
                    {forgotLoading ? 'VERIFYING...' : 'RESET PASSWORD'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
