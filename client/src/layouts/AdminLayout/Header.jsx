import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiLockAlt, BiLogOut } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as AuthApi from '../../apis/authApi';
import * as UserApi from '../../apis/userApi';
import InputField from '../../components/InputField';
import JWTManager from '../../utils/jwt';
import { useAuthContext } from '../../contexts/authContext';
import changePasswordSchema from '../../schemas/changePasswordSchema';
import ToastNotify from '../../components/ToastNotify';

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, logoutClient } = useAuthContext();

  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // menu

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
  }, [isAuthenticated]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userId = JWTManager.getUserId();
        const res = await UserApi.getOneById(userId);
        const newUser = res.result.data;
        setUser(newUser);
      } catch (error) {
        const { status, data } = error.response;
        if (status === 400 || status === 404) {
          toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
        } else {
          navigate(`/error/${status}`);
        }
      }
    };
    if (isAuthenticated) {
      getUser();
    }
  }, [navigate, isAuthenticated]);

  const handleLogout = async () => {
    handleClose();

    try {
      const res = await AuthApi.logout();
      logoutClient();
      navigate('/dang-nhap', {
        state: {
          notify: {
            type: 'success',
            message: res.detail,
            options: { theme: 'colored', toastId: 'authId', autoClose: 1500 },
          },
        },
      });
    } catch (error) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      } else {
        navigate(`/error/${status}`);
      }
    }
  };

  const handleOpenChangePasswordDialog = () => {
    setOpenChangePasswordDialog(true);
  };

  const handleCloseChangePasswordDialog = () => {
    setOpenChangePasswordDialog(false);
  };

  const form = useForm({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_new_password: '',
    },
    resolver: yupResolver(changePasswordSchema),
  });

  const handleChangePasswordSubmit = async (values) => {
    setIsLoading(true);
    try {
      await UserApi.changePassword(values);
      toast.success('Cập nhật mật khâu thành công!', {
        theme: 'colored',
        toastId: 'headerId',
        autoClose: 1500,
      });
    } catch (error) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      } else {
        navigate(`/error/${status}`);
      }
    }
    setIsLoading(false);
    handleCloseChangePasswordDialog();
  };

  return (
    <Box>
      <ToastNotify />
      <AppBar
        position="static"
        sx={{
          background: 'none',
          boxShadow: 'none',
          color: theme.palette.grey[800],
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          {user && (
            <Box>
              {/* avatar */}
              <Box display={'flex'} alignItems={'center'} gap={'10px'}>
                <Typography>Xin chào, {user?.fullname}</Typography>
                <Tooltip title="Cài đặt tài khoản">
                  <IconButton
                    size="small"
                    aria-controls={openMenu ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                    onClick={handleClick}
                  >
                    {user?.avatar ? (
                      <Avatar src={user.avatar} sx={{ width: 45, height: 45 }} />
                    ) : (
                      <Avatar sx={{ width: 45, height: 45 }}>{user?.fullname.charAt(0)}</Avatar>
                    )}
                  </IconButton>
                </Tooltip>
              </Box>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={openMenu}
                onClose={handleClose}
                onClick={handleClose}
                autoFocus={false}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    minWidth: '200px',
                    bgcolor: theme.palette.grey[50],
                    color: theme.palette.grey[800],
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: theme.palette.grey[100],
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem
                  onClick={() => {
                    handleOpenChangePasswordDialog();
                    handleClose();
                  }}
                >
                  <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <BiLockAlt fontSize="20px" style={{ marginRight: '10px' }} />
                    <Typography>Thay đổi mật khẩu</Typography>
                  </Box>
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout}>
                  <BiLogOut fontSize="20px" style={{ marginRight: '10px' }} /> Đăng xuất
                </MenuItem>
              </Menu>
              {/* avatar */}
            </Box>
          )}

          <Dialog
            open={openChangePasswordDialog}
            onClose={handleCloseChangePasswordDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Thay đổi mật khẩu</DialogTitle>
            <DialogContent sx={{ width: '500px' }}>
              {/* Form */}
              <Box
                component={'form'}
                onSubmit={form.handleSubmit(handleChangePasswordSubmit)}
                width={'100%'}
                marginTop={'10px'}
              >
                <InputField
                  name="password"
                  label="Mật khẩu cũ"
                  size={'small'}
                  type={'password'}
                  form={form}
                  fix
                />
                <InputField
                  name="new_password"
                  label="Mật khẩu mới"
                  size={'small'}
                  type={'password'}
                  form={form}
                  fix
                />
                <InputField
                  name="confirm_new_password"
                  label="Xác nhận mật khẩu mới"
                  size={'small'}
                  type={'password'}
                  form={form}
                  fix
                />

                <Box
                  display={'flex'}
                  justifyContent={'flex-end'}
                  alignItems={'center'}
                  gap={'10px'}
                  marginTop={'20px'}
                >
                  <LoadingButton
                    loading={isLoading}
                    loadingIndicator={'Loading...'}
                    variant="contained"
                    type="submit"
                    sx={{
                      textTransform: 'inherit',
                    }}
                    disabled={isLoading}
                  >
                    Xác nhận
                  </LoadingButton>

                  <Button
                    variant={'contained'}
                    color={'error'}
                    onClick={handleCloseChangePasswordDialog}
                    sx={{
                      textTransform: 'capitalize',
                    }}
                  >
                    Huỷ
                  </Button>
                </Box>
              </Box>
              {/* Form */}
            </DialogContent>
          </Dialog>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;