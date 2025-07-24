const https = require('https');
const fs = require('fs');
const path = require('path');

const animations = [
  {
    url: 'https://lottie.host/4c2cdd6a-9f84-4a4c-b3b2-c7ed78efda4a/tcjjgmkOAi.json',
    filename: 'loading.json',
    description: 'Loading spinner animation'
  },
  {
    url: 'https://lottie.host/e2c9c667-3695-4b98-8d5e-83b9fbf9b9d5/dxvOUkfpGy.json',
    filename: 'success.json',
    description: 'Success checkmark animation'
  },
  {
    url: 'https://lottie.host/e5b35c85-85a5-4c7c-a84c-73afd2a4d35d/PJDMKgQXYF.json',
    filename: 'quiz.json',
    description: 'Quiz/education themed animation'
  },
  {
    url: 'https://lottie.host/f6ac6897-b6f9-484c-9684-8d1cdb6e4587/Ghm1UxH8Yl.json',
    filename: 'timer.json',
    description: 'Timer countdown animation'
  }
];

const downloadDir = path.join(__dirname, 'src', 'components', 'Animations');

// Create the directory if it doesn't exist
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

animations.forEach(animation => {
  const filePath = path.join(downloadDir, animation.filename);
  
  https.get(animation.url, (response) => {
    const fileStream = fs.createWriteStream(filePath);
    response.pipe(fileStream);

    fileStream.on('finish', () => {
      console.log(`Downloaded ${animation.filename} - ${animation.description}`);
      fileStream.close();
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${animation.filename}: ${err.message}`);
  });
}); 