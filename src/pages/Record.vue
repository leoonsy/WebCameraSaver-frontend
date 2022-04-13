<script setup lang="ts">
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';
import { onUnmounted, ref } from 'vue';
import BaseSpinner from '@/components/BaseSpinner.vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { v4 as uuidv4 } from 'uuid';
import videoStore from '@/store/video';
import xhrErrorMessage from '@/utils/xhrErrorMessage';

const { t } = useI18n();
const { uploadVideoToServer } = videoStore;

let recorder: null | RecordRTC = null;
let stream: null | MediaStream = null;
const blob = ref<null | Blob>(null);

const video = ref(null as unknown as HTMLVideoElement);
const ready = ref(false);
const recording = ref(false);
const loadingUserMedia = ref(false);
const saving = ref(false);

const setReady = () => {
  ready.value = true;
  loadingUserMedia.value = false;
};

const saveLocal = () => {
  if (blob.value) {
    invokeSaveAsDialog(blob.value);
  }
};

const startRecording = async () => {
  try {
    loadingUserMedia.value = true;
    recording.value = true;
    stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  } catch (e) {
    message.error(t('recording.error'));
    loadingUserMedia.value = false;
    recording.value = false;
    return;
  }
  recorder = new RecordRTC(stream, {
    type: 'video',
    mimeType: 'video/webm;codecs=vp9',
  });
  recorder.reset();
  recorder.startRecording();
  video.value.srcObject = stream;
  video.value.muted = true;
};

const stopRecording = () => {
  recording.value = false;
  recorder?.stopRecording(() => {
    stream?.getTracks().forEach((track) => {
      track.stop();
    });
    video.value.muted = false;
    blob.value = recorder?.getBlob() ?? null;
    if (blob.value) {
      video.value.srcObject = null;
      video.value.src = URL.createObjectURL(blob.value);
    }
    recorder?.destroy();
    recorder = null;
  });
};

const saveToServer = async () => {
  if (!blob.value) {
    return;
  }

  const file = new File([blob.value], uuidv4(), {
    type: 'video/webm',
  });

  const formData = new FormData();
  formData.append('file', file);

  try {
    saving.value = true;
    await uploadVideoToServer(formData);
    message.success(t('save.success'));
  } catch (e) {
    message.error(xhrErrorMessage(e));
  } finally {
    saving.value = false;
  }
};

onUnmounted(stopRecording);
</script>

<template>
  <a-card
    :title="t('recording.title')"
    :class="$style.card"
  >
    <template #extra>
      <a-space>
        <a-button
          type="primary"
          :disabled="recording || saving"
          @click="startRecording"
        >
          {{ t('record') }}
        </a-button>

        <a-button
          type="primary"
          :disabled="!recording || loadingUserMedia"
          danger
          @click="stopRecording"
        >
          {{ t('stop') }}
        </a-button>

        <a-button
          :disabled="!blob || recording"
          @click="saveLocal"
        >
          {{ t('save.local') }}
        </a-button>

        <a-button
          :disabled="!blob || recording || saving"
          @click="saveToServer"
        >
          {{ t('save.remote') }}
        </a-button>
      </a-space>
    </template>

    <BaseSpinner v-if="loadingUserMedia && !ready" />

    <video
      v-show="ready"
      ref="video"
      :class="$style.video"
      autoplay
      controls
      playsinline
      @canplay="setReady"
    />
  </a-card>
</template>

<style module>
.video {
  width: 100%;
}

.card {
  width: 800px;
}
</style>

<i18n locale="ru">
recording:
  title: Запись с веб-камеры
  error: Не предоставлены необходимые права
record: Запись
stop: Стоп
save:
  local: Сохранить локально
  remote: Сохранить на сервер
  success: Видео успешно сохранено
</i18n>

<i18n locale="en">
recording:
  title: Recording from web-camera
  error: Required rights not granted
record: Record
stop: Stop
save:
  local: Save locally
  remote: Save to server
  success: Video saved successfully
</i18n>
