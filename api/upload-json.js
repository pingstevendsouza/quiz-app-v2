import { Redis } from '@upstash/redis'; // Correct import for the latest Upstash Redis package
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

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

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '651363949873-8b853017h823jadb3mk0ckcrua8fu9bn.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  if (req.method === 'POST' && req.body.type=="upload" ) {
    // Handle file upload
    const { filename, content, exam } = req.body;

    if (!filename || !content) {
      return res.status(400).json({ error: 'Invalid request payload.' });
    }

    try {
      // Store the JSON data in Upstash Redis using the filename as the key
      await redis.set(`${filename}`, JSON.stringify(content));
      return res.status(200).json({ message: 'File uploaded successfully.' });

    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({ error: 'Failed to save the file.' });
    }
  } else if (req.method === 'POST' && req.body.type=="download") {
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

      console.log(fileData)
      //const parsedData = fileData;//JSON.parse(fileData);
      const parsedData = typeof fileData === 'string' ? JSON.parse(fileData) : fileData;

      return res.status(200).json({ filename, content: parsedData });
    } catch (error) {
      console.error('Error retrieving file:', error);
      return res.status(500).json({ error: 'Failed to retrieve the file.' });
    }
  }
  else if (req.method === 'POST' && req.body.type=="json") {
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

      // Return as JSON

      //const parsedData = fileData;//JSON.parse(fileData);
      const parsedData = typeof fileData === 'string' ? JSON.parse(fileData) : fileData;

      return res.status(200).json(parsedData);

    } catch (error) {
      console.error('Error retrieving file:', error);
      return res.status(500).json({ error: 'Failed to retrieve the file.' });
    }
  }
  // AUTH: SIGNUP
  else if (req.method === 'POST' && req.body.type === 'signup') {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }
    try {
      const userKey = `user:${username}`;
      const existingUser = await redis.get(userKey);
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await redis.set(userKey, JSON.stringify({ username, password: hashedPassword }));
      return res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ error: 'Signup failed.' });
    }
  }
  // AUTH: SIGNIN
  else if (req.method === 'POST' && req.body.type === 'signin') {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }
    try {
      const userKey = `user:${username}`;
      const userData = await redis.get(userKey);
      if (!userData) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }
      const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }
      // Generate session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const sessionKey = `session:${sessionToken}`;
      await redis.set(sessionKey, JSON.stringify({ username }), { ex: 60 * 60 * 24 }); // 24h expiry
      return res.status(200).json({ message: 'Signin successful.', token: sessionToken, username });
    } catch (error) {
      console.error('Signin error:', error);
      return res.status(500).json({ error: 'Signin failed.' });
    }
  }
  // GOOGLE SIGNIN
  else if (req.method === 'POST' && req.body.type === 'google-signin') {
    const { credential } = req.body;
    if (!credential) {
      console.error('Google signin error: Missing credential', req.body);
      return res.status(400).json({ error: 'Missing Google credential.' });
    }
    try {
      // Verify Google token
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        console.error('Google signin error: Invalid payload', payload);
        return res.status(401).json({ error: 'Invalid Google token.' });
      }
      const username = payload.email;
      const userKey = `user:${username}`;
      let userData = await redis.get(userKey);
      if (!userData) {
        // Create user if not exists
        await redis.set(userKey, JSON.stringify({ username, google: true }));
      }
      // Generate session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const sessionKey = `session:${sessionToken}`;
      await redis.set(sessionKey, JSON.stringify({ username }), { ex: 60 * 60 * 24 }); // 24h expiry
      return res.status(200).json({ message: 'Google signin successful.', token: sessionToken, username });
    } catch (error) {
      console.error('Google signin error:', error.message, error.stack, { credential });
      return res.status(401).json({ error: 'Google sign in failed.' });
    }
  }
  else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}