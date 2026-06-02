const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api/v1';

// Setup local store wrappers for JWT tokens
export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Helper for standard API calls
export const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const accessToken = getAccessToken();
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      // Automatic Refresh token logic if token expired (401 Unauthorized)
      if (response.status === 401 && getRefreshToken() && !options._retry) {
        options._retry = true;
        console.log('🔄 Token expired. Attempting token rotation refresh...');
        
        try {
          const refreshRes = await fetch(`${API_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: getRefreshToken() })
          });

          const refreshData = await refreshRes.json();
          if (refreshRes.ok && refreshData.success) {
            saveTokens(refreshData.data.accessToken, refreshData.data.refreshToken);
            
            // Retry the original request with new token
            headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
            const retryRes = await fetch(url, { ...options, headers });
            return await retryRes.json();
          } else {
            // Refresh token has failed (e.g. reuse or expired)
            console.warn('❌ Refresh token rotation failed. Clearing sessions.');
            clearTokens();
            window.location.href = '/login?expired=true';
          }
        } catch (err) {
          clearTokens();
          window.location.href = '/login';
        }
      }

      throw new Error(data.error?.message || data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`💥 API Fetch Error on ${endpoint}:`, error.message);
    throw error;
  }
};
