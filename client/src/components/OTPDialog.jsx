import { Box, Button, Dialog, FormHelperText, Typography, useTheme } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect, useState } from 'react';
import OTPInputField from './OTPInputField';
import { useNavigate } from 'react-router-dom';
import * as AuthApi from '../apis/authApi';
import * as UserApi from '../apis/userApi';
import { toast } from 'react-toastify';
import JWTManager from '../utils/jwt';
import { useAuthContext } from '../contexts/authContext';


const OTP_EXPIRE_MINUTES = 2;

const OTPDialog = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshLoading, setIsRefreshLoading] = useState(false);

  const [otp, setOtp] = useState('');
  const [timeCountDown, setTimeCountDown] = useState(OTP_EXPIRE_MINUTES * 60);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userId = JWTManager.getUserId();
        const res = await UserApi.getOneById(userId);
        const newUser = res.result.data;
        setUser(newUser);
      } catch (err) {
        const { status } = err.response;
        navigate(`/error/${status}`);
      }
    };

    if (isAuthenticated) {
      getUser();
    }
  }, [navigate, isAuthenticated]);

  useEffect(() => {
    const timeId = setInterval(() => {
      setTimeCountDown(prevState => {
        if (prevState > 0) {
          return prevState - 1;
        } else {
          clearInterval(timeId);
          return prevState;
        }
      });
    }, 1000);

    return () => clearInterval(timeId);
  }, [isRefreshLoading]);


  const handleClose = () => {
    setOpen(false);
  };

  const handleRefreshOTP = async () => {
    setIsRefreshLoading(true);
    try {
      const res = await AuthApi.refreshOTP({ email: user.email });
      toast.success(res.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      setTimeCountDown(OTP_EXPIRE_MINUTES * 60);
      setIsRefreshLoading(false);
      setError(null);
      setOtp('');
    } catch (err) {
      const { status, data } = err.response;
      if (status === 400 || status === 404) {
        setError(data.detail);
      } else {
        navigate(`/error/${status}`);
      }
      setIsRefreshLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setIsLoading(true);
    try {
      const res = await AuthApi.verifyEmail({ otp });
      toast.success(res.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      setIsLoading(false);
      handleClose();
    } catch (err) {
      const { status, data } = err.response;
      if (status === 400 || status === 404) {
        setError(data.detail);
      } else {
        navigate(`/error/${status}`);
      }
      setIsLoading(false);
    }
  };

  return <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <Box width={'500px'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}
         gap={'30px'} padding={'30px 40px'}>
      <Box width={'150px'} height={'150px'} bgcolor={theme.palette.grey[200]} display={'flex'} justifyContent={'center'}
           alignItems={'center'} borderRadius={'50%'}>
        <img src={'/images/email_send.png'} alt={'email send'} width={'100px'} />
      </Box>

      <Box textAlign={'center'}>
        <Typography variant={'h5'}>Xác minh email tài khoản</Typography>
        <Typography variant={'option'}>Nhập mã xác minh gồm 6 chữ số nhận được từ email.</Typography>
      </Box>

      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
        <Box>
          <Typography variant={'option'} sx={{ marginRight: '10px', color: theme.palette.common.black }}>Mã xác
            minh</Typography>
          <Typography variant={'option'}
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                      }}>{Math.floor(timeCountDown / 60) < 10 ? '0' : ''}{Math.floor(timeCountDown / 60)} : {timeCountDown % 60 < 10 ? '0' : ''}{timeCountDown % 60}</Typography>
        </Box>

        <LoadingButton
          loading={isRefreshLoading}
          loadingIndicator={'Loading...'}
          variant="text"
          type="submit"
          sx={{
            textTransform: 'inherit',
          }}
          disabled={isRefreshLoading}
          onClick={handleRefreshOTP}
        >
          Gửi lại mã
        </LoadingButton>
      </Box>

      <Box>
        <OTPInputField separator={<span>-</span>} value={otp} onChange={setOtp} length={6} />
        {error ? <FormHelperText error={true}>{error}</FormHelperText> : null}
      </Box>

      <Box display={'flex'} flexDirection={'column'} gap={'10px'}>
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

        <Button
          variant={'text'}
          color={'primary'}
          onClick={handleClose}
          sx={{
            textTransform: 'inherit',
          }}
        >
          Để sau
        </Button>
      </Box>
    </Box>


  </Dialog>;
};

export default OTPDialog;