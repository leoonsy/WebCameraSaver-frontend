import { isAxiosError } from '@/api';
import i18n from '@/i18n';

const { t } = i18n.global;

const errors: Record<number, string> = {
  400: t('errors.400'),
  404: t('errors.404'),
  409: t('errors.409'),
};

export default (error: unknown) => {
  const status = (isAxiosError(error) && error.response?.status) || 0;
  return errors[status] ?? t('errors.unknownError');
};
