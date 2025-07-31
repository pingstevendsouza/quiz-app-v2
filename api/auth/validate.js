const { Redis } = require('@upstash/redis');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'temporary-secret-for-testing-only-change-immediately';

// Check for required environment variables
if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
  console.error('Missing Redis environment variables:', {
    UPSTASH_REDIS_URL: !!process.env.UPSTASH_REDIS_URL,
    UPSTASH_REDIS_TOKEN: !!process.env.UPSTASH_REDIS_TOKEN
  });
}

let redis;
try {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });
} catch (error) {
  console.error('Failed to initialize Redis:', error);
}

// CORS handler
const allowCors = (handler) => async (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'https://quiz-app-v2.vercel.app',
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`
  ].filter(Boolean);

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return await handler(req, res);
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Redis is available
  if (!redis) {
    console.error('Redis not initialized - missing environment variables');
    // For development only: return a temporary success to test other parts
    if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
      console.warn('Development mode: Redis unavailable, returning temporary validation success');
      return res.status(200).json({ 
        valid: true,
        user: {
          username: 'dev-user',
          name: 'Development User',
          email: 'dev@example.com',
          picture: null,
          google: false
        },
        warning: 'Redis not configured - using fallback for development'
      });
    }
    return res.status(500).json({ 
      error: 'Server configuration error',
      details: 'Redis connection not available'
    });
  }

  try {
    const { token } = req.body;
    
    console.log('Validating token:', token ? 'Token provided' : 'No token provided');
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Test Redis connection
    try {
      await redis.ping();
      console.log('Redis connection successful');
    } catch (redisError) {
      console.error('Redis connection failed:', redisError);
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: redisError.message
      });
    }

    // Check if token is in session store
    const sessionKey = `session:${token}`;
    console.log('Checking session key:', sessionKey);
    const sessionData = await redis.hgetall(sessionKey);
    console.log('Session data retrieved:', sessionData ? 'Data exists' : 'No data');
    
    if (!sessionData || !sessionData.username) {
      console.log('Invalid or expired session for token');
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Check if session is expired
    if (sessionData.expiresAt && parseInt(sessionData.expiresAt) < Date.now()) {
      console.log('Session expired, deleting key:', sessionKey);
      await redis.del(sessionKey);
      return res.status(401).json({ error: 'Session expired' });
    }

    // Get user data
    const userKey = `user:${sessionData.username}`;
    console.log('Retrieving user data for:', userKey);
    const userData = await redis.hgetall(userKey);
    console.log('User data retrieved:', userData ? 'Data exists' : 'No data');
    
    if (!userData) {
      console.log('User not found for session');
      return res.status(401).json({ error: 'User not found' });
    }

    // Extend session expiry
    const newExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    console.log('Extending session expiry to:', new Date(newExpiresAt).toISOString());
    await redis.hset(sessionKey, 'expiresAt', newExpiresAt.toString());
    await redis.expire(sessionKey, 24 * 60 * 60);
    console.log('Session expiry extended successfully');

    console.log('Validation successful for user:', sessionData.username);
    return res.status(200).json({
      valid: true,
      user: {
        username: userData.username,
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        google: userData.google === 'true'
      }
    });

  } catch (error) {
    console.error('Token validation error:', error);
    return res.status(500).json({ 
      error: 'Failed to validate token',
      details: error.message,
      stack: error.stack 
    });
  }
}

module.exports = allowCors(handler);
module.exports.config = {
  api: {
    bodyParser: true,
  },
};
