import React, { createContext, useCallback, useContext, useState } from 'react';
import JWTManager, { REFRESH_TOKEN_COOKIE_NAME } from '../utils/jwt';
import { removeLocalStorage } from '../utils/storage';

const defaultIsAuthenticated = false;

export const AuthContext = createContext({
  isAuthenticated: defaultIsAuthenticated,
  setIsAuthenticated: () => {
  },
  checkAuth: () => Promise.resolve(),
  logoutClient: () => {
  },
});

export const useAuthContext = () => useContext(AuthContext);

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(defaultIsAuthenticated);

  const checkAuth = useCallback(async () => {
    const token = JWTManager.getToken();

    if (token) setIsAuthenticated(true);
    else {
      const success = await JWTManager.getRefreshToken();
      if (success) setIsAuthenticated(true);
    }
  }, []);

  const logoutClient = () => {
    JWTManager.deleteToken();
    setIsAuthenticated(false);
    removeLocalStorage(REFRESH_TOKEN_COOKIE_NAME);
  };

  const authContextData = {
    isAuthenticated,
    setIsAuthenticated,
    checkAuth,
    logoutClient,
  };

  return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
