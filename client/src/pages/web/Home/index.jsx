import { Avatar, Box, Button, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/authContext';
import JWTManager, { REFRESH_TOKEN_COOKIE_NAME } from '../../../utils/jwt';
import * as UserApi from '../../../apis/userApi';
import { toast } from 'react-toastify';
import * as AuthApi from '../../../apis/authApi';
import { getLocalStorage } from '../../../utils/storage';
import TitlePage from '../../../components/TitlePage';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import updateUserSchema from '../../../schemas/updateUserSchema';
import InputField from '../../../components/InputField';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/system';
import { BiCloud } from 'react-icons/bi';
import RadioGroupField from '../../../components/RadioGroupField';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, logoutClient } = useAuthContext();

  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const form = useForm({
    defaultValues: {
      last_name: '',
      first_name: '',
      email: '',
      gender: '',
      phone_number: '',
      avatar: '',
    },
    resolver: yupResolver(updateUserSchema),
  });

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
    }, 1000);

    if (isAuthenticated) {
      clearTimeout(timeId);
    }

    return () => clearTimeout(timeId);
  }, [navigate, isAuthenticated]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userId = JWTManager.getUserId();
        const res = await UserApi.getOneById(userId);
        const newUser = res.data;
        setUser(newUser);
        setAvatar(newUser.avatar);
        form.reset({
          last_name: newUser.last_name,
          first_name: newUser.first_name,
          email: newUser.email,
          gender: newUser.gender,
          phone_number: newUser.phone_number,
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
    if (isAuthenticated) {
      getUser();
    }
    // eslint-disable-next-line
  }, [navigate, isAuthenticated, reload]);

  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      handleChangeAvatar(file);
    }
  };

  const handleChangeAvatar = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCancelChangeAvatar = () => {
    setAvatar(user.avatar);
    setFile(null);
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();
    if (file) {
      formData.append('avatar', file);
    }
    for (let key in values) {
      formData.append(key, values[key]);
    }

    try {
      const res = await UserApi.updateOne({ id: JWTManager.getUserId(), formData });
      toast.success(res.message, {
        theme: 'colored',
        toastId: 'headerId',
        autoClose: 1500,
      });

      setAvatar(null);
      setFile(null);
      setReload(!reload);
    } catch (error) {
      const { status, message } = error.response;
      if (status === 400 || status === 404) {
        toast.error(message, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      } else {
        navigate(`/error/${status}`);
      }
    }
    setIsLoading(false);
  };

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
    <TitlePage title={'JWT Django - Trang chủ'} />
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      padding={'30px'}
      bgcolor={theme.palette.common.white}
      borderRadius={'5px'}
      boxShadow={'rgba(58, 53, 65, 0.1) 0px 2px 10px 0px'}
      width={'500px'}
      component={'form'} onSubmit={form.handleSubmit(handleSubmit)}
    >
      <Avatar src={avatar} alt="avatar.png" sx={{ width: '150px', height: '150px' }} />
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<BiCloud style={{ fontSize: '25px', marginTop: '-5px' }} />}
        sx={{ textTransform: 'inherit', margin: file ? '20px 0 10px' : '20px 0' }}
      >
        Chọn ảnh đại diện
        <VisuallyHiddenInput onChange={handleUploadFile} type="file"
                             accept="image/png, image/gif, image/jpeg" />
      </Button>
      {file && <Button variant={'contained'} color={'error'}
                       sx={{ marginBottom: '20px', textTransform: 'inherit' }}
                       onClick={handleCancelChangeAvatar}>Hủy</Button>}
      <Box display={'flex'} justifyContent={'space-between'} gap={'10px'}>
        <InputField name="last_name" label="Họ" form={form} type="text" required />
        <InputField name="first_name" label="Tên" form={form} type="text" required />
      </Box>
      <InputField name="email" label="Email" form={form} type="email" required disabled />
      <RadioGroupField name="gender" label="Giới tính" form={form}
                       options={[{ label: 'Nam', value: 'Nam' }, { label: 'Nữ', value: 'Nữ' }]}
                       type="horizontal" />
      <InputField name="phone_number" label="Số điện thoại" form={form} type="text" />
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
          margin: '20px 0 10px',
        }}
      >
        Lưu lại
      </LoadingButton>
      <Button variant={'contained'} fullWidth color={'error'} onClick={handleLogout}
              sx={{ textTransform: 'inherit', height: '45px' }}>Đăng
        xuất</Button>
    </Box>
  </Box>;
};

export default Home;