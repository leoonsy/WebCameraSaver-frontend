<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { reactive } from 'vue';
import authStore from '@/store/auth';
import { passwordValidator } from '@/utils/validators';
import { useFormDataValidation } from '@/composables/formDataValidation';
import { message } from 'ant-design-vue';
import xhrErrorMessage from '@/utils/xhrErrorMessage';
import type { AxiosError } from 'axios';

const { t } = useI18n();
const { updatePassword } = authStore;

const rules = reactive({
  currentPassword: [{ validator: passwordValidator, trigger: 'change' }],
  newPassword: [{ validator: passwordValidator, trigger: 'change' }],
});

const model = reactive({
  currentPassword: '',
  newPassword: '',
});

const { valid } = useFormDataValidation(model, rules);

const save = async () => {
  try {
    await updatePassword(model.currentPassword, model.newPassword);
    message.success(t('success'));
    model.currentPassword = '';
    model.newPassword = '';
  } catch (e) {
    if ((e as AxiosError).response?.status === 404) {
      message.error(t('incorrect'));
    } else {
      message.error(xhrErrorMessage(e));
    }
  }
};
</script>

<template>
  <a-card
    :title="t('title')"
    :class="$style.card"
  >
    <a-form
      :label-col="{ style: { width: '120px' } }"
      :model="model"
      :rules="rules"
    >
      <a-form-item
        :label="t('password.current')"
        :has-feedback="true"
        name="currentPassword"
      >
        <a-input-password v-model:value="model.currentPassword" />
      </a-form-item>

      <a-form-item
        :label="t('password.new')"
        :has-feedback="true"
        name="newPassword"
      >
        <a-input-password v-model:value="model.newPassword" />
      </a-form-item>

      <div :class="$style.right">
        <a-button
          type="primary"
          :disabled="!valid"
          @click="save"
        >
          {{ t('save') }}
        </a-button>
      </div>
    </a-form>
  </a-card>
</template>

<style module>
.card {
  max-width: 400px;
}

.right {
  text-align: right;
}
</style>

<i18n locale="ru">
title: Настройки профиля
password:
  current: Текущий пароль
  new: Новый пароль
save: Сохранить
success: Пароль успешно изменен
incorrect: Неверный старый пароль
</i18n>

<i18n locale="en">
title: Profile settings
password:
  current: Current password
  new: New password
save: Save
success: Password changed successfully
incorrect: Wrong old password
</i18n>
