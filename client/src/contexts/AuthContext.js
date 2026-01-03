import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/verify`);
      setUser(response.data.user);
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('token');
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  // Set default authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      verifyToken();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });
      
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      // Better error handling
      if (error.response) {
        // Server responded with error
        return {
          success: false,
          error: error.response.data?.error || error.response.data?.message || 'Login failed'
        };
      } else if (error.request) {
        // Request made but no response
        return {
          success: false,
          error: 'Cannot connect to server. Please make sure the server is running.'
        };
      } else {
        // Error setting up request
        return {
          success: false,
          error: error.message || 'Login failed'
        };
      }
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        email,
        password,
        name
      });
      
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      // Better error handling
      if (error.response) {
        // Server responded with error
        return {
          success: false,
          error: error.response.data?.error || error.response.data?.message || 'Registration failed'
        };
      } else if (error.request) {
        // Request made but no response
        return {
          success: false,
          error: 'Cannot connect to server. Please make sure the server is running.'
        };
      } else {
        // Error setting up request
        return {
          success: false,
          error: error.message || 'Registration failed'
        };
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

