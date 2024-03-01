import React, { useState } from 'react';
import { Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../../../components/InputField';
import { useNavigate } from 'react-router-dom';
import * as AuthApi from '../../../apis/authApi';
import JWTManager from '../../../utils/jwt';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../../contexts/authContext';
import registerSchema from '../../../schemas/registerSchema';
import RadioGroupField from '../../../components/RadioGroupField';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useAuthContext();

  const form = useForm({
    defaultValues: {
      fullname: '',
      gender: 'nam',
      birth_day: '1990-01-01',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(registerSchema),
  });

  const handleSubmit = async (values) => {
    // Extract the date components
    const year = values.birth_day.getFullYear();
    const month = String(values.birth_day.getMonth() + 1).padStart(2, '0');
    const day = String(values.birth_day.getDate()).padStart(2, '0');
    values.birth_day = `${year}-${month}-${day}`;
    setIsLoading(true);
    try {
      let res = await AuthApi.register(values);
      const user = res.result.data;
      JWTManager.setToken(res.result.access_token);
      setIsAuthenticated(true);

      navigate(user.role.code === 'student' ? '/#otp' : '/quan-tri',
        {
          state: {
            notify: {
              type: 'success',
              message: 'Xin chào, ' + user.fullname,
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
          form.setError('email', { type: 'manual', message: data.detail });
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
      <InputField name="fullname" label="Họ và tên" form={form} type="text" required />
      <RadioGroupField name="gender" label="Giới tính" form={form} required
                       options={[{ label: 'Nam', value: 'nam' }, { label: 'Nữ', value: 'nữ' }]}
                       type="horizontal" />
      <InputField name="birth_day" label="Ngày sinh" form={form} type="date" required />
      <InputField name="email" label="Email" form={form} type="email" required />
      <InputField name="password" label="Mật khẩu" form={form} type="password" required />
      <InputField name="confirmPassword" label="Xác nhận mật khẩu" form={form} type="password" required />
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
