import TitlePage from '../../../components/TitlePage';
import { Box, FormHelperText, TextField, Typography, useTheme } from '@mui/material';
import { HiPuzzle } from 'react-icons/hi';
import React, { Fragment, useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as AuthApi from '../../../apis/authApi';
import OTPInputField from '../../../components/OTPInputField';
import PasswordField from '../../../components/PasswordField';
import { useAuthContext } from '../../../contexts/authContext';
import JWTManager from '../../../utils/jwt';

const OTP_EXPIRE_MINUTES = 2;

const ForgotPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();

  const [email, setEmail] = useState(null);
  const [otp, setOtp] = useState('');
  const [timeCountDown, setTimeCountDown] = useState(OTP_EXPIRE_MINUTES * 60);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmNewPassword, setConfirmNewPassword] = useState(null);

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshLoading, setIsRefreshLoading] = useState(false);
  const [error, setError] = useState(null);

  const messages = [
    'Điền email gắn với tài khoản của bạn để nhận mã xác minh thay đổi mật khẩu.',
    'Nhập mã xác minh gồm 6 chữ số nhận được từ email.',
    'Bạn nên sử dụng mật khẩu mạnh mà mình chưa sử dụng ở đâu khác.',
  ];

  const btnTexts = ['Gửi mã', 'Xác nhận', 'Đặt lại mật khẩu'];


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

  const handleRefreshOTP = async () => {
    setIsRefreshLoading(true);
    try {
      await AuthApi.refreshOTP({ email });
      setTimeCountDown(OTP_EXPIRE_MINUTES * 60);
      setIsRefreshLoading(false);
      setError(null);
      setOtp('');
    } catch (error) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        setError(data.detail);
      } else {
        navigate(`/error/${status}`);
      }
      setIsRefreshLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let res;
      if (step === 0) {
        setIsRefreshLoading(true);
        res = await AuthApi.sendOTPPassword({ email });
        setStep(prevState => prevState + 1);
        setTimeCountDown(OTP_EXPIRE_MINUTES * 60);
        setIsRefreshLoading(false);
      } else if (step === 1) {
        res = await AuthApi.verifyOTPPassword({ email, otp });
        setStep(prevState => prevState + 1);
      } else {
        if (newPassword !== confirmNewPassword) {
          setError('Không giống mật khẩu mới!');
          return;
        }
        res = await AuthApi.forgotPassword({ email, new_password: newPassword, otp });
        JWTManager.setToken(res.result.access_token);
        setIsAuthenticated(true);
        const user = res.result.data;

        navigate(user.role.code === 'student' ? '/' : '/quan-tri', {
          state: {
            notify: {
              type: 'success',
              message: res.detail,
              options: { theme: 'colored', toastId: 'headerId', autoClose: 1500 },
            },
          },
        });
      }
      toast.success(res.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      setIsLoading(false);
      setError(null);
    } catch (err) {
      const { status, data } = err.response;
      if (status === 400 || status === 404) {
        setError(data.detail);
        toast.error('Thay đổi mật khẩu thất bại!', { theme: 'colored', toastId: 'loginId', autoClose: 1500 });
      } else {
        navigate(`/error/${status}`);
      }
      setIsLoading(false);
    }
  };

  return <Box
    display={'flex'}
    flexDirection={'column'}
    padding={'30px'}
    bgcolor={theme.palette.common.white}
    borderRadius={'5px'}
    boxShadow={'rgba(58, 53, 65, 0.1) 0px 2px 10px 0px'}
    width={'465px'}
    zIndex={99}
  >
    <TitlePage title="EngQuizz - Quên mật khẩu" />
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
      Quên mật khẩu ?
    </Typography>

    <Typography sx={{ margin: '10px 0 20px 0', fontSize: '15px', color: theme.palette.grey[600] }}>
      {messages[step]}
    </Typography>

    {step === 0 ?
      <TextField variant={'outlined'} label={'Email'} required type={'email'}
                 onChange={(e) => setEmail(e.target.value)} error={!!error} /> : (step === 1 ?
        <Fragment>
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

          <OTPInputField separator={<span>-</span>} value={otp} onChange={setOtp} length={6} />
        </Fragment> :
        <Box display={'flex'} flexDirection={'column'} gap={'10px'}>
          <PasswordField variant={'outlined'} label={'Mật khẩu mới'}
                         onChange={(e) => setNewPassword(e.target.value)} />
          <PasswordField variant={'outlined'} label={'Nhập lại mật khẩu mới'}
                         onChange={(e) => setConfirmNewPassword(e.target.value)} error={!!error} />
        </Box>)}
    {error ? <FormHelperText error={true}>{error}</FormHelperText> : null}

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
      onClick={handleSubmit}
    >
      {btnTexts[step]}
    </LoadingButton>
    <Link to={'/dang-nhap'}
          style={{ textDecoration: 'none', color: theme.palette.primary.main, fontSize: '14px', textAlign: 'center' }}>
      Quay lại đăng nhập
    </Link>
  </Box>;
};

export default ForgotPassword;