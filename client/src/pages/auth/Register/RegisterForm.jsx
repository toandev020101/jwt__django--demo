import React, { useState } from 'react';
import { Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../../../components/InputField';
import { useNavigate } from 'react-router-dom';
import * as AuthApi from '../../../apis/authApi';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../../contexts/authContext';
import registerSchema from '../../../schemas/registerSchema';

const VERIFY_EMAIL = 'verify_email';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      last_name: '',
      first_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    resolver: yupResolver(registerSchema),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await AuthApi.register(values);
      window.localStorage.setItem(VERIFY_EMAIL, 'true');
      navigate('/xac-minh-email',
        {
          state: {
            notify: {
              type: 'success',
              message: 'Cảm ơn bạn đã đăng ký, Vui lòng xác minh email',
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
        toast.error('Đăng ký thất bại!', { theme: 'colored', toastId: 'authId', autoClose: 1500 });
      } else {
        navigate(`/error/${status}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <Box component={'form'} onSubmit={form.handleSubmit(handleSubmit)}>
      <Box display={'flex'} justifyContent={'space-between'} gap={'10px'}>
        <InputField name="last_name" label="Họ" form={form} type="text" required />
        <InputField name="first_name" label="Tên" form={form} type="text" required />
      </Box>
      <InputField name="email" label="Email" form={form} type="email" required />
      <InputField name="password" label="Mật khẩu" form={form} type="password" required />
      <InputField name="confirm_password" label="Xác nhận mật khẩu" form={form} type="password" required />
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
        Đăng ký
      </LoadingButton>
    </Box>
  );
};

export default RegisterForm;
