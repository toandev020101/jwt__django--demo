import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/web/Home';
import ClientLayout from './layouts/ClientLayout';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import ResetPassword from './pages/auth/ResetPassword';

export const publicRoutes = [
  // auth
  { path: '/dang-nhap', component: Login, layout: AuthLayout },
  { path: '/dang-ky', component: Register, layout: AuthLayout },
  { path: '/xac-minh-email', component: VerifyEmail, layout: AuthLayout },
  { path: '/quen-mat-khau', component: ForgotPassword, layout: AuthLayout },
  { path: '/reset-password-confirm/:uidb64/:token', component: ResetPassword, layout: AuthLayout },
];

export const privateRoutes = [
  // web
  { path: '/', component: Home, layout: ClientLayout },
];
