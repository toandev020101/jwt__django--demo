import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../../../components/InputField';
import { Link, useNavigate } from 'react-router-dom';
import * as AuthApi from '../../../apis/authApi';
import JWTManager, { REFRESH_TOKEN_COOKIE_NAME } from '../../../utils/jwt';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../../contexts/authContext';
import loginSchema from '../../../schemas/loginSchema';
import { setLocalStorage } from '../../../utils/storage';

const LoginForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useAuthContext();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(loginSchema),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      let res = await AuthApi.login(values);
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
        toast.error('Đăng nhập thất bại!', { theme: 'colored', toastId: 'authId', autoClose: 1500 });
      } else {
        navigate(`/error/${status}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <Box component={'form'} onSubmit={form.handleSubmit(handleSubmit)}>
      <InputField name="email" label="Email" form={form} type="email" required />
      <InputField name="password" label="Mật khẩu" form={form} type="password" required />
      <Link to={'/quen-mat-khau'}
            style={{
              textDecoration: 'none',
              textAlign: 'right',
              display: 'block',
              fontSize: '14px',
              color: theme.palette.primary.main,
            }}>Quên mật
        khẩu ?</Link>
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
        Đăng nhập
      </LoadingButton>
    </Box>
  );
};

export default LoginForm;
