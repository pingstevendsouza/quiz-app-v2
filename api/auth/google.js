const { Redis } = require('@upstash/redis');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');

// Enable CORS for all methods
const config = {
  api: {
    bodyParser: true,
  },
};

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '651363949873-8b853017h823jadb3mk0ckcrua8fu9bn.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Handle CORS preflight
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
  if (req.method === 'POST') {
    try {
      const { credential } = req.body;
      
      if (!credential) {
        return res.status(400).json({ error: 'Missing Google credential' });
      }

      // Verify Google token
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res.status(401).json({ error: 'Invalid Google token' });
      }

      const username = payload.email;
      const userKey = `user:${username}`;
      
      // Create or update user using hset
      await redis.hset(userKey, {
        username,
        name: payload.name,
        picture: payload.picture,
        email: payload.email,
        google: 'true'  // Storing as string since Redis doesn't have boolean type
      });

      // Create session using hset
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const sessionKey = `session:${sessionToken}`;
      await redis.hset(sessionKey, {
        username,
        expiresAt: (Date.now() + 24 * 60 * 60 * 1000).toString() // 24 hours from now
      });
      await redis.expire(sessionKey, 24 * 60 * 60); // 24 hours expiry

      return res.status(200).json({
        message: 'Google sign-in successful',
        token: sessionToken,
        user: {
          username,
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
          photoURL: payload.picture, // Add photoURL for compatibility
          google: {
            picture: payload.picture // Add nested structure for compatibility
          }
        }
      });

    } catch (error) {
      console.error('Google sign-in error:', error);
      return res.status(500).json({ 
        error: 'Google sign-in failed',
        details: error.message 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Export the handler with CORS support
module.exports = allowCors(handler);
module.exports.config = config;
