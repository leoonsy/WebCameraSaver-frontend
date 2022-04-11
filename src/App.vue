<script setup lang="ts">
import {
  computed, defineAsyncComponent, defineComponent, h, type Slot,
} from 'vue';
import { useRoute } from 'vue-router';
import SuspenseWithFallback from '@/components/SuspenseWithFallback.vue';

const NoLayout = defineComponent((_, { slots }) => () => h(slots.default as Slot));
const AppLayout = defineAsyncComponent(() => import(/* webpackChunkName: "app-layout" */ '@/layouts/AppLayout.vue'));

const route = useRoute();

const layout = computed(() => (!route.name || route.meta.public ? NoLayout : AppLayout));
</script>

<template>
  <a-config-provider>
    <component :is="layout">
      <router-view v-slot="{ Component }">
        <SuspenseWithFallback>
          <component :is="Component" />
        </SuspenseWithFallback>
      </router-view>
    </component>
  </a-config-provider>
</template>
