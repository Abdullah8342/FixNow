import { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS, buildApiUrl } from '@/services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('access_token')
  );
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem('refresh_token')
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('access_token')
  );
  const [loading, setLoading] = useState(false);

  const setTokens = (access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setAccessToken(access);
    setRefreshToken(refresh);
    setIsAuthenticated(true);
  };

  const login = async (email, password) => {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.login), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const data = await response.json();
      const error = new Error();
      error.payload = data;
      throw error;
    }
    const data = await response.json();
    setTokens(data.access, data.refresh);
    return data;
  };

  const logout = async () => {
    try {
      if (accessToken) {
        await fetch(buildApiUrl(API_ENDPOINTS.auth.logout), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    } catch (e) {
      // Ignore errors
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  };

  const register = async (userData) => {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.register), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const data = await response.json();
      const error = new Error();
      error.payload = data;
      throw error;
    }
    const data = await response.json();
    // Auto-login after registration
    return login(userData.email, userData.password);
  };

  const verifyOtp = async (email, otp) => {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.verifyOtp), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    if (!response.ok) {
      const data = await response.json();
      const error = new Error();
      error.payload = data;
      throw error;
    }
    const data = await response.json();
    setTokens(data.access, data.refresh);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        isAuthenticated,
        loading,
        login,
        logout,
        register,
        verifyOtp,
        setTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
