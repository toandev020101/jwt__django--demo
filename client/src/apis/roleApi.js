import axiosClient from './axiosClient';

const BASE_LINK = '/role';

export const getAll = () => {
  const url = `${BASE_LINK}`;
  return axiosClient.get(url);
};

export const getPagination = ({ _limit, _page, searchTerm }) => {
  const url = `${BASE_LINK}?_page=${_page}&_limit=${_limit}&search_term=${searchTerm}`;
  return axiosClient.get(url);
};

export const addOne = (data) => {
  const url = `${BASE_LINK}`;
  return axiosClient.post(url, data);
};

export const updateOne = (id, data) => {
  const url = `${BASE_LINK}/${id}`;
  return axiosClient.put(url, data);
};


export const removeAny = (data) => {
  const url = `${BASE_LINK}`;
  return axiosClient.delete(url, { data });
};

export const removeOne = (id) => {
  const url = `${BASE_LINK}/${id}`;
  return axiosClient.delete(url);
};