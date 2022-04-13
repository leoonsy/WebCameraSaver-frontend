import { ref } from 'vue';
import { uploadVideo } from '@/api';

const video = ref<string[]>([]);

const uploadVideoToServer = async (file: FormData) => {
  await uploadVideo(file);
};

export default {
  video,
  uploadVideoToServer,
};
