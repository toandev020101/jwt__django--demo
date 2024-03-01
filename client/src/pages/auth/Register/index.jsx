import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import RegisterForm from './RegisterForm';
import { Link } from 'react-router-dom';
import TitlePage from '../../../components/TitlePage';
import { HiPuzzle } from 'react-icons/hi';

const Register = () => {
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
      <TitlePage title="EngQuizz - Đăng ký" />
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={'10px'} marginBottom={'20px'}>
        <HiPuzzle fontSize={45} style={{ color: theme.palette.primary.main, marginTop: '-15px' }} />
        <Typography variant="h5" sx={{ fontWeight: 600, textTransform: 'uppercase', color: theme.palette.grey[700] }}>
          EngQuizz
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.grey[700] }}>
        Cuộc phiêu lưu bắt đầu từ đây 🚀
      </Typography>

      <Typography sx={{ margin: '10px 0 20px 0', fontSize: '15px', color: theme.palette.grey[600] }}>
        Làm cho việc quản lý ứng dụng của bạn trở nên dễ dàng và thú vị!
      </Typography>

      <RegisterForm />

      <Typography sx={{ color: theme.palette.grey[600], fontSize: '15px', textAlign: 'center' }}>
        Bạn đã có sẵn một tài khoản ?{' '}
        <Link to="/dang-nhap" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
          Hãy đăng nhập
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;
