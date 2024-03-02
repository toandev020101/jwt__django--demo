import { Box, useTheme } from '@mui/material';
import React from 'react';
import ToastNotify from '../../components/ToastNotify';

const ClientLayout = ({ children }) => {
  const theme = useTheme();

  return (
    <Box>
      <ToastNotify />
      <Box
        bgcolor={theme.palette.grey[100]}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{ width: '100vw', height: '100vh' }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ClientLayout;
