const namespace: string = import.meta.env.VITE_STORAGE_NAMESPACE as string;

export default {
  get: (key: string) => localStorage.getItem(`${namespace}:${key}`),

  set: (key: string, value: string) => {
    localStorage.setItem(`${namespace}:${key}`, value);
  },

  remove: (key: string) => {
    localStorage.removeItem(`${namespace}:${key}`);
  },
};
