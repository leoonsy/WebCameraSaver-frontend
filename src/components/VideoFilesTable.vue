<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { VideoFile } from '@/store/video';
import { SaveTwoTone } from '@ant-design/icons-vue';

defineProps<{
  entries: Readonly<VideoFile[]>;
  loading?: boolean;
  downloadNames: Record<string, boolean>;
}>();

defineEmits<{(e: 'save', name: string): void }>();

const { t, n } = useI18n();

const columns = computed(() => [
  {
    title: t('name'),
    dataIndex: 'name',
    width: '400px',
  },
  {
    title: t('size'),
    customRender: ({ record: { size } }: { record: VideoFile }) => t('kb', [n(size)]),
    slots: { customRender: 'size' },
  },
  {
    key: 'x',
    slots: { customRender: 'edit' },
    align: 'right',
  },
]);
</script>

<template>
  <a-table
    :columns="columns"
    row-key="name"
    :data-source="entries"
    :loading="loading"
    :pagination="false"
  >
    <template #edit="{ record: { name } }">
      <a-tooltip placement="left">
        <template #title>
          <span v-t="'save'" />
        </template>

        <a-space>
          <a-spin
            v-if="downloadNames[name]"
            :class="$style.spin"
            size="small"
          />

          <SaveTwoTone
            :class="[$style.icon, { [$style.icon_disabled]: downloadNames[name] }]"
            @click="$emit('save', name)"
          />
        </a-space>
      </a-tooltip>
    </template>
  </a-table>
</template>

<style module>
.icon {
  font-size: 20px;
  cursor: pointer;
  opacity: 0.8;
}

.icon:hover {
  opacity: 1;
}

.icon_disabled {
  pointer-events: none;
  cursor: auto;
  opacity: 0.4;
}

.spin {
  margin-top: 2px;
}
</style>

<i18n locale="ru">
name: Название
size: Размер
kb: '{0} килобайт'
save: Сохранить локально
</i18n>

<i18n locale="en">
name: Name
size: Size
kb: '{0} kilobytes'
save: Save locally
</i18n>
