// On Android emulator, the host machine is 10.0.2.2. On iOS simulator, it is localhost.
// Replace with your local machine's IP (e.g. 192.168.1.5) if testing on a real device.
const DEV_IP = '192.168.1.57'; // Local development host IP
const LOCAL_URL = `http://${DEV_IP}:5050`;

export const CONFIG = {
  API_BASE_URL: `${LOCAL_URL}/api/v1`,
  SOCKET_URL: LOCAL_URL,
  GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '621490951518-3kn5eg4hpkvimqcrdiqk644d12evg243.apps.googleusercontent.com',
  DEFAULT_BANNER: process.env.EXPO_PUBLIC_DEFAULT_BANNER || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
  DEFAULT_AVATAR: process.env.EXPO_PUBLIC_DEFAULT_AVATAR || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
};
