import { createApp } from 'vue';
import 'ant-design-vue/dist/antd.css';
import Antd from 'ant-design-vue';
import i18n from '@/i18n';
import router from '@/router';
import App from './App.vue';

import '@/assets/style.css';

createApp(App)
  .use(i18n)
  .use(router)
  .use(Antd)
  .mount('#app');
