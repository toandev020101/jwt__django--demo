import axiosClient from './axiosClient';

const BASE_LINK = '/user';

export const getPagination = ({ _limit, _page, searchTerm, roleCode, isVerified }) => {
  const url = `${BASE_LINK}?_page=${_page}&_limit=${_limit}&search_term=${searchTerm}&role_code=${roleCode}&is_verified=${isVerified}`;
  return axiosClient.get(url);
};

export const getOneById = (id) => {
  const url = `${BASE_LINK}/${id}`;
  return axiosClient.get(url);
};

export const addOne = (data) => {
  const url = `${BASE_LINK}`;
  return axiosClient.post(url, data);
};

export const updateOne = (formData) => {
  const url = `${BASE_LINK}`;
  return axiosClient.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const changePassword = (data) => {
  const url = `${BASE_LINK}`;
  return axiosClient.patch(url, data);
};


export const removeAny = (data) => {
  const url = `${BASE_LINK}`;
  return axiosClient.delete(url, { data });
};

export const removeOne = (id) => {
  const url = `${BASE_LINK}/${id}`;
  return axiosClient.delete(url);
};
