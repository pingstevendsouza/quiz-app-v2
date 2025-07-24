import React, { useState } from 'react';
import { Menu, Button, Dropdown } from 'semantic-ui-react';

const Header = ({ onMenuSelect }) => {
  const [promptEvent, setPromptEvent] = useState(null);
  const [appAccepted, setAppAccepted] = useState(false);

  const handleItemClick = (item) => {
    onMenuSelect(item); // Pass the selected item to the App component
  };

  let isAppInstalled = false;

  if (window.matchMedia('(display-mode: standalone)').matches || appAccepted) {
    isAppInstalled = true;
  }

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    setPromptEvent(e);
  });

  const installApp = () => {
    promptEvent.prompt();
    promptEvent.userChoice.then(result => {
      if (result.outcome === 'accepted') {
        setAppAccepted(true);
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
    });
  };

  return (
    <Menu stackable inverted>
      <Menu.Item header>
        <h1>ServiceNow Quiz</h1>
      </Menu.Item>
      <Menu.Item position='left'>
        <Dropdown
          floating
          icon='setting'
       >
      <Dropdown.Menu>
        <Dropdown.Header>Exams</Dropdown.Header>
        <Dropdown.Item onClick={() => handleItemClick('Create')}>Create</Dropdown.Item>
        <Dropdown.Item onClick={() => handleItemClick('Update')}>Update</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
      </Menu.Item>
      {promptEvent && !isAppInstalled && (
        <Menu.Item position="right">
          <Button
            color="teal"
            icon="download"
            labelPosition="left"
            content="Install App"
            onClick={installApp}
          />
        </Menu.Item>
      )}
    </Menu>
  );
};

export default Header;
