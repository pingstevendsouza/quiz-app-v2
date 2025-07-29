const { Redis } = require('@upstash/redis');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Check if token is in session store
    const sessionKey = `session:${token}`;
    const sessionData = await redis.hgetall(sessionKey);
    
    if (!sessionData || !sessionData.username) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Check if session is expired
    if (sessionData.expiresAt && parseInt(sessionData.expiresAt) < Date.now()) {
      await redis.del(sessionKey);
      return res.status(401).json({ error: 'Session expired' });
    }

    // Get user data
    const userKey = `user:${sessionData.username}`;
    const userData = await redis.hgetall(userKey);
    
    if (!userData) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Extend session expiry
    const newExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await redis.hset(sessionKey, 'expiresAt', newExpiresAt.toString());
    await redis.expire(sessionKey, 24 * 60 * 60);

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
      details: error.message 
    });
  }
}

module.exports = allowCors(handler);
module.exports.config = {
  api: {
    bodyParser: true,
  },
};
