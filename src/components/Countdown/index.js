import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Chip, useTheme, Dialog, DialogContent } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { TimerAnimation } from '../Animations';

const Countdown = ({ countdownTime, timeOver, setTimeTaken }) => {
  const theme = useTheme();
  const [timerDays, setTimerDays] = useState('00');
  const [timerHours, setTimerHours] = useState('00');
  const [timerMinutes, setTimerMinutes] = useState('00');
  const [timerSeconds, setTimerSeconds] = useState('00');
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    let timeInterval;

    const countdownTimer = () => {
      const countdownDate = startTime + countdownTime * 1000;

      timeInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        const timeTaken = now - startTime;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
          clearInterval(timeInterval);
          setTimerDays('00');
          setTimerHours('00');
          setTimerMinutes('00');
          setTimerSeconds('00');
          setTimeTaken(timeTaken);
          setShowTimeUpDialog(true);
          setTimeout(() => {
            setShowTimeUpDialog(false);
            timeOver(timeTaken);
          }, 3000);
        } else {
          setTimerDays(days < 10 ? `0${days}` : days);
          setTimerHours(hours < 10 ? `0${hours}` : hours);
          setTimerMinutes(minutes < 10 ? `0${minutes}` : minutes);
          setTimerSeconds(seconds < 10 ? `0${seconds}` : seconds);
          setTimeTaken(timeTaken);
        }
      }, 1000);
    };

    countdownTimer();
    return () => clearInterval(timeInterval);
  }, [countdownTime, timeOver, setTimeTaken]);

  const isTimeRunningOut = parseInt(timerMinutes) < 5 && parseInt(timerHours) === 0;

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          icon={<AccessTime fontSize="small" />}
          label={
            <Typography variant="body2" fontWeight={600}>
              {timerHours !== '00' ? `${timerHours}:` : ''}
              {timerMinutes}:{timerSeconds}
            </Typography>
          }
          sx={{
            bgcolor: isTimeRunningOut ? theme.palette.error.light : theme.palette.primary.light,
            color: isTimeRunningOut ? theme.palette.error.dark : theme.palette.primary.dark,
            fontWeight: 600,
            '& .MuiChip-icon': {
              color: isTimeRunningOut ? theme.palette.error.dark : theme.palette.primary.dark,
            },
            px: 0.5,
          }}
        />
      </Box>

      <Dialog
        open={showTimeUpDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            textAlign: 'center',
          },
        }}
      >
        <DialogContent>
          <Box sx={{ maxWidth: 200, mx: 'auto', mb: 2 }}>
            <TimerAnimation size={150} />
          </Box>
          <Typography variant="h5" gutterBottom fontWeight={600} color="error">
            Time's Up!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Let's see how you did...
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

Countdown.propTypes = {
  countdownTime: PropTypes.number.isRequired,
  timeOver: PropTypes.func.isRequired,
  setTimeTaken: PropTypes.func.isRequired,
};

export default Countdown;
