import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/web/Home';
import ClientLayout from './layouts/ClientLayout';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/admin/Dashboard';
import AdminLayout from './layouts/AdminLayout';
import RoleManager from './pages/admin/UserManager/RoleManager';
import AccountManager from './pages/admin/UserManager/AccountManager';
import VerifyEmail from './pages/VerifyEmail';

export const publicRoutes = [
  // auth
  { path: '/dang-nhap', component: Login, layout: AuthLayout },
  { path: '/dang-ky', component: Register, layout: AuthLayout },
  { path: '/xac-minh-email', component: VerifyEmail, layout: AuthLayout },
  { path: '/quen-mat-khau', component: ForgotPassword, layout: AuthLayout },

  // web
  { path: '/', component: Home, layout: ClientLayout },
];

export const privateRoutes = [
  // admin
  { path: '/quan-tri/tai-khoan/vai-tro', component: RoleManager, layout: AdminLayout },
  { path: '/quan-tri/tai-khoan', component: AccountManager, layout: AdminLayout },
  { path: '/quan-tri', component: Dashboard, layout: AdminLayout },
];
