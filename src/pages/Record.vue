<script setup lang="ts">
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';
import { onUnmounted, ref } from 'vue';
import BaseSpinner from '@/components/BaseSpinner.vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

let recorder: null | RecordRTC = null;
let stream: null | MediaStream = null;
const blob = ref<null | Blob>(null);

const video = ref(null as unknown as HTMLVideoElement);
const ready = ref(false);
const recording = ref(false);
const loadingUserMedia = ref(false);

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
          :disabled="recording"
          @click="startRecording"
        >
          {{ t('record') }}
        </a-button>

        <a-button
          type="primary"
          :disabled="!recording"
          danger
          @click="stopRecording"
        >
          {{ t('stop') }}
        </a-button>

        <a-button
          :disabled="!blob"
          @click="saveLocal"
        >
          {{ t('save.local') }}
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
</i18n>

<i18n locale="en">
recording:
  title: Recording from Web Camera
  error: Required rights not granted
record: Record
stop: Stop
save:
  local: Save locally
</i18n>
