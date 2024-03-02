import { jwtDecode } from 'jwt-decode';
import * as AuthApi from '../apis/authApi';
import { getLocalStorage, setLocalStorage } from './storage';

export const REFRESH_TOKEN_COOKIE_NAME = 'jwt_django_cookie';

const JWTManager = () => {
  const LOGOUT_EVENT_NAME = 'jwt_django_logout';
  let inMemoryToken = null;
  let refreshTokenTimeoutId = null;
  let userId = null;

  const getToken = () => inMemoryToken;

  const getUserId = () => userId;

  const setToken = (accessToken) => {
    inMemoryToken = accessToken;

    // decode and set countdown to refresh
    const decoded = jwtDecode(accessToken);
    userId = decoded.user_id;

    setRefreshTokenTimeout(decoded.exp - decoded.iat);

    return true;
  };

  const abortRefreshToken = () => {
    if (refreshTokenTimeoutId) window.clearTimeout(refreshTokenTimeoutId);
  };

  const deleteToken = () => {
    inMemoryToken = null;
    abortRefreshToken();
    setLocalStorage(LOGOUT_EVENT_NAME, Date.now().toString());
    return true;
  };

  // To logout all tabs (nullify inMemoryToken)
  window.addEventListener('storage', (e) => {
    if (e.key === LOGOUT_EVENT_NAME) {
      inMemoryToken = null;
    }
  });

  const getRefreshToken = async () => {
    try {
      // call api refresh token
      const refresh = getLocalStorage(REFRESH_TOKEN_COOKIE_NAME);
      const res = await AuthApi.refreshToken({ refresh });
      setToken(res.access);
      setLocalStorage(REFRESH_TOKEN_COOKIE_NAME, res.refresh);
      return true;
    } catch (error) {
      deleteToken();
      return false;
    }
  };

  const setRefreshTokenTimeout = (delay) => {
    // 5s before token expires
    refreshTokenTimeoutId = window.setTimeout(getRefreshToken, delay * 1000 - 5000);
  };

  return { getToken, setToken, getRefreshToken, deleteToken, getUserId };
};

export default JWTManager();
