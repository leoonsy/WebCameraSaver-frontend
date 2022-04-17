import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
});

const setToken = (token: string) => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const auth = async (login: string, password: string) => {
  const response = await api.post<{
    token: string;
  }>('users/signIn', { login, password });

  return response.data;
};

export const logout = async () => {
  await api.post('users/signOut');
};

export const createUser = async (login: string, password: string) => {
  const response = await api.post<{
    token: string;
  }>('users', { login, password });

  return response.data;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  await api.put('users/password', { currentPassword, newPassword });
};

export const uploadVideo = async (video: FormData) => {
  await api.post('video', video, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const readVideoFiles = async () => {
  const response = await api.get<{
    name: string;
    size: number;
  }[]>('video');

  return response.data;
};

export const saveVideoFile = async (name: string) => {
  const response = await api.get(`video/${name}`, { responseType: 'blob' });
  return response.data;
};

export const deleteVideoFile = async (name: string) => {
  await api.delete(`video/${name}`);
};

const { isAxiosError } = axios;

export {
  isAxiosError,
};

export default {
  ...api,
  setToken,
};
