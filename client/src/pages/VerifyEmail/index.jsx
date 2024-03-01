import { Box, FormHelperText, Typography, useTheme } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as AuthApi from '../../apis/authApi';
import OTPInputField from '../../components/OTPInputField';
import { useAuthContext } from '../../contexts/authContext';
import JWTManager from '../../utils/jwt';

const VERIFY_EMAIL = 'verify_email';

const VerifyEmail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!window.localStorage.getItem(VERIFY_EMAIL)) {
      navigate('/dang-ky',
        {
          state: {
            notify: {
              type: 'error',
              message: 'Vui lòng đăng ký tài khoản!',
              options: { theme: 'colored', toastId: 'headerId', autoClose: 1500 },
            },
          },
        });
    }
  }, [navigate]);

  const handleSendOTP = async () => {
    setIsLoading(true);
    try {
      const res = await AuthApi.verifyEmail({ code });
      const data = res.data;
      JWTManager.setToken(data.access_token);
      setIsAuthenticated(true);

      navigate('/',
        {
          state: {
            notify: {
              type: 'success',
              message: `Xin chào, ${data.full_name}`,
              options: { theme: 'colored', toastId: 'headerId', autoClose: 1500 },
            },
          },
        });
      window.localStorage.removeItem(VERIFY_EMAIL);
      setIsLoading(false);
    } catch (err) {
      const { status, data } = err.response;
      if (status === 400 || status === 404) {
        Object.keys(data).forEach(key => {
          setError(data[key][0]);
        });

      } else {
        navigate(`/error/${status}`);
      }
      setIsLoading(false);
    }
  };

  return <Box width={'500px'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}
              gap={'30px'} padding={'50px 40px'} bgcolor={theme.palette.common.white} zIndex={99} borderRadius={'5px'}>
    <Box width={'150px'} height={'150px'} bgcolor={theme.palette.grey[200]} display={'flex'} justifyContent={'center'}
         alignItems={'center'} borderRadius={'50%'}>
      <img src={'/images/email_send.png'} alt={'email send'} width={'100px'} />
    </Box>

    <Box textAlign={'center'}>
      <Typography variant={'h5'}>Xác minh email</Typography>
      <Typography variant={'option'}>Nhập mã gồm 6 số nhận được từ email của bạn vào ô bên dưới.</Typography>
    </Box>

    <Typography variant={'option'} sx={{ marginRight: '10px', color: theme.palette.common.black }}>Mã xác
      minh</Typography>

    <Box>
      <OTPInputField separator={<span>-</span>} value={code} onChange={setCode} length={6} />
      {error ? <FormHelperText error={true}>{error}</FormHelperText> : null}
    </Box>

    <LoadingButton
      loading={isLoading}
      loadingIndicator={'Loading...'}
      variant="contained"
      type="submit"
      sx={{
        textTransform: 'inherit',
        width: '300px',
      }}
      disabled={isLoading}
      onClick={handleSendOTP}
    >
      Xác minh email
    </LoadingButton>
  </Box>;
};

export default VerifyEmail;