const { Redis } = require('@upstash/redis');
const crypto = require('crypto');

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
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // For demo purposes, we'll create a simple login
    // In production, you should verify credentials properly
    const userKey = `user:${username}`;
    const userData = await redis.hgetall(userKey);
    
    // Create user if doesn't exist (for demo)
    if (!userData || !userData.username) {
      await redis.hset(userKey, {
        username,
        name: username,
        email: `${username}@example.com`,
        google: 'false'
      });
    }

    // Create session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionKey = `session:${sessionToken}`;
    await redis.hset(sessionKey, {
      username,
      expiresAt: (Date.now() + 24 * 60 * 60 * 1000).toString()
    });
    await redis.expire(sessionKey, 24 * 60 * 60);

    return res.status(200).json({
      message: 'Login successful',
      token: sessionToken,
      user: {
        username,
        name: userData?.name || username,
        email: userData?.email || `${username}@example.com`,
        google: false
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      error: 'Login failed',
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
