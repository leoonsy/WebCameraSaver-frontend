<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { UserOutlined, UnorderedListOutlined, CameraOutlined } from '@ant-design/icons-vue';
import authStore from '@/store/auth';
import LanguageSelection from '@/components/LanguageSelection.vue';

const { signOut, user } = authStore;

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const collapsed = ref(false);

const menu = {
  Record: CameraOutlined,
  Video: UnorderedListOutlined,
  Settings: UserOutlined,
};

const selectedKey = computed(() => route.matched[0].name as string);
const heading = computed(() => t(`menu.${selectedKey.value}`));

const navigate = (name: string) => { router.push({ name }); };
</script>

<template>
  <a-layout
    :class="$style.layout"
    :style="{ 'margin-left': collapsed ? '80px' : '200px' }"
  >
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      breakpoint="lg"
      :class="$style.sider"
    >
      <a-menu
        :selected-keys="[selectedKey]"
        theme="dark"
        mode="inline"
      >
        <a-menu-item
          v-for="(icon, key) of menu"
          :key="key"
          @click="navigate(key)"
        >
          <template #icon>
            <component :is="icon" />
          </template>
          {{ t(`menu.${key}`) }}
        </a-menu-item>
      </a-menu>

      <LanguageSelection :class="$style.lang" />
    </a-layout-sider>

    <a-layout>
      <a-layout-header :class="$style.header">
        <h1
          :class="$style.heading"
          v-text="heading"
        />

        <a-space size="large">
          <span v-if="user">{{ t('welcome', [user.login]) }}</span>

          <a-button
            danger
            @click="signOut"
            v-text="t('signout')"
          />
        </a-space>
      </a-layout-header>

      <a-layout-content :class="$style.content">
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style module>
.layout {
  transition: margin 0.2s;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  background: #fff;
}

.heading {
  margin: 0 1rem 0 0;
  font-size: 1.25rem;
}

.content {
  padding: 1.5rem;
  margin: 1rem;
  background-color: #fff;
}

.sider {
  position: fixed;
  left: 0;
  height: 100vh;
}

.sider :global(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
}

.lang {
  margin: 1rem auto;
}
</style>

<i18n locale="ru">
signout: Выйти
welcome: Добро пожаловать, {0}
menu:
  Record: Запись
  Video: Видео
  Settings: Настройки
</i18n>

<i18n locale="en">
signout: Sign out
welcome: Welcome, {0}
menu:
  Record: Record
  Video: Video
  Settings: Settings
</i18n>
