import { computed, ref } from 'vue';
import api, {
  createUser, auth, logout, changePassword,
} from '@/api';
import storage from '@/utils/storage';

type User = {
  login: string;
  token: string;
}

const USER_KEY = 'user';
const user = ref<User | null>(JSON.parse(storage.get(USER_KEY) as string));
const isAuthenticated = computed(() => Boolean(user.value?.token));

if (isAuthenticated.value) {
  api.setToken((user.value as User).token);
}

const setUser = (data: User) => {
  user.value = data;
  storage.set(USER_KEY, JSON.stringify(data));
  api.setToken(data.token);
};

const signIn = async (login: string, password: string) => {
  const { token } = await auth(login, password);
  setUser({ login, token });
};

const signOut = async () => {
  await logout();
  storage.remove(USER_KEY);
  window.location.reload();
};

const register = async (login: string, password: string) => {
  const { token } = await createUser(login, password);
  setUser({ login, token });
};

const updatePassword = async (currentPassword: string, newPassword: string) => {
  await changePassword(currentPassword, newPassword);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut();
      return;
    }

    throw error;
  },
);

export default {
  user,
  isAuthenticated,
  signIn,
  signOut,
  register,
  updatePassword,
};
