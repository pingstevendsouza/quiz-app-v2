import fs from 'fs';
import path from 'path';

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

      const targetPath = path.join(process.cwd(), 'public', filename);

      // Save the JSON content to the public folder
      fs.writeFileSync(targetPath, JSON.stringify(content, null, 2));

      return res.status(200).json({ message: 'File uploaded successfully.' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save the file.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}