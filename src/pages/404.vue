<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <a-result
    status="404"
    title="404"
    :sub-title="t('description')"
  >
    <template #extra>
      <router-link
        v-slot="{ navigate }"
        to="/"
        replace
        custom
      >
        <a-button
          @click="navigate"
          v-text="t('home')"
        />
      </router-link>
    </template>
  </a-result>
</template>

<i18n locale="ru">
home: Вернуться в начало
description: Извините, данная страница не существует
</i18n>
