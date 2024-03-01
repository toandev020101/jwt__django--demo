import { Backdrop, CircularProgress, useTheme } from '@mui/material';
import React from 'react';

const LoadingPage = () => {
  const theme = useTheme();
  return (
    <Backdrop sx={{ color: theme.palette.common.white, zIndex: 999 }} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LoadingPage;
