import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
});

const setToken = (token: string) => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

type Params = Record<string, unknown>;

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

const { isAxiosError } = axios;

export {
  isAxiosError,
};

export default {
  ...api,
  setToken,
};
