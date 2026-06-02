import React, { useState, useEffect, useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { 
  User as UserIcon, 
  Gamepad2, 
  Settings, 
  Trophy, 
  Target, 
  ShieldCheck, 
  Coins, 
  Copy, 
  Check, 
  Edit3, 
  Sparkles, 
  Share2, 
  Mail, 
  Phone,
  Image as ImageIcon
} from 'lucide-react';
import { request } from '../services/api';
import { ThemeContext } from '../context/ThemeContext';

const AVATAR_LIBRARY = [
  { id: "a1", name: "Ninja", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=ninja" },
  { id: "a2", name: "Shroud", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=shroud" },
  { id: "a3", name: "Valkyrae", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=valkyrae" },
  { id: "a4", name: "S1mple", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=s1mple" },
  { id: "a5", name: "Cyber Mage", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=charlie" },
  { id: "a6", name: "Valorant Viper", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=viper" },
  { id: "a7", name: "Phoenix Fire", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=phoenix" },
  { id: "a8", name: "Jett Breeze", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=jett" }
];

const Profile = ({ user, setUser, showToast }) => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  // Tab State
  const [activeTab, setActiveTab] = useState('gaming'); // 'gaming' | 'account' | 'avatar'

  // Input states
  const [displayName, setDisplayName] = useState(user.displayName || user.username || '');
  const [bio, setBio] = useState(user.bio || '');
  
  // Game UIDs state
  const [bgmi, setBgmi] = useState(user.gameUIDs?.bgmi || '');
  const [valorant, setValorant] = useState(user.gameUIDs?.valorant || '');
  const [freeFire, setFreeFire] = useState(user.gameUIDs?.freeFire || '');
  const [codMobile, setCodMobile] = useState(user.gameUIDs?.codMobile || '');

  // Operation Loading States
  const [saveLoading, setSaveLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync state if user object updates
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.username || '');
      setBio(user.bio || '');
      setBgmi(user.gameUIDs?.bgmi || '');
      setValorant(user.gameUIDs?.valorant || '');
      setFreeFire(user.gameUIDs?.freeFire || '');
      setCodMobile(user.gameUIDs?.codMobile || '');
    }
  }, [user]);

  // Handle Save Account details
  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await request('/user/profile', {
        method: 'PATCH',
        body: JSON.stringify({ displayName, bio })
      });
      
      if (res.success) {
        setUser(prev => ({
          ...prev,
          displayName: res.data.displayName,
          bio: res.data.bio
        }));
        showToast('Identity profile details saved successfully!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to save account details.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle Save Game UIDs
  const handleSaveGameUIDs = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await request('/user/game-uids', {
        method: 'PATCH',
        body: JSON.stringify({
          gameUIDs: {
            bgmi,
            valorant,
            freeFire,
            codMobile
          }
        })
      });
      
      if (res.success) {
        setUser(prev => ({
          ...prev,
          gameUIDs: res.data.gameUIDs
        }));
        showToast('Gaming Character Identifiers saved successfully!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to save gaming UIDs.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle Select Avatar Preset
  const handleSelectAvatar = async (avatarUrl) => {
    setSaveLoading(true);
    try {
      const res = await request('/user/avatar', {
        method: 'POST',
        body: JSON.stringify({ avatarUrl })
      });
      
      if (res.success) {
        setUser(prev => ({
          ...prev,
          avatar: avatarUrl
        }));
        showToast('Avatar selection updated successfully!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update avatar.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle custom image file upload converting it to base64 binary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verify file size limit (2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image file size exceeds the 2MB maximum limit.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setSaveLoading(true);
      try {
        const res = await request('/user/avatar', {
          method: 'POST',
          body: JSON.stringify({ avatarUrl: base64String })
        });
        
        if (res.success) {
          setUser(prev => ({
            ...prev,
            avatar: base64String
          }));
          showToast('Custom image uploaded and saved as binary successfully!');
        }
      } catch (err) {
        showToast(err.message || 'Failed to save binary image.', 'error');
      } finally {
        setSaveLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Copy Referral link to Clipboard
  const handleCopyReferral = () => {
    const referralLink = `${window.location.origin}?ref=${user.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 🚀 PREMIUM HEADER BANNER CARD */}
      <div className={`relative overflow-hidden rounded-2xl border ${
        darkMode 
          ? 'bg-gradient-to-r from-[#111827] via-[#0B0F1A] to-[#1F2937] border-white/5' 
          : 'bg-gradient-to-r from-slate-100 via-white to-slate-200 border-slate-200'
      } p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center shadow-xl`}>
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] opacity-10 blur-3xl pointer-events-none rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#7C3AED]/5 blur-3xl pointer-events-none rounded-full"></div>

        {/* Profile Avatar with Hover Glow */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] opacity-50 blur group-hover:opacity-100 transition duration-300"></div>
          <div className={`relative w-28 h-28 rounded-full border-4 ${
            darkMode ? 'bg-black/60 border-[#0B0F1A]' : 'bg-slate-50 border-white'
          } flex items-center justify-center overflow-hidden`}>
            {user.avatar ? (
              <img src={user.avatar} referrerPolicy="no-referrer" className="object-cover w-full h-full" alt="avatar" />
            ) : (
              <UserIcon size={56} className="text-[#7C3AED]" />
            )}
          </div>
          <button 
            onClick={() => setActiveTab('avatar')}
            className="absolute bottom-1 right-1 p-2 bg-[#7C3AED] rounded-full hover:bg-[#06B6D4] transition text-white shadow-lg border border-white/10"
            title="Edit Avatar"
          >
            <ImageIcon size={14} />
          </button>
        </div>

        {/* Identity Information */}
        <div className="text-center md:text-left flex-grow space-y-2">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center md:justify-start">
            <h2 className={`font-display font-black text-2xl tracking-wide uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              {user.displayName || user.username}
            </h2>
            <span className="px-3 py-0.5 text-[9px] font-display font-extrabold tracking-wider uppercase border border-[#7C3AED]/40 text-[#7C3AED] bg-[#7C3AED]/5 rounded-md">
              {user.role}
            </span>
          </div>
          
          <p className={`text-xs max-w-lg leading-relaxed ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
            {user.bio || 'This esport competitor hasn\'t configured a bio yet. Write a catchy bio to show off on the battlegrounds!'}
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs pt-1.5 opacity-90">
            <div className={`flex items-center gap-1.5 ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>
              <Mail size={14} className="text-[#06B6D4]" />
              <span className={darkMode ? 'text-white/70' : 'text-slate-600'}>{user.email}</span>
            </div>
            {user.phone && (
              <div className={`flex items-center gap-1.5 ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>
                <Phone size={14} className="text-[#7C3AED]" />
                <span className={darkMode ? 'text-white/70' : 'text-slate-600'}>{user.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* 🎫 SLICED REFERRAL CODE CARD */}
        <div className="w-full md:w-auto min-w-[240px]">
          <div className={`rounded-xl border p-4 relative overflow-hidden backdrop-blur-sm ${
            darkMode ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-[10px] uppercase font-bold tracking-widest ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>
                REFERRAL HUB
              </span>
              <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                {user.referralCount || 0} REFS
              </span>
            </div>
            
            <div className="flex gap-2 items-center">
              <div className={`font-mono text-sm font-black tracking-wider px-3 py-2 border rounded-lg flex-grow flex items-center justify-between ${
                darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <span>{user.referralCode}</span>
                <Sparkles size={12} className="text-[#06B6D4]" />
              </div>
              
              <button
                onClick={handleCopyReferral}
                className="p-2.5 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-90 transition rounded-lg text-white font-semibold flex items-center justify-center shadow-lg"
                title="Copy Referral Link"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            
            <p className="text-[9px] text-center opacity-60 mt-2 font-semibold">
              Share your custom link to score ₹10 bonus cash instantly!
            </p>
          </div>
        </div>
      </div>

      {/* 📊 DYNAMIC STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
          <GlassCard className="p-4 text-center space-y-1 relative hover:scale-[1.02] transition-transform duration-300 cursor-default">
            <div className="mx-auto w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Trophy size={16} />
            </div>
            <span className={`text-[10px] uppercase block font-bold tracking-wider ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>TOURNAMENTS</span>
            <span className={`font-display font-black text-2xl ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              {user.stats?.tournamentsPlayed || 0}
            </span>
          </GlassCard>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#06B6D4] to-cyan-500 opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
          <GlassCard className="p-4 text-center space-y-1 relative hover:scale-[1.02] transition-transform duration-300 cursor-default">
            <div className="mx-auto w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-[#06B6D4]">
              <ShieldCheck size={16} />
            </div>
            <span className={`text-[10px] uppercase block font-bold tracking-wider ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>WINS CHIEF</span>
            <span className="font-display font-black text-2xl text-[#06B6D4]">
              {user.stats?.tournamentsWon || 0}
            </span>
          </GlassCard>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
          <GlassCard className="p-4 text-center space-y-1 relative hover:scale-[1.02] transition-transform duration-300 cursor-default">
            <div className="mx-auto w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Target size={16} />
            </div>
            <span className={`text-[10px] uppercase block font-bold tracking-wider ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>TOTAL KILLS</span>
            <span className="font-display font-black text-2xl text-orange-400">
              {user.stats?.totalKills || 0}
            </span>
          </GlassCard>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
          <GlassCard className="p-4 text-center space-y-1 relative hover:scale-[1.02] transition-transform duration-300 cursor-default">
            <div className="mx-auto w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Coins size={16} />
            </div>
            <span className={`text-[10px] uppercase block font-bold tracking-wider ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>EARNED PRIZES</span>
            <span className="font-display font-black text-2xl text-emerald-400">
              ₹{user.stats?.totalEarnings || 0}
            </span>
          </GlassCard>
        </div>
      </div>

      {/* 🛠️ PROFILE CONFIGURATION SECTION */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Navigation Sidebar */}
        <GlassCard className="h-fit space-y-1.5 p-4 md:col-span-1">
          <h3 className={`font-display font-black text-xs uppercase px-2 pb-2.5 border-b mb-3 ${
            darkMode ? 'text-white/40 border-white/5' : 'text-slate-500 border-slate-100'
          }`}>SETTINGS DASHBOARD</h3>
          
          <button
            onClick={() => setActiveTab('gaming')}
            className={`w-full text-left px-3 py-3 rounded-lg font-semibold text-xs tracking-wider uppercase flex items-center gap-2.5 transition ${
              activeTab === 'gaming'
                ? 'bg-[#7C3AED] text-white shadow-neon-purple'
                : darkMode ? 'hover:bg-white/5 text-white/70' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Gamepad2 size={16} />
            Gaming Character Identifiers
          </button>
          
          <button
            onClick={() => setActiveTab('account')}
            className={`w-full text-left px-3 py-3 rounded-lg font-semibold text-xs tracking-wider uppercase flex items-center gap-2.5 transition ${
              activeTab === 'account'
                ? 'bg-[#7C3AED] text-white shadow-neon-purple'
                : darkMode ? 'hover:bg-white/5 text-white/70' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Settings size={16} />
            Identity Details
          </button>
          
          <button
            onClick={() => setActiveTab('avatar')}
            className={`w-full text-left px-3 py-3 rounded-lg font-semibold text-xs tracking-wider uppercase flex items-center gap-2.5 transition ${
              activeTab === 'avatar'
                ? 'bg-[#7C3AED] text-white shadow-neon-purple'
                : darkMode ? 'hover:bg-white/5 text-white/70' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <ImageIcon size={16} />
            Select Custom Avatar
          </button>
        </GlassCard>

        {/* Setting Panel Details */}
        <div className="md:col-span-2">
          {/* TAB 1: GAMING IDS CONFIG */}
          {activeTab === 'gaming' && (
            <GlassCard>
              <div className="flex items-center gap-2 mb-2">
                <Gamepad2 className="text-[#06B6D4]" size={18} />
                <h3 className={`font-display font-black text-sm uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  GAMING CHARACTER IDENTIFIERS
                </h3>
              </div>
              <p className={`text-xs mb-5 leading-relaxed opacity-75 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
                Configure your accurate game names and character IDs. These are used by tournament referees to verify matches, distribute points, and credit winnings.
              </p>

              <form onSubmit={handleSaveGameUIDs} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
                      BGMI Character UID
                    </label>
                    <input
                      type="text"
                      value={bgmi}
                      onChange={e => setBgmi(e.target.value)}
                      placeholder="e.g. 5567382901"
                      className={`w-full border rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-[#7C3AED] transition ${
                        darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
                      Valorant Riot Tag
                    </label>
                    <input
                      type="text"
                      value={valorant}
                      onChange={e => setValorant(e.target.value)}
                      placeholder="e.g. TenZ#NA1"
                      className={`w-full border rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-[#7C3AED] transition ${
                        darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
                      Free Fire Game ID
                    </label>
                    <input
                      type="text"
                      value={freeFire}
                      onChange={e => setFreeFire(e.target.value)}
                      placeholder="e.g. 987654321"
                      className={`w-full border rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-[#7C3AED] transition ${
                        darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
                      Call of Duty Mobile ID
                    </label>
                    <input
                      type="text"
                      value={codMobile}
                      onChange={e => setCodMobile(e.target.value)}
                      placeholder="e.g. CoD_Legend"
                      className={`w-full border rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-[#7C3AED] transition ${
                        darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex justify-end">
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="py-2.5 px-6 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-90 transition rounded-lg text-white font-display font-black text-xs tracking-wider uppercase shadow-neon-purple disabled:opacity-50"
                  >
                    {saveLoading ? 'SAVING IDENTIFIERS...' : 'SAVE GAMING UIDS'}
                  </button>
                </div>
              </form>
            </GlassCard>
          )}

          {/* TAB 2: IDENTITY DETAILS */}
          {activeTab === 'account' && (
            <GlassCard>
              <div className="flex items-center gap-2 mb-2">
                <Edit3 className="text-[#06B6D4]" size={18} />
                <h3 className={`font-display font-black text-sm uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  IDENTITY DETAILS
                </h3>
              </div>
              <p className={`text-xs mb-5 leading-relaxed opacity-75 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
                Update your community identity information. This affects how your profile name and bio will display on leaderboards and bracket pages.
              </p>

              <form onSubmit={handleSaveAccount} className="space-y-4">
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    required
                    placeholder="Enter gamer display name"
                    className={`w-full border rounded-lg p-3 text-xs focus:outline-none focus:border-[#7C3AED] transition ${
                      darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-bold uppercase tracking-wider block ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
                    Bio Description
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Describe your gaming background, setups, or stats..."
                    className={`w-full border rounded-lg p-3 text-xs focus:outline-none focus:border-[#7C3AED] transition ${
                      darkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div className="pt-2 border-t border-white/5 flex justify-end">
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="py-2.5 px-6 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-90 transition rounded-lg text-white font-display font-black text-xs tracking-wider uppercase shadow-neon-purple disabled:opacity-50"
                  >
                    {saveLoading ? 'SAVING IDENTITY...' : 'SAVE ACCOUNT DETAILS'}
                  </button>
                </div>
              </form>
            </GlassCard>
          )}

          {/* TAB 3: CUSTOM AVATARS */}
          {activeTab === 'avatar' && (
            <GlassCard>
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="text-[#06B6D4]" size={18} />
                <h3 className={`font-display font-black text-sm uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  SELECT COMMUNITY AVATAR
                </h3>
              </div>
              <p className={`text-xs mb-6 leading-relaxed opacity-75 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
                Personalize your community account with a premium gamer avatar designed by esport designers. Click any template to instantly save as your profile picture!
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {AVATAR_LIBRARY.map((avatar) => {
                  const isSelected = user.avatar === avatar.url;
                  return (
                    <div 
                      key={avatar.id}
                      onClick={() => !saveLoading && handleSelectAvatar(avatar.url)}
                      className={`group relative rounded-xl border p-3 cursor-pointer text-center transition duration-300 flex flex-col items-center gap-2 ${
                        isSelected 
                          ? 'border-[#7C3AED] bg-[#7C3AED]/10 shadow-neon-purple scale-[1.03]'
                          : darkMode 
                            ? 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10' 
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {/* Selection Glow Indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 p-0.5 bg-[#10B981] rounded-full text-white">
                          <Check size={10} />
                        </div>
                      )}
                      
                      <div className={`w-16 h-16 rounded-full border-2 ${
                        isSelected ? 'border-[#7C3AED]' : 'border-transparent'
                      } flex items-center justify-center overflow-hidden bg-black/20 relative`}>
                        <img 
                          src={avatar.url} 
                          alt={avatar.name} 
                          className="object-cover w-full h-full transform group-hover:scale-110 transition duration-300"
                        />
                      </div>
                      
                      <span className={`text-[10px] font-bold tracking-wider ${
                        isSelected ? 'text-[#7C3AED]' : darkMode ? 'text-white/60' : 'text-slate-500'
                      }`}>
                        {avatar.name.toUpperCase()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* File Upload Zone */}
              <div className={`mt-6 border-t pt-5 ${darkMode ? 'border-white/5' : 'border-slate-200'}`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-3.5 ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
                  OR UPLOAD YOUR OWN CUSTOM BINARY AVATAR
                </span>
                
                <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition relative group ${
                  darkMode 
                    ? 'border-white/10 hover:border-[#7C3AED]/40 bg-black/10' 
                    : 'border-slate-300 hover:border-[#7C3AED]/40 bg-slate-50'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={saveLoading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED]">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-bold block uppercase">
                        Upload custom image file
                      </span>
                      <span className={`text-[10px] block mt-0.5 ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>
                        PNG, JPG or WebP (Max 2MB). Converted and saved directly as binary.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
