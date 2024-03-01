import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import LoginForm from './LoginForm';
import { Link } from 'react-router-dom';
import TitlePage from '../../../components/TitlePage';
import { HiPuzzle } from 'react-icons/hi';

const Login = () => {
  const theme = useTheme();
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      padding={'30px'}
      bgcolor={theme.palette.common.white}
      borderRadius={'5px'}
      boxShadow={'rgba(58, 53, 65, 0.1) 0px 2px 10px 0px'}
      width={'430px'}
      zIndex={99}
    >
      <TitlePage title="EngQuizz - Đăng nhập" />
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={'10px'} marginBottom={'20px'}>
        <HiPuzzle fontSize={45} style={{ color: theme.palette.primary.main, marginTop: '-15px' }} />
        <Typography variant="h5" sx={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 600,
          textTransform: 'uppercase',
          color: theme.palette.grey[700],
        }}>
          EngQuizz
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.grey[700] }}>
        Chào mừng đến với EngQuizz! 👋🏻
      </Typography>

      <Typography sx={{ margin: '10px 0 20px 0', fontSize: '15px', color: theme.palette.grey[600] }}>
        Vui lòng đăng nhập vào tài khoản của bạn và bắt đầu cuộc phiêu lưu
      </Typography>

      <LoginForm />

      <Typography sx={{ color: theme.palette.grey[600], fontSize: '15px', textAlign: 'center' }}>
        Mới trên nền tảng của chúng tôi?{' '}
        <Link to="/dang-ky" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
          Tạo một tài khoản
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
