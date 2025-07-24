import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from '../../theme';
import DashboardLayout from '../DashboardLayout';
import Loader from '../Loader';
import Upload from '../Upload';
import Main from '../Main';
import Quiz from '../Quiz';
import Result from '../Result';
import Dashboard from '../Dashboard';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';

import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { shuffle } from '../../utils';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
  Typography
} from '@mui/material';

const getSession = () => {
  const token = localStorage.getItem('sessionToken');
  const username = localStorage.getItem('username');
  return token && username ? { token, username } : null;
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [data, setData] = useState(null);
  const [countdownTime, setCountdownTime] = useState(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [selectedItem, setSelectedItem] = useState('Dashboard');
  const [auth, setAuth] = useState(getSession());
  const [authTab, setAuthTab] = useState(0); // 0: Sign In, 1: Sign Up
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleMenuSelect = (item) => {
    setSelectedItem(item); // Update the selected item
  };

  const handleAuthInput = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleAuthTab = (e, newValue) => {
    setAuthTab(newValue);
    setAuthError('');
    setAuthForm({ username: '', password: '' });
  };

  const handleAuth = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const type = authTab === 0 ? 'signin' : 'signup';
      const res = await fetch('/api/upload-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...authForm, type })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Authentication failed');
      } else {
        if (type === 'signin') {
          localStorage.setItem('sessionToken', data.token);
          localStorage.setItem('username', data.username);
          setAuth({ token: data.token, username: data.username });
        } else {
          setAuthTab(0);
          setAuthError('Sign up successful! Please sign in.');
        }
        setAuthForm({ username: '', password: '' });
      }
    } catch (e) {
      setAuthError('Network error');
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('username');
    setAuth(null);
  };

  const startQuiz = (data, countdownTime) => {
    setLoading(true);
    setLoadingMessage({
      title: 'Loading your quiz...',
      message: "It won't be long!",
    });
    setCountdownTime(countdownTime);

    setTimeout(() => {
      setData(data);
      setIsQuizStarted(true);
      setLoading(false);
    }, 1000);
  };

  const endQuiz = resultData => {
    setLoading(true);
    setLoadingMessage({
      title: 'Fetching your results...',
      message: 'Just a moment!',
    });

    setTimeout(() => {
      setIsQuizStarted(false);
      setIsQuizCompleted(true);
      setResultData(resultData);
      setLoading(false);
    }, 2000);
  };

  const replayQuiz = () => {
    setLoading(true);
    setLoadingMessage({
      title: 'Getting ready for round two.',
      message: "It won't take long!",
    });

    const shuffledData = shuffle(data);
    shuffledData.forEach(element => {
      element.options = shuffle(element.options);
    });

    setData(shuffledData);

    setTimeout(() => {
      setIsQuizStarted(true);
      setIsQuizCompleted(false);
      setResultData(null);
      setLoading(false);
    }, 1000);
  };

  const resetQuiz = () => {
    setLoading(true);
    setLoadingMessage({
      title: 'Loading the home screen.',
      message: 'Thank you for playing!',
    });

    setTimeout(() => {
      setData(null);
      setCountdownTime(null);
      setIsQuizStarted(false);
      setIsQuizCompleted(false);
      setResultData(null);
      setLoading(false);
    }, 1000);
  };

  const navigate = useNavigate();
  const location = useLocation();

  // Remove modal logic

  // If not authenticated, redirect to /signin unless already there
  React.useEffect(() => {
    if (!auth && location.pathname !== '/signin' && location.pathname !== '/signup') {
      navigate('/signin', { replace: true });
    }
    if (auth && (location.pathname === '/signin' || location.pathname === '/signup')) {
      navigate('/', { replace: true });
    }
  }, [auth, location.pathname, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/signin" element={<SignIn setAuth={setAuth} />} />
        <Route path="/signup" element={<SignUp setAuthTab={() => {}} />} />
        <Route
          path="/*"
          element={
            auth ? (
              <DashboardLayout onMenuSelect={handleMenuSelect} selectedItem={selectedItem}>
                <Box sx={{ position: 'absolute', top: 16, right: 24, zIndex: 1201 }}>
                  <Button variant="outlined" color="secondary" onClick={handleLogout}>
                    Logout ({auth.username})
                  </Button>
                </Box>
                {loading && <Loader {...loadingMessage} />}
                {!loading && selectedItem === 'Dashboard' && <Dashboard />}
                {!loading && selectedItem === 'Update' && !isQuizStarted && !isQuizCompleted && <Upload />}
                {!loading && !isQuizStarted && !isQuizCompleted && selectedItem === 'Create' && (
                  <Main startQuiz={startQuiz} />
                )}
                {!loading && isQuizStarted && selectedItem !== 'Update' && (
                  <Quiz data={data} countdownTime={countdownTime} endQuiz={endQuiz} />
                )}
                {!loading && isQuizCompleted && selectedItem !== 'Update' && (
                  <Result {...resultData} replayQuiz={replayQuiz} resetQuiz={resetQuiz} />
                )}
              </DashboardLayout>
            ) : null
          }
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
