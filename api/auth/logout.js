const { Redis } = require('@upstash/redis');

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
    // Get token from Authorization header or body
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || req.body.token;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Delete session from Redis
    const sessionKey = `session:${token}`;
    await redis.del(sessionKey);

    return res.status(200).json({
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ 
      error: 'Failed to logout',
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
