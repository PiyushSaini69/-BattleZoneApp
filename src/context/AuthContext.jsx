import React, { createContext, useState, useEffect } from 'react';
import { request, saveTokens, clearTokens, getAccessToken } from '../services/api';
import { initiateSocketConnection, disconnectSocket } from '../services/socket';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [authError, setAuthError] = useState('');

  const login = async (email, password) => {
    setAuthError('');
    try {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (res.success) {
        await saveTokens(res.data.accessToken, res.data.refreshToken);
        setUser(res.data.user);
        initiateSocketConnection(res.data.user.id);
        return res.data.user;
      }
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const register = async (username, email, password, phone, referralCode) => {
    setAuthError('');
    try {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username,
          email,
          password,
          phone: phone || undefined,
          referralCode: referralCode || undefined
        })
      });
      return res;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const verifyEmailOtp = async (email, otp) => {
    setAuthError('');
    try {
      const res = await request('/auth/verify-email-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp })
      });
      
      if (res.success) {
        await saveTokens(res.data.accessToken, res.data.refreshToken);
        setUser(res.data.user);
        initiateSocketConnection(res.data.user.id);
        return res.data;
      }
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const resendVerificationOtp = async (email) => {
    setAuthError('');
    try {
      const res = await request('/auth/resend-verification-otp', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      return res;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    await clearTokens();
    disconnectSocket();
    setUser(null);
  };

  const verifySession = async () => {
    try {
      const token = await getAccessToken();
      if (token) {
        const res = await request('/user/profile', {}, logout);
        if (res.success) {
          setUser(res.data);
          initiateSocketConnection(res.data.id);
        }
      }
    } catch (err) {
      console.log('Session verification failed on mobile boot:', err.message);
      await logout();
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    verifySession();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loadingUser,
      authError,
      setAuthError,
      login,
      register,
      verifyEmailOtp,
      resendVerificationOtp,
      logout,
      verifySession
    }}>
      {children}
    </AuthContext.Provider>
  );
};
