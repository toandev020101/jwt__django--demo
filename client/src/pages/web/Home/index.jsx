import { Button, Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/authContext';
import JWTManager, { REFRESH_TOKEN_COOKIE_NAME } from '../../../utils/jwt';
import * as UserApi from '../../../apis/userApi';
import { toast } from 'react-toastify';
import * as AuthApi from '../../../apis/authApi';
import { getLocalStorage } from '../../../utils/storage';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logoutClient } = useAuthContext();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const timeId = setTimeout(() => {
      navigate('/dang-nhap', {
        state: {
          notify: {
            type: 'error',
            message: 'Vui lòng đăng nhập!',
            options: { theme: 'colored', toastId: 'authId', autoClose: 1500 },
          },
        },
      });
    }, 200);

    if (isAuthenticated) {
      clearTimeout(timeId);
    }

    return () => clearTimeout(timeId);
  }, [isAuthenticated]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userId = JWTManager.getUserId();
        const res = await UserApi.getOneById(userId);
        const newUser = res.data;
        setUser(newUser);
      } catch (error) {
        const { status, data } = error.response;
        console.log(error.response);
        if (status === 400 || status === 404) {
          toast.error(data.message, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
        } else {
          navigate(`/error/${status}`);
        }
      }
    };
    if (isAuthenticated) {
      getUser();
    }
  }, [navigate, isAuthenticated]);

  const handleLogout = async () => {
    try {
      const refresh_token = getLocalStorage(REFRESH_TOKEN_COOKIE_NAME);
      const res = await AuthApi.logout({ refresh_token });
      logoutClient();
      navigate('/dang-nhap', {
        state: {
          notify: {
            type: 'success',
            message: res.message,
            options: { theme: 'colored', toastId: 'authId', autoClose: 1500 },
          },
        },
      });
    } catch (error) {
      const { status, message } = error.response;
      if (status === 400 || status === 404) {
        toast.error(message, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      } else {
        navigate(`/error/${status}`);
      }
    }
  };

  return <Box>
    <Button variant={'contained'} color={'error'} onClick={handleLogout}>Đăng xuất</Button>
  </Box>;
};

export default Home;