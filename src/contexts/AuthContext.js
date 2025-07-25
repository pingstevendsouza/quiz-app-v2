import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const SESSION_STORAGE_KEY = 'quiz_app_session';
const USER_STORAGE_KEY = 'quiz_app_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Session validation - simplified since we don't have a validate endpoint
  const validateSession = async (sessionToken) => {
    try {
      console.log('Validating session token (client-side only)');
      // Since we don't have a validate endpoint, we'll just check if the token exists
      // A real implementation would verify this token with the server
      return !!sessionToken;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        const storedToken = localStorage.getItem(SESSION_STORAGE_KEY);
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        
        console.log('Stored token exists:', !!storedToken);
        console.log('Stored user exists:', !!storedUser);
        
        if (storedToken) {
          // Validate the token
          console.log('Validating session token...');
          const isValid = await validateSession(storedToken);
          console.log('Token validation result:', isValid);
          
          if (isValid) {
            console.log('Token is valid, setting auth state');
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            // Try to refresh the token
            console.log('Token invalid, attempting refresh...');
            const refreshed = await refreshToken(storedToken);
            console.log('Token refresh result:', refreshed);
            
            if (!refreshed) {
              // Clear invalid session
              console.log('Clearing invalid session');
              localStorage.removeItem(SESSION_STORAGE_KEY);
              localStorage.removeItem(USER_STORAGE_KEY);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        
        // Store in localStorage
        localStorage.setItem(SESSION_STORAGE_KEY, data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        
        return { success: true };
      } else {
        setError(data.error || 'Login failed');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error during login');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  // Google login function
  const googleLogin = async (credential) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting Google login with credential:', credential ? 'credential provided' : 'no credential');
      
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credential }),
        credentials: 'include' // Important for cookies
      });

      console.log('Google login response status:', response.status);
      const data = await response.json();
      console.log('Google login response data:', data);

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        
        // Store in localStorage
        localStorage.setItem(SESSION_STORAGE_KEY, data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        
        return { success: true };
      } else {
        setError(data.error || 'Google login failed');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Network error during Google login');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API if needed
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local state and storage
      setToken(null);
      setUser(null);
      setError(null);
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      navigate('/signin');
    }
  };

  // Refresh token function - simplified since we don't have a refresh endpoint
  const refreshToken = async (currentToken = token) => {
    try {
      console.log('Token refresh not implemented on backend');
      // Since we don't have a refresh endpoint, we'll just return false
      // A real implementation would request a new token from the server
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    googleLogin,
    logout,
    refreshToken,
    clearError,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
