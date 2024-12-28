import React, { useState } from 'react';
import { Container, Segment, Item, Divider, Button, Message, Icon, Form } from 'semantic-ui-react';

const UploadJSON = () => {
  const [message, setMessage] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUploadSuccess(false);
  };

  const handleUpload = async (event) => {
    if (!selectedFile) {
      setMessage('Please select a file first.');
      return;
    }

    if (selectedFile.type !== 'application/json') {
      setMessage('Please upload a valid JSON file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fileName = selectedFile.name;
        const content = JSON.parse(reader.result);

        const response = await fetch('/api/upload-json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filename: fileName, content }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage('File uploaded successfully!');
          setUploadedFileUrl(`https://drive.google.com/file/d/${data.fileId}`);
          setUploadSuccess(true);
        } else {
          setMessage(data.error || 'Failed to upload file.');
        }
      } catch (error) {
        setMessage('Error uploading file.');
      }
    };

    reader.readAsText(selectedFile);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setUploadSuccess(false);
    }
  };

  return (
    <Container>
      <Segment>
        <Item.Group divided>
          <Item>
            <Item.Content>
              <Item.Header>
                <h1>Upload JSON File</h1>
              </Item.Header>
              <Divider />

              <Form>
                <Form.Field>
                  <label>Drag and Drop File Upload</label>
                  <Segment
                    placeholder
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    style={{
                      border: dragActive ? '2px dashed teal' : '2px dashed grey',
                      padding: '20px',
                      textAlign: 'center',
                    }}
                  >
                    <Icon name="cloud upload" size="huge" color={dragActive ? 'teal' : 'grey'} />
                    <p>{dragActive ? 'Drop your file here!' : 'Drag your file here or click below to select a file'}</p>
                  </Segment>
                  <input type="file" id="file" hidden onChange={handleFileChange} />
                  <Button as="label" htmlFor="file" type="button" color="teal">
                    Choose File
                  </Button>
                  <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                    {selectedFile ? selectedFile.name : 'No file chosen'}
                  </span>
                </Form.Field>

                <Button type="button" color="blue" onClick={handleUpload} disabled={!selectedFile}>
                  Upload
                </Button>

                {uploadSuccess && (
                  <Message positive>
                    <Message.Header>File Uploaded Successfully!</Message.Header>
                    <p>{selectedFile.name} has been uploaded.</p>
                    <p>View it on Google Drive: <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">{uploadedFileUrl}</a></p>
                  </Message>
                )}

                {message && (
                  <Message error={message.includes('Error')} success={message.includes('successfully')} content={message} />
                )}
              </Form>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
    </Container>
  );
};

export default UploadJSON;
