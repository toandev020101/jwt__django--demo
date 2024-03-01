import axiosClient from './axiosClient';

const BASE_LINK = '/auth';

export const login = (data) => {
  const url = `${BASE_LINK}/login`;
  return axiosClient.post(url, data);
};

export const register = (data) => {
  const url = `${BASE_LINK}/register`;
  return axiosClient.post(url, data);
};

export const refreshOTP = (data) => {
  const url = `${BASE_LINK}/refresh-otp`;
  return axiosClient.post(url, data);
};

export const verifyEmail = (data) => {
  const url = `${BASE_LINK}/verify-email`;
  return axiosClient.post(url, data);
};

export const refreshToken = () => {
  const url = `${BASE_LINK}/refresh-token`;
  return axiosClient.get(url);
};

export const sendOTPPassword = (data) => {
  const url = `${BASE_LINK}/send-otp-password`;
  return axiosClient.post(url, data);
};

export const verifyOTPPassword = (data) => {
  const url = `${BASE_LINK}/verify-otp-password`;
  return axiosClient.post(url, data);
};

export const forgotPassword = (data) => {
  const url = `${BASE_LINK}/forgot-password`;
  return axiosClient.post(url, data);
};

export const logout = () => {
  const url = `${BASE_LINK}/logout`;
  return axiosClient.get(url);
};
