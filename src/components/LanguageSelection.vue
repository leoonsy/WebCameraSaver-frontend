<script setup lang="ts">
import { DownOutlined } from '@ant-design/icons-vue';
import { locales, setLocale } from '@/i18n';
import getImageUrl from '@/utils/getImageUrl';

const select = ({ key }: { key: string }) => setLocale(key);
</script>

<template>
  <a-dropdown
    :trigger="['hover', 'click']"
    placement="bottomCenter"
  >
    <div :class="$style.trigger">
      <img
        :src="getImageUrl(`flag-${$i18n.locale}.svg`)"
        :alt="$i18n.locale"
        :class="$style.flag"
      >
      <DownOutlined :style="{ color: '#fff' }" />
    </div>

    <template #overlay>
      <a-menu @click="select">
        <a-menu-item
          v-for="locale of locales"
          :key="locale"
        >
          <img
            :src="getImageUrl(`flag-${locale}.svg`)"
            :alt="locale"
            :class="$style.flag"
          >
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style module>
.trigger {
  display: flex;
  align-items: center;
}

.flag {
  width: 27px;
  height: 18px;
}

.trigger > .flag {
  margin-right: 0.25rem;
}
</style>
