import { Redis } from '@upstash/redis'; // Correct import for the latest Upstash Redis package

// Limit the body size for file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb', // Limit request size to 1MB
    },
  },
};

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL, // Your Upstash Redis URL
  token: process.env.UPSTASH_REDIS_TOKEN, // Your Upstash Redis Token
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Handle file upload
    const { filename, content, exam } = req.body;

    if (!filename || !content) {
      return res.status(400).json({ error: 'Invalid request payload.' });
    }

    try {
      // Store the JSON data in Upstash Redis using the filename as the key
      await redis.set(`${exam}-${filename}`, JSON.stringify(content));
      return res.status(200).json({ message: 'File uploaded successfully.' });

    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({ error: 'Failed to save the file.' });
    }
  } else if (req.method === 'POST' && req.body.filename) {
    // Handle file download
    const { filename } = req.body; // Get filename from the request body

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required.' });
    }

    try {
      // Fetch the file data from Redis
      const fileData = await redis.get(filename);

      if (!fileData) {
        return res.status(404).json({ error: 'File not found.' });
      }

      // Return the file content as JSON
      const parsedData = JSON.parse(fileData);
      return res.status(200).json({ filename, content: parsedData });
    } catch (error) {
      console.error('Error retrieving file:', error);
      return res.status(500).json({ error: 'Failed to retrieve the file.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}