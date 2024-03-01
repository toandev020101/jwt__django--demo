import { Box, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/authContext';
import * as UserApi from '../../apis/userApi';
import JWTManager from '../../utils/jwt';
import ToastNotify from '../../components/ToastNotify';

const AuthLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();


  useEffect(() => {
    const getUser = async () => {
      const res = await UserApi.getOneById(JWTManager.getUserId());
      const user = res.result.data;
      navigate(user.role.code === 'student' ? '/' : '/quan-tri');
    };

    if (isAuthenticated) {
      getUser();
    }
  }, [navigate, isAuthenticated]);

  return (
    <Box position={'relative'}>
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

      <img
        src="/images/auth-v1-mask-light.png"
        alt="mask_light"
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100vw' }}
      />
      <img src="/images/auth-v1-tree.png" alt="tree_1" style={{ position: 'absolute', bottom: 0, left: 0 }} />
      <img src="/images/auth-v1-tree-2.png" alt="tree_2" style={{ position: 'absolute', bottom: 0, right: 0 }} />
    </Box>
  );
};

export default AuthLayout;
