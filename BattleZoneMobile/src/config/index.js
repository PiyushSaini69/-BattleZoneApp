// On Android emulator, the host machine is 10.0.2.2. On iOS simulator, it is localhost.
// Replace with your local machine's IP (e.g. 192.168.1.5) if testing on a real device.
const DEV_IP = '192.168.1.20'; // Change to local IP if testing on real device

export const CONFIG = {
  API_BASE_URL: `https://battle-zone-backend-zlci.onrender.com/api/v1`,
  SOCKET_URL: `https://battle-zone-backend-zlci.onrender.com`,
  DEFAULT_BANNER: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
  DEFAULT_AVATAR: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
};
