import i18n from '@/i18n';

const { t } = i18n.global;

export const requiredValidator = async (
  rule: Record<string, unknown>,
  value: string | number,
) => {
  if (!value || value === '') {
    throw new Error(t('errors.requiredInput'));
  }
};

export const loginValidator = async (
  rule: Record<string, unknown>,
  value: string,
) => {
  if (!/^[a-zA-Z0-9]+$/.test(value)) {
    throw new Error(t('errors.login'));
  }
};

export const passwordValidator = async (
  rule: Record<string, unknown>,
  value: string,
) => {
  if (value.length < 5) {
    throw new Error(t('errors.password'));
  }
};
