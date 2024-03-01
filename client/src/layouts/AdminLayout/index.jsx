import { Box, useTheme } from '@mui/material';
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';


const AdminLayout = ({ children }) => {
  const theme = useTheme();
  return (
    <Box minHeight="100vh" bgcolor={theme.palette.grey[50]} display={'flex'}>
      <Sidebar />

      <Box width={'100%'}>
        <Header />

        {/* content */}
        <Box padding="20px 20px 40px">{children}</Box>
        {/* content */}

        <Footer />
      </Box>
    </Box>
  );
};

export default AdminLayout;