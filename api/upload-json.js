import { google } from 'googleapis';

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
      // Extract the authorization code and file content from the request
      const { code, content, filename } = req.body;

      if (!code || !content || !filename) {
        return res.status(400).json({ error: 'Invalid request payload.' });
      }

      // Initialize the OAuth2 client with your credentials
      const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
      );

      // Get the OAuth2 token using the authorization code
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Use the token to interact with Google Drive API
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const fileMetadata = {
        name: filename,
        mimeType: 'application/json',
      };

      const media = {
        mimeType: 'application/json',
        body: JSON.stringify(content),
      };

      // Upload the file to Google Drive
      const file = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
      });

      return res.status(200).json({ message: 'File uploaded successfully', fileId: file.data.id });
    } catch (error) {
      console.error('Error during file upload:', error);
      return res.status(500).json({ error: 'Failed to upload the file to Google Drive.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}