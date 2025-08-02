import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
  Card as MuiCard,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Divider,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

const Card = ({
  children,
  title,
  subtitle,
  avatar,
  action,
  headerAction,
  actions,
  elevation,
  variant,
  sx,
  headerSx,
  contentSx,
  actionsSx,
  divider,
  ...other
}) => {
  const theme = useTheme();

  const hasHeader = title || subtitle || avatar || action || headerAction;
  const hasActions = actions;

  return (
    <MuiCard
      elevation={elevation}
      variant={variant}
      sx={{
        borderRadius: 2,
        border: variant === 'outlined' ? `1px solid ${theme.palette.divider}` : 'none',
        transition: theme.transitions.create(['box-shadow', 'transform'], {
          duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
          boxShadow: theme.shadows[4],
        },
        ...sx,
      }}
      {...other}
    >
      {/* Card Header */}
      {hasHeader && (
        <>
          <CardHeader
            avatar={avatar}
            action={
              headerAction || (action && (
                <IconButton aria-label="settings" size="small">
                  <MoreVertIcon />
                </IconButton>
              ))
            }
            title={
              title && (
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    color: theme.palette.text.primary,
                  }}
                >
                  {title}
                </Typography>
              )
            }
            subheader={
              subtitle && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    fontSize: '0.875rem',
                  }}
                >
                  {subtitle}
                </Typography>
              )
            }
            sx={{
              pb: divider ? 1 : 2,
              ...headerSx,
            }}
          />
          {divider && <Divider />}
        </>
      )}

      {/* Card Content */}
      <CardContent
        sx={{
          pt: hasHeader && !divider ? 0 : 2,
          pb: hasActions ? 1 : 2,
          '&:last-child': {
            pb: hasActions ? 1 : 2,
          },
          ...contentSx,
        }}
      >
        {children}
      </CardContent>

      {/* Card Actions */}
      {hasActions && (
        <>
          {divider && <Divider />}
          <CardActions
            sx={{
              px: 2,
              py: 1.5,
              justifyContent: 'flex-end',
              ...actionsSx,
            }}
          >
            {actions}
          </CardActions>
        </>
      )}
    </MuiCard>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  avatar: PropTypes.element,
  action: PropTypes.bool,
  headerAction: PropTypes.element,
  actions: PropTypes.node,
  elevation: PropTypes.number,
  variant: PropTypes.oneOf(['elevation', 'outlined']),
  sx: PropTypes.object,
  headerSx: PropTypes.object,
  contentSx: PropTypes.object,
  actionsSx: PropTypes.object,
  divider: PropTypes.bool,
};

Card.defaultProps = {
  title: null,
  subtitle: null,
  avatar: null,
  action: false,
  headerAction: null,
  actions: null,
  elevation: 1,
  variant: 'elevation',
  sx: {},
  headerSx: {},
  contentSx: {},
  actionsSx: {},
  divider: false,
};

export default Card;
