<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { reactive } from 'vue';
import authStore from '@/store/auth';
import { requiredValidator } from '@/utils/validators';
import { useFormDataValidation } from '@/composables/formDataValidation';
import { message } from 'ant-design-vue';
import xhrErrorMessage from '@/utils/xhrErrorMessage';
import { AxiosError } from 'axios';

const { t } = useI18n();
const { updatePassword } = authStore;

const rules = reactive({
  oldPassword: [{ validator: requiredValidator, trigger: 'change' }],
  newPassword: [{ validator: requiredValidator, trigger: 'change' }],
});

const model = reactive({
  oldPassword: '',
  newPassword: '',
});

const { valid } = useFormDataValidation(model, rules);

const save = async () => {
  try {
    await updatePassword(model.oldPassword, model.newPassword);
    message.success(t('success'));
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
      :label-col="{ style: { width: '115px' } }"
      :model="model"
      :rules="rules"
    >
      <a-form-item
        :label="t('password.old')"
        :has-feedback="true"
      >
        <a-input-password v-model:value="model.oldPassword" />
      </a-form-item>

      <a-form-item
        :label="t('password.new')"
        :has-feedback="true"
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
  width: 400px;
}

.right {
  text-align: right;
}
</style>

<i18n locale="ru">
title: Настройки профиля
password:
  old: Старый пароль
  new: Новый пароль
save: Сохранить
success: Пароль успешно изменен
incorrect: Неверный старый пароль
</i18n>

<i18n locale="en">
title: Profile settings
password:
  old: Old password
  new: New password
save: Save
success: Password changed successfully
incorrect: Wrong old password
</i18n>
