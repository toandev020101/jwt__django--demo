import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OTPDialog from '../../components/OTPDialog';
import { useAuthContext } from '../../contexts/authContext';
import JWTManager from '../../utils/jwt';
import * as UserApi from '../../apis/userApi';

const ClientLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userId = JWTManager.getUserId();
        const res = await UserApi.getOneById(userId);
        const newUser = res.result.data;
        setUser(newUser);
      } catch (err) {
        const { status } = err.response;
        navigate(`/error/${status}`);
      }
    };

    if (isAuthenticated) {
      getUser();
    }
  }, [navigate, isAuthenticated]);

  return (
    <Box>
      {location.hash === '#otp' && isAuthenticated && user && !user.is_verified ? <OTPDialog /> : null}
      <Box>{children}</Box>
    </Box>
  );
};

export default ClientLayout;
