import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// Google OAuth2 credentials
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Store token after successful OAuth authorization
const storeToken = (token) => {
  return fs.promises.writeFile('./token.json', JSON.stringify(token));
};

// Exchange code for access token
const getAccessToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  await storeToken(tokens);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

// Upload file to Google Drive
const uploadToDrive = async (filePath, mimeType, fileName) => {
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const fileMetadata = {
    name: fileName,
    mimeType: mimeType,
  };

  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });

  return response.data.id;
};

export const config = {
  api: {
    bodyParser: false, // To handle file uploads via FormData
  },
};

export default async function handler(req, res) {
  if (req.method === 'GET' && req.query.code) {
    try {
      const code = req.query.code;
      const token = await getAccessToken(code);
      res.status(200).json({ message: 'Token obtained successfully', token });
    } catch (error) {
      res.status(500).json({ error: 'Failed to obtain the token' });
    }
  }

  if (req.method === 'POST') {
    const { file } = req.body;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const filePath = path.join(__dirname, 'uploads', file.name);
    const mimeType = file.type;

    try {
      // Upload file to Google Drive
      const fileId = await uploadToDrive(filePath, mimeType, file.name);
      res.status(200).json({ message: 'File uploaded successfully', fileId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload file' });
    }
  }
}