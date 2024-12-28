import { Redis } from '@upstash/redis'; // Correct import for the latest Upstash Redis package

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb', // Limit request size to 1MB
    },
  },
};

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL, // Your Upstash Redis URL
  token: process.env.UPSTASH_REDIS_TOKEN, // Your Upstash Redis Token
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { filename, content } = req.body;

      if (!filename || !content) {
        return res.status(400).json({ error: 'Invalid request payload.' });
      }

      // Store the JSON data in Upstash Redis using the filename as the key
      await redis.set(filename, JSON.stringify(content));

      return res.status(200).json({ message: 'File uploaded successfully.' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save the file.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}