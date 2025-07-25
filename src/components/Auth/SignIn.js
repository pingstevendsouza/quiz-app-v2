import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  CircularProgress, 
  Divider,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock,
  Google as GoogleIcon
} from '@mui/icons-material';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = '651363949873-8b853017h823jadb3mk0ckcrua8fu9bn.apps.googleusercontent.com';

const SignIn = ({ setAuth }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/upload-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'signin' })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Sign in failed');
      } else {
        localStorage.setItem('sessionToken', data.token);
        localStorage.setItem('username', data.username);
        setAuth({ token: data.token, username: data.username });
        navigate('/');
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  // Google login handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Google sign in failed');
      } else {
        // Store the session token and user data
        localStorage.setItem('sessionToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update the auth state with the user data
        setAuth({ 
          token: data.token, 
          user: data.user 
        });
        
        // Redirect to home
        navigate('/');
      }
    } catch (e) {
      console.error('Google sign in error:', e);
      setError('Google sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Paper 
        elevation={24} 
        sx={{ 
          p: 6, 
          maxWidth: 450, 
          width: '100%', 
          bgcolor: '#ffffff', 
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            fontWeight={700} 
            sx={{ 
              color: '#2D3748',
              mb: 1,
              fontSize: { xs: '2rem', sm: '2.5rem' }
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#718096',
              fontSize: '1.1rem'
            }}
          >
            Sign in to your account
          </Typography>
        </Box>

        {/* Google Login */}
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <Box sx={{ mb: 3 }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign in failed')}
              theme="outline"
              size="large"
              width="100%"
              text="continue_with"
              shape="rectangular"
            />
          </Box>
        </GoogleOAuthProvider>

        {/* Divider */}
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="#A0AEC0">
            or
          </Typography>
        </Divider>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email or Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#A0AEC0' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#E2E8F0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#CBD5E0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                }
              }
            }}
            InputLabelProps={{ 
              sx: { color: '#A0AEC0' } 
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          
          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#A0AEC0' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    sx={{ color: '#A0AEC0' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#E2E8F0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#CBD5E0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                }
              }
            }}
            InputLabelProps={{ 
              sx: { color: '#A0AEC0' } 
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          {/* Forgot Password */}
          <Box sx={{ textAlign: 'right', mb: 3 }}>
            <Link 
              to="/forgot-password" 
              style={{ 
                color: '#667eea', 
                textDecoration: 'none', 
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            >
              Forgot password?
            </Link>
          </Box>

          {/* Sign In Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !form.username || !form.password}
            sx={{
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
              },
              '&:disabled': {
                background: '#E2E8F0',
                color: '#A0AEC0'
              }
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        <Typography 
          align="center" 
          sx={{ 
            mt: 4, 
            color: '#718096',
            fontSize: '1rem'
          }}
        >
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            style={{ 
              color: '#667eea', 
              textDecoration: 'none', 
              fontWeight: 600 
            }}
          >
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignIn; 