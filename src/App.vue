<script setup lang="ts">
import {
  computed, defineAsyncComponent, defineComponent, h, type Slot,
} from 'vue';
import { useRoute } from 'vue-router';
import SuspenseWithFallback from '@/components/SuspenseWithFallback.vue';
import ruLocale from 'ant-design-vue/es/locale/ru_RU';
import enLocale from 'ant-design-vue/es/locale/en_US';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const NoLayout = defineComponent((_, { slots }) => () => h(slots.default as Slot));
const AppLayout = defineAsyncComponent(() => import(/* webpackChunkName: "app-layout" */ '@/layouts/AppLayout.vue'));

const route = useRoute();

const layout = computed(() => (!route.name || route.meta.public ? NoLayout : AppLayout));

const antLocales = { ru: ruLocale, en: enLocale };
const antLocale = computed(() => antLocales[locale.value as keyof typeof antLocales]);
</script>

<template>
  <a-config-provider :locale="antLocale">
    <component :is="layout">
      <router-view v-slot="{ Component }">
        <SuspenseWithFallback>
          <component :is="Component" />
        </SuspenseWithFallback>
      </router-view>
    </component>
  </a-config-provider>
</template>
