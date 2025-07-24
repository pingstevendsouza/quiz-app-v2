import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';

const SignUp = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/upload-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'signup' })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Sign up failed');
      } else {
        setSuccess('Sign up successful! Please sign in.');
        setTimeout(() => navigate('/signin'), 1200);
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%', bgcolor: '#181A20', color: '#fff', borderRadius: 4 }}>
        <Typography variant="h4" fontWeight={700} mb={2} align="center" color="#fff">
          Sign Up
        </Typography>
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
          {success && <Typography color="success.main" mt={1}>{success}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.5, fontWeight: 600, fontSize: '1rem', borderRadius: 2, bgcolor: '#23262F', color: '#fff', '&:hover': { bgcolor: '#353945' } }}
            disabled={loading || !form.username || !form.password}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
        <Typography align="center" mt={3} color="#aaa">
          Already have an account?{' '}
          <Link to="/signin" style={{ color: '#5e72e4', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUp; 