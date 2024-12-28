import React, { useState } from 'react';
import {
  Container,
  Segment,
  Item,
  Divider,
  Button,
  Message,
  Icon,
  Form
} from 'semantic-ui-react';

const UploadJSON = () => {
  const [message, setMessage] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Redirect the user to Google OAuth 2.0 login
  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    const file = selectedFile;
    if (!file || file.type !== 'application/json') {
      setMessage('Please upload a valid JSON file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/upload-json`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        setMessage('File uploaded successfully!');
        setUploadedFileUrl(`https://drive.google.com/file/d/${responseData.fileId}/view`);
      } else {
        setMessage('Failed to upload file.');
      }
    } catch (error) {
      setMessage('Error uploading file.');
    }
  };

  return (
    <Container>
      <Segment>
        <Item.Group divided>
          <Item>
            <Item.Content>
              <Item.Header>
                <h1>Upload JSON File to Google Drive</h1>
              </Item.Header>
              <Divider />

              {/* Google OAuth Login Button */}
              <Button onClick={handleLogin}>Login with Google</Button>

              <Divider />
              <Form>
                <Form.Field>
                  <label>Drag and Drop File Upload</label>
                  <Segment
                    placeholder
                    onDragEnter={(e) => setDragActive(true)}
                    onDragLeave={(e) => setDragActive(false)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(false);
                      const file = e.dataTransfer.files[0];
                      setSelectedFile(file);
                    }}
                    style={{
                      border: dragActive ? '2px dashed teal' : '2px dashed grey',
                      padding: '20px',
                      textAlign: 'center',
                    }}
                  >
                    <Icon name="cloud upload" size="huge" color={dragActive ? 'teal' : 'grey'} />
                    <p>{dragActive ? 'Drop your file here!' : 'Drag your file here or click below to select a file'}</p>
                  </Segment>
                  <input
                    type="file"
                    id="file"
                    hidden
                    onChange={handleFileChange}
                  />
                  <Button as="label" htmlFor="file" type="button" color="teal">
                    Choose File
                  </Button>
                  <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                    {selectedFile ? selectedFile.name : 'No file chosen'}
                  </span>
                </Form.Field>
                <Button
                  type="button"
                  color="blue"
                  onClick={handleUpload}
                  disabled={!selectedFile}
                >
                  Upload
                </Button>

                {message && <Message>{message}</Message>}
              </Form>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
    </Container>
  );
};

export default UploadJSON;
