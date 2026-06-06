import * as SecureStore from 'expo-secure-store';
import { CONFIG } from '../config';

// SecureStore key-value mappings are asynchronous in React Native
export const getAccessToken = async () => await SecureStore.getItemAsync('accessToken');
export const getRefreshToken = async () => await SecureStore.getItemAsync('refreshToken');

export const saveTokens = async (accessToken, refreshToken) => {
  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
};

// Replicate standard fetch requests but adapted for mobile secure tokens
export const request = async (endpoint, options = {}, onSessionExpired) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const accessToken = await getAccessToken();
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const url = `${CONFIG.API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const refreshToken = await getRefreshToken();

      // Automatic Refresh token logic if token expired (401 Unauthorized)
      if (response.status === 401 && refreshToken && !options._retry) {
        options._retry = true;
        console.log('🔄 Token expired. Attempting token rotation refresh on mobile...');
        
        try {
          const refreshRes = await fetch(`${CONFIG.API_BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });

          const refreshData = await refreshRes.json();
          if (refreshRes.ok && refreshData.success) {
            await saveTokens(refreshData.data.accessToken, refreshData.data.refreshToken);
            
            // Retry the original request with new token
            headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
            const retryRes = await fetch(url, { ...options, headers });
            return await retryRes.json();
          } else {
            console.warn('❌ Refresh token rotation failed. Clearing session storage.');
            await clearTokens();
            if (onSessionExpired) onSessionExpired();
          }
        } catch (err) {
          await clearTokens();
          if (onSessionExpired) onSessionExpired();
        }
      }

      const apiError = new Error(data.error?.message || data.message || 'API request failed');
      apiError.details = data.error?.details || [];
      apiError.code = data.error?.code || 'API_ERROR';
      throw apiError;
    }

    return data;
  } catch (error) {
    console.error(`💥 API Fetch Error on ${endpoint}:`, error.message);
    throw error;
  }
};
