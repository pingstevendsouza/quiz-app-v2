import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Divider } from '@mui/material';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

const GOOGLE_CLIENT_ID = '651363949873-8b853017h823jadb3mk0ckcrua8fu9bn.apps.googleusercontent.com';

const SignIn = ({ setAuth }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
        localStorage.setItem('sessionToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setAuth({ 
          token: data.token, 
          user: data.user 
        });
        navigate('/');
      }
    } catch (e) {
      setError('Google sign in failed');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%', bgcolor: '#181A20', color: '#fff', borderRadius: 4 }}>
        <Typography variant="h4" fontWeight={700} mb={2} align="center" color="#fff">
          Sign In
        </Typography>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign in failed')}
              theme="filled_black"
              width="320"
            />
          </Box>
        </GoogleOAuthProvider>
        <Divider sx={{ my: 2, bgcolor: '#353945' }}>or</Divider>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            autoFocus
            InputProps={{ style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#aaa' } }}
            sx={{ input: { bgcolor: '#23262F' } }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{ style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#aaa' } }}
            sx={{ input: { bgcolor: '#23262F' } }}
          />
          {error && <Typography color="error" mt={1}>{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.5, fontWeight: 600, fontSize: '1rem', borderRadius: 2, bgcolor: '#23262F', color: '#fff', '&:hover': { bgcolor: '#353945' } }}
            disabled={loading || !form.username || !form.password}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        <Typography align="center" mt={3} color="#aaa">
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#5e72e4', textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignIn; 