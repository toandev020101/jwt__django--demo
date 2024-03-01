import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/authContext';
import JWTManager from '../../utils/jwt';
import * as UserApi from '../../apis/userApi';

const ClientLayout = ({ children }) => {
  return (
    <Box>{children}</Box>
  );
};

export default ClientLayout;
