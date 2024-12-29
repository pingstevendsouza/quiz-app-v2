import React, { useState } from 'react';
import {
  Container,
  Segment,
  Item,
  Button,
  Message,
  Icon,
  Form,
  Divider,
  Dropdown,
  Grid,
  Popup
} from 'semantic-ui-react';
import { EXAMS } from '../../constants';

const UploadJSON = () => {
  const [message, setMessage] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [exam, setExam] = useState(1);
  const [processing, setProcessing] = useState(false);

  const [filename, setFilename] = useState('');
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setError(null);

    try {
      // Trigger the file download
      const response = await fetch('/api/upload-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: `${exam}.json` }), // Pass the filename for download
      });

      if (response.ok) {
        const data = await response.json();
        const fileContent = JSON.stringify(data.content, null, 2); // Format the JSON content

        const blob = new Blob([fileContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element to download the file
        const a = document.createElement('a');
        a.href = url;
        a.download = `${exam}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url); // Clean up the URL
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to download the file');
      }
    } catch (error) {
      setError('Error downloading the file');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setMessage('');
    if (file && file.type === 'application/json') {
      if (`${exam}.json` !== file.name) {
        setMessage('Please upload file with the same filename as the download filename.');
        setFilename(file.name);
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
      }
    } else {
      setMessage('Please upload a valid JSON file.');
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('No file selected.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fileName = selectedFile.name; // Use the original file name
        const content = JSON.parse(reader.result);

        const response = await fetch('/api/upload-json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: fileName,
            content,
            exam,
          }),
        });

        if (response.ok) {
          setMessage('File uploaded successfully!');
          setUploadedFileUrl(`${window.location.origin}/uploads/${fileName}`);
        } else {
          setMessage('Failed to upload file.');
        }
      } catch (error) {
        setMessage('Error reading or uploading file.');
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

    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      setSelectedFile(file);
      setMessage('');
    } else {
      setMessage('Please upload a valid JSON file.');
      setSelectedFile(null);
    }
  };

  return (
    <Container>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Content>
              <Item.Header>
                <h1>Upload Questions</h1>
              </Item.Header>
              <Divider />
              <Form>
                <Form.Field>
                  <p>Select Exam?</p>

                  <Grid columns={2}>
                    <Grid.Row>
                      <Grid.Column width={13}>
                        <Dropdown
                          fluid
                          selection
                          name="exams"
                          placeholder="Select Exam"
                          options={EXAMS}
                          value={exam}
                          onChange={(e, { value }) => setExam(value)}
                          disabled={processing}
                        />
                      </Grid.Column>
                      <Grid.Column width={2}>
                        {exam !== 1 && (
                          <Popup content="Download existing JSON file" trigger={
                            <Button
                              color="primary"
                              icon="download"
                              content={`${exam}.json`}
                              onClick={handleDownload}
                              labelPosition="left"
                            />
                          } />
                        )}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <br />
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
                    <Icon
                      name="cloud upload"
                      size="huge"
                      color={dragActive ? 'teal' : 'grey'}
                    />
                    <p>
                      {dragActive
                        ? 'Drop your file here!'
                        : 'Drag your file here or click below to select a file'}
                    </p>
                  </Segment>
                  <input
                    type="file"
                    id="file"
                    hidden
                    accept=".json"
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
              </Form>
              {message && (
                <Message color={message.includes('successfully') ? 'green' : 'red'}>
                  {message}
                </Message>
              )}
              {uploadedFileUrl && (
                <Message positive>
                  <Message.Header>File URL</Message.Header>
                  <p>
                    <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">
                      {uploadedFileUrl}
                    </a>
                  </p>
                </Message>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
    </Container>
  );
};

export default UploadJSON;