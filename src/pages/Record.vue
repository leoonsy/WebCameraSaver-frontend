<script setup lang="ts">
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';
import { onUnmounted, reactive, ref } from 'vue';
import BaseSpinner from '@/components/BaseSpinner.vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { v4 as uuidv4 } from 'uuid';
import videoStore from '@/store/video';
import xhrErrorMessage from '@/utils/xhrErrorMessage';
import { filenameValidator } from '@/utils/validators';

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

const model = reactive({
  filename: '',
});

const rules = reactive({
  filename: [{ validator: filenameValidator, trigger: 'change' }],
});

const setReady = () => {
  ready.value = true;
  loadingUserMedia.value = false;
};

const saveLocal = () => {
  if (blob.value) {
    invokeSaveAsDialog(blob.value, model.filename ? `${model.filename}.webm` : undefined);
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

  const file = new File([blob.value], model.filename || uuidv4(), {
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
  <a-card :class="$style.card">
    <template #title>
      <a-form
        :model="model"
        :rules="rules"
        :class="$style.form"
        layout="inline"
      >
        <a-form-item>
          <a-button
            type="primary"
            :disabled="recording || saving"
            @click="startRecording"
          >
            {{ t('record') }}
          </a-button>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            :disabled="!recording || loadingUserMedia"
            danger
            @click="stopRecording"
          >
            {{ t('stop') }}
          </a-button>
        </a-form-item>

        <a-form-item
          :has-feedback="true"
          name="filename"
          :class="$style.filename"
        >
          <a-input
            v-model:value="model.filename"
            :disabled="saving"
            :placeholder="t('filename')"
          />
        </a-form-item>

        <a-form-item>
          <a-button
            :disabled="!blob || recording"
            @click="saveLocal"
          >
            {{ t('save.local') }}
          </a-button>
        </a-form-item>

        <a-form-item>
          <a-button
            :disabled="!blob || recording"
            :loading="saving"
            @click="saveToServer"
          >
            {{ t('save.remote') }}
          </a-button>
        </a-form-item>
      </a-form>
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
.card {
  display: inline-block;
}

.video {
  width: 100%;
}

.filename {
  width: 160px;
}

.form :global(.ant-form-item) {
  margin-right: 0;
}

.form {
  gap: 8px;
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
filename: Имя файла
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
filename: File name
</i18n>
