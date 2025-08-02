import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Fade,
} from '@mui/material';
import Breadcrumbs from '../Breadcrumbs';

const PageContainer = ({
  children,
  title,
  subtitle,
  breadcrumbs,
  actions,
  maxWidth,
  disableGutters,
  sx,
  ...other
}) => {
  const theme = useTheme();

  return (
    <Fade in timeout={300}>
      <Container
        maxWidth={maxWidth}
        disableGutters={disableGutters}
        sx={{
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          ...sx,
        }}
        {...other}
      >
        {/* Page Header */}
        {(title || breadcrumbs || actions) && (
          <Box sx={{ mb: 3 }}>
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Box sx={{ mb: 1 }}>
                <Breadcrumbs items={breadcrumbs} showHome />
              </Box>
            )}

            {/* Title and Actions Row */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              {/* Title Section */}
              {(title || subtitle) && (
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  {title && (
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        mb: subtitle ? 0.5 : 0,
                        fontSize: { xs: '1.5rem', sm: '2rem' },
                      }}
                    >
                      {title}
                    </Typography>
                  )}
                  {subtitle && (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        fontSize: '1rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {subtitle}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Actions Section */}
              {actions && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexShrink: 0,
                  }}
                >
                  {actions}
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* Page Content */}
        <Box sx={{ width: '100%' }}>
          {children}
        </Box>
      </Container>
    </Fade>
  );
};

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      icon: PropTypes.element,
    })
  ),
  actions: PropTypes.node,
  maxWidth: PropTypes.oneOfType([
    PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
    PropTypes.string,
  ]),
  disableGutters: PropTypes.bool,
  sx: PropTypes.object,
};

PageContainer.defaultProps = {
  title: null,
  subtitle: null,
  breadcrumbs: [],
  actions: null,
  maxWidth: false,
  disableGutters: false,
  sx: {},
};

export default PageContainer;
