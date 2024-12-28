import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json'); // Token file for OAuth2 credentials

const auth = new google.auth.OAuth2(
  process.env.CLIENT_ID, 
  process.env.CLIENT_SECRET, 
  process.env.REDIRECT_URI
);

// Load OAuth2 credentials (from token.json) and authorize
const authorize = async () => {
  const credentials = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
  auth.setCredentials(credentials);
  return google.drive({ version: 'v3', auth });
};

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
      const { filename, content } = req.body;

      if (!filename || !content) {
        return res.status(400).json({ error: 'Invalid request payload.' });
      }

      // Generate a buffer from the content to simulate file creation
      const buffer = Buffer.from(JSON.stringify(content, null, 2));

      // Authenticate and upload file to Google Drive
      const drive = await authorize();

      const fileMetadata = {
        name: filename,
        mimeType: 'application/json',
      };

      const media = {
        mimeType: 'application/json',
        body: buffer,
      };

      const file = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name',
      });

      res.status(200).json({
        message: 'File uploaded successfully.',
        fileId: file.data.id,
        fileName: file.data.name,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload file to Google Drive.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}