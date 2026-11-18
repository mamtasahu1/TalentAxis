import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    sessionStorage.getItem('token') || localStorage.getItem('token') || null
  );
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken =
        sessionStorage.getItem('token') || localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success) {
            setUser(res.data.data);
            setToken(storedToken);
          }
        } catch (error) {
          console.error('Session initialization error:', error);
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      const { user: userData, token: userToken } = res.data.data;
      sessionStorage.setItem('token', userToken);
      sessionStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setToken(userToken);
      return userData;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  // Register handler (Student only)
  const register = async (formData) => {
    const res = await authAPI.register(formData);
    if (res.data.success) {
      const { user: userData, token: userToken } = res.data.data;
      sessionStorage.setItem('token', userToken);
      sessionStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setToken(userToken);
      return userData;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  // Update profile handler (PATCH /api/users/me)
  const updateProfile = async (profileData) => {
    const res = await userAPI.updateProfile(profileData);
    if (res.data.success) {
      setUser(res.data.data);
      sessionStorage.setItem('user', JSON.stringify(res.data.data));
      localStorage.setItem('user', JSON.stringify(res.data.data));
      return res.data.data;
    }
    throw new Error(res.data.message || 'Profile update failed');
  };

  // Logout handler
  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isStudent: user?.role === 'student',
        isAdmin: user?.role === 'admin',
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
