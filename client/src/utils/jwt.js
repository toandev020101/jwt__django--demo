import { jwtDecode } from 'jwt-decode';
import * as AuthApi from '../apis/authApi';

const JWTManager = () => {
  const LOGOUT_EVENT_NAME = 'license_logout';
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
    window.localStorage.setItem(LOGOUT_EVENT_NAME, Date.now().toString());
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
      const res = await AuthApi.refreshToken();
      setToken(res.result.access_token);
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
