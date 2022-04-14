<script setup lang="ts">
import videoStore from '@/store/video';
import { reactive, ref } from 'vue';
import VideoFilesTable from '@/components/VideoFilesTable.vue';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { useI18n } from 'vue-i18n';

const { videoFiles, getVideoFiles, downloadVideoFile } = videoStore;
useI18n();

getVideoFiles();

const loading = ref(false);
const downloadNames = reactive<Record<string, boolean>>({});
const fetch = async () => {
  loading.value = true;
  await getVideoFiles();
  loading.value = false;
};

const download = async (name: string) => {
  downloadNames[name] = true;
  await downloadVideoFile(name);
  delete downloadNames[name];
};
fetch();
</script>

<template>
  <a-space
    direction="vertical"
    style="width: 100%;"
  >
    <a-tooltip placement="top">
      <template #title>
        <span v-t="'update'" />
      </template>

      <a-button
        type="primary"
        shape="circle"
        ghost
        @click="fetch"
      >
        <template #icon>
          <ReloadOutlined />
        </template>
      </a-button>
    </a-tooltip>

    <VideoFilesTable
      :entries="videoFiles"
      :loading="loading"
      :download-names="downloadNames"
      @save="download"
    />
  </a-space>
</template>

<i18n locale="ru">
update: Обновить
</i18n>

<i18n locale="en">
update: Refresh
</i18n>
