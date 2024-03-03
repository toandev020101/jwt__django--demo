import { Box, Typography, useTheme } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as AuthApi from '../../../apis/authApi';
import TitlePage from '../../../components/TitlePage';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import resetPasswordSchema from '../../../schemas/resetPasswordSchema';
import JWTManager, { REFRESH_TOKEN_COOKIE_NAME } from '../../../utils/jwt';
import { setLocalStorage } from '../../../utils/storage';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../../contexts/authContext';
import InputField from '../../../components/InputField';
import { HiPuzzle } from 'react-icons/hi';

const ResetPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();
  const { uidb64, token } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      new_password: '',
      new_password_confirm: '',
    },
    resolver: yupResolver(resetPasswordSchema),
  });

  const handleSubmit = async (values) => {
    values.uidb64 = uidb64;
    values.token = token;

    setIsLoading(true);
    try {
      let res = await AuthApi.resetPassword(values);
      const data = res.data;
      JWTManager.setToken(data.access_token);
      setIsAuthenticated(true);
      setLocalStorage(REFRESH_TOKEN_COOKIE_NAME, data.refresh_token);

      navigate('/', {
        state: {
          notify: {
            type: 'success',
            message: 'Xin chào, ' + data.full_name,
            options: { theme: 'colored', toastId: 'headerId', autoClose: 1500 },
          },
        },
      });
      form.reset();
      setIsLoading(false);
    } catch (error) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        if (status === 400) {
          Object.keys(data).forEach(key => {
            form.setError(key, { type: 'manual', message: data[key][0] });
          });
        }
        toast.error('Thay đổi mật khẩu thất bại!', { theme: 'colored', toastId: 'authId', autoClose: 1500 });
      } else {
        navigate(`/error/${status}`);
      }
      setIsLoading(false);
    }
  };

  return <Box zIndex={99}>
    <TitlePage title={'JWT Django - Thay đổi mật khẩu'} />

    <Box width={'500px'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}
         padding={'50px 40px'} bgcolor={theme.palette.common.white} borderRadius={'5px'} component={'form'}
         onSubmit={form.handleSubmit(handleSubmit)}>

      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={'10px'} marginBottom={'20px'}>
        <HiPuzzle fontSize={45} style={{ color: theme.palette.primary.main, marginTop: '-15px' }} />
        <Typography variant="h5" sx={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 600,
          textTransform: 'uppercase',
          color: theme.palette.grey[700],
        }}>
          JWT Django
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.grey[700] }}>
        Thiết lập lại mật khẩu
      </Typography>

      <Typography sx={{ margin: '10px 0 20px 0', fontSize: '15px', color: theme.palette.grey[600] }}>
        Vui lòng điền mật khẩu mới cho tài khoản của bạn và bắt đầu cuộc phiêu lưu
      </Typography>

      <InputField name="new_password" label="Mật khẩu mới" form={form} type="password" required />
      <InputField name="new_password_confirm" label="Nhập lại mật khẩu mới" form={form} type="password" required />
      <LoadingButton
        variant="contained"
        loading={isLoading}
        loadingIndicator="Loading…"
        type="submit"
        fullWidth
        disabled={isLoading}
        sx={{
          textTransform: 'inherit',
          height: '45px',
          fontWeight: 600,
          margin: '20px 0',
        }}
      >
        Đặt lại mật khẩu
      </LoadingButton>
    </Box>
  </Box>;
};

export default ResetPassword;