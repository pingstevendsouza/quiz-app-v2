import React, { Fragment, useState } from 'react';
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from '@mui/material';
import {
  Share,
  Twitter,
  Facebook,
  LinkedIn,
  WhatsApp,
  Email,
} from '@mui/icons-material';

const ShareButton = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          text: 'Check out this quiz app — it rocks!',
          url: window.location.href,
        })
        .then(() => console.log('Successfully shared'))
        .catch(error => console.log(error.message));
    } else {
      setOpen(true);
    }
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: <Twitter />,
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this quiz app!`,
    },
    {
      name: 'Facebook',
      icon: <Facebook />,
      color: '#4267B2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
    },
    {
      name: 'LinkedIn',
      icon: <LinkedIn />,
      color: '#0077B5',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
    },
    {
      name: 'WhatsApp',
      icon: <WhatsApp />,
      color: '#25D366',
      url: `https://wa.me/?text=Check out this quiz app! ${window.location.href}`,
    },
    {
      name: 'Email',
      icon: <Email />,
      color: '#EA4335',
      url: `mailto:?subject=Check out this quiz app&body=${window.location.href}`,
    },
  ];

  return (
    <Fragment>
      <Button
        variant="contained"
        startIcon={<Share />}
        onClick={handleClick}
        sx={{
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          color: 'white',
          px: 3,
          py: 1.5,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px 2px rgba(102, 126, 234, .3)',
          },
        }}
      >
        Share
      </Button>
      
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Share on</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', py: 2 }}>
            {shareLinks.map((link) => (
              <IconButton
                key={link.name}
                onClick={() => window.open(link.url, '_blank')}
                sx={{
                  width: 60,
                  height: 60,
                  backgroundColor: link.color,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: link.color,
                    opacity: 0.8,
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {link.icon}
              </IconButton>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default ShareButton;
