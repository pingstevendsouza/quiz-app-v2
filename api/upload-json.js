// Use require instead of import
const { createClient } = require('@upstash/redis');
const { config } = require('dotenv');

// Load environment variables
config();

// Initialize Upstash Redis client
const redis = createClient({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb', // Limit request size to 1MB
    },
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { filename, content, category } = req.body;

      if (!filename || !content) {
        return res.status(400).json({ error: 'Invalid request payload.' });
      }

      // Create a unique Redis key (could include category or filename)
      const redisKey = `upload:${category}:${filename}`;

      // Save the JSON content as a string in Redis
      await redis.set(redisKey, JSON.stringify(content));

      return res.status(200).json({ message: 'File uploaded successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to save the file in Redis.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}