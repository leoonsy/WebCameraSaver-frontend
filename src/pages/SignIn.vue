<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import useFormDataValidation from '@/composables/useFormDataValidation';
import { requiredValidator } from '@/utils/validators';
import LanguageSelection from '@/components/LanguageSelection.vue';
import authStore from '@/store/auth';
import xhrErrorMessage from '@/utils/xhrErrorMessage';
import type { AxiosError } from 'axios';

const { t } = useI18n();
const router = useRouter();

const rules = reactive({
  login: [{ validator: requiredValidator, trigger: 'change' }],
  password: [{ validator: requiredValidator, trigger: 'change' }],
});

const model = reactive({
  login: '',
  password: '',
});

const { valid } = useFormDataValidation(model, rules);

const signIn = async () => {
  try {
    await authStore.signIn(model.login, model.password);
    router.push('/');
  } catch (e) {
    if ((e as AxiosError).response?.status === 404) {
      message.error(t('signIn.404'));
    } else {
      message.error(xhrErrorMessage(e));
    }
  }
};

const register = async () => {
  try {
    await authStore.register(model.login, model.password);
    router.push('/');
  } catch (e) {
    if ((e as AxiosError).response?.status === 409) {
      message.error(t('register.409'));
    } else {
      message.error(xhrErrorMessage(e));
    }
  }
};
</script>

<template>
  <a-card
    :title="t('form')"
    :class="$style.card"
  >
    <template #extra>
      <LanguageSelection />
    </template>

    <a-form
      :model="model"
      :rules="rules"
      :label-col="{ sm: { span: 5 } }"
      :wrapper-col="{ sm: { span: 20 } }"
    >
      <a-form-item
        name="login"
        :label="t('login')"
        :has-feedback="true"
      >
        <a-input v-model:value="model.login" />
      </a-form-item>

      <a-form-item
        name="password"
        :label="t('password')"
        :has-feedback="true"
      >
        <a-input-password v-model:value="model.password" />
      </a-form-item>

      <a-space direction="vertical">
        <a-button
          type="primary"
          :disabled="!valid"
          @click="signIn"
        >
          {{ t('signIn.title') }}
        </a-button>

        <a-button
          type="primary"
          :disabled="!valid"
          @click="register"
        >
          {{ t('register.title') }}
        </a-button>
      </a-space>
    </a-form>
  </a-card>
</template>

<style module>
.card {
  width: 400px;
  margin: auto;
}

.card :global(.ant-card-head) {
  color: #fff;
  background-color: #001529;
}

.card :global(.ant-card-body) {
  text-align: center;
}

.card :global(.ant-form-item) {
  margin-bottom: 12px;
  text-align: left;
}
</style>

<i18n locale="ru">
form: Форма входа
signIn:
  title: Войти
  404: Пользователь с таким логином и паролем не найден
register:
  title: Зарегистрироваться
  409: Пользователь с таким логином уже существует
login: Логин
password: Пароль

</i18n>

<i18n locale="en">
form: Login form
signIn:
  title: Sign In
  404: No user found with this username and password
register:
  title: Register
  409: User with this login already exists
login: Login
password: Password
</i18n>
