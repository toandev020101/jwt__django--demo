import { Box, TextField, Typography, useTheme } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as AuthApi from '../../../apis/authApi';
import TitlePage from '../../../components/TitlePage';

const ForgotPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError('Vui lòng nhập email!');
      return;
    }

    setIsLoading(true);
    try {
      await AuthApi.forgotPassword({ email });
      setSuccess(true);
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

  return <Box zIndex={99}>
    <TitlePage title={'JWT Django - Quên mật khẩu'} />

    <Box width={'500px'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}
         gap={'30px'} padding={'50px 40px'} bgcolor={theme.palette.common.white} borderRadius={'5px'}>
      <Box width={'150px'} height={'150px'} bgcolor={theme.palette.grey[200]} display={'flex'}
           justifyContent={'center'}
           alignItems={'center'} borderRadius={'50%'}>
        <img src={'/images/email_send.png'} alt={'email send'} width={'100px'} />
      </Box>

      {!success ? <><Box textAlign={'center'}>
        <Typography fontSize={'22px'} marginBottom={'10px'}>Quên mật khẩu?</Typography>
        <Typography>Điền email gắn với tài khoản của bạn để nhận liên kết thay đổi mật khẩu.</Typography>
      </Box>

        <TextField label={'Email'} fullWidth type={'email'} required value={email}
                   onChange={(e) => setEmail(e.target.value)} error={!!error} helperText={error} />

        <LoadingButton
          loading={isLoading}
          loadingIndicator={'Loading...'}
          variant="contained"
          type="submit"
          fullWidth
          sx={{
            textTransform: 'inherit',
            height: '45px',
          }}
          disabled={isLoading}
          onClick={handleSubmit}
        >
          Gửi yêu cầu
        </LoadingButton></> : <Box textAlign={'center'}>
        <Typography fontSize={'22px'} marginBottom={'10px'}>Liên kết đã được gửi đến email.</Typography>
        <Typography>Vui lòng kiểm tra hòm thư email của bạn để nhận liên kết thay đổi mật khẩu.</Typography>
      </Box>}
    </Box>
  </Box>;
};

export default ForgotPassword;