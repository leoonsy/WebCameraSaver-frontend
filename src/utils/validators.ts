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
