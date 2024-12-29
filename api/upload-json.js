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
  } else if (req.method === 'GET') {
    // Handle retrieving the file data from Redis
    const { filename } = req.query; // Get the filename from the query parameters

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required.' });
    }

    try {
      // Fetch the file data from Redis
      const fileData = await redis.get(filename);

      if (!fileData) {
        return res.status(404).json({ error: 'File not found.' });
      }

      // Parse the stored JSON data (if it's in JSON format)
      const parsedData = JSON.parse(fileData);

      return res.status(200).json({ filename, content: parsedData });
    } catch (error) {
      console.error('Error retrieving file:', error);
      return res.status(500).json({ error: 'Failed to retrieve the file.' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}