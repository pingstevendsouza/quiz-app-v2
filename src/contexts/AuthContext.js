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

  // Session validation with server-side endpoint
  const validateSession = async (sessionToken) => {
    try {
      console.log('Validating session token with server...', sessionToken ? 'Token exists' : 'No token');
      
      // Don't proceed if no token is provided
      if (!sessionToken) {
        console.error('No token provided for validation');
        return false;
      }
      
      // Use absolute URL to avoid path issues on Vercel
      // First try the current origin, fallback to the proxy URL if needed
      const apiUrl = window.location.origin + '/api/auth/validate';
      console.log('Using API URL:', apiUrl);
      
      // Log the token being sent (first few characters for security)
      console.log('Sending token for validation:', sessionToken.substring(0, 5) + '...');
      
      const requestBody = JSON.stringify({ token: sessionToken });
      console.log('Request body:', requestBody);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: requestBody,
        credentials: 'include'
      });

      console.log('Validation response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Token validation successful:', data);
        
        // Update user data if provided
        if (data.user) {
          setUser(data.user);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        }
        
        return data.valid;
      } else {
        console.error('Token validation failed:', response.status);
        try {
          const errorData = await response.json().catch(() => ({}));
          console.error('Validation error details:', errorData);
        } catch (err) {
          console.error('Failed to parse error response:', err);
        }
        // Fallback: Don't invalidate session immediately if server error occurs
        if (response.status >= 500) {
          console.warn('Server error occurred, maintaining session temporarily');
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Session validation error:', error);
      // Fallback to client-side check if server is unreachable
      return !!sessionToken;
    }
  };

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === SESSION_STORAGE_KEY) {
        if (e.newValue) {
          // Another tab logged in
          const newToken = e.newValue;
          const newUser = localStorage.getItem(USER_STORAGE_KEY);
          if (newUser) {
            console.log('Session updated from another tab');
            setToken(newToken);
            setUser(JSON.parse(newUser));
          }
        } else {
          // Another tab logged out
          console.log('Session cleared from another tab');
          setToken(null);
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        const storedToken = localStorage.getItem(SESSION_STORAGE_KEY);
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        
        console.log('Stored token exists:', !!storedToken);
        console.log('Stored user exists:', !!storedUser);
        
        // Set token and user immediately from localStorage to prevent flash of unauthenticated state
        if (storedToken) {
          setToken(storedToken);
          console.log('Token set from localStorage:', storedToken.substring(0, 10) + '...');
          
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
              console.log('User set from localStorage:', parsedUser.username);
            } catch (e) {
              console.error('Failed to parse stored user data', e);
            }
          }
          
          // Validate the token asynchronously
          console.log('Validating session token...');
          const isValid = await validateSession(storedToken);
          console.log('Token validation result:', isValid);
          
          if (!isValid) {
            console.log('Token is invalid, clearing auth state');
            setToken(null);
            setUser(null);
            localStorage.removeItem(SESSION_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);
          }
        } else {
          console.log('No stored token found, user is not logged in');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
        console.log('Auth initialization complete, loading state set to false');
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
