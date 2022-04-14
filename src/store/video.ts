import { ref } from 'vue';
import {
  readVideoFiles, saveVideoFile, uploadVideo,
} from '@/api';

export type VideoFile = {
  name: string;
  size: number;
}

const videoFiles = ref<VideoFile[]>([]);

const uploadVideoToServer = async (file: FormData) => {
  await uploadVideo(file);
};

const getVideoFiles = async () => {
  const response = await readVideoFiles();
  videoFiles.value = response.map((file) => ({
    ...file,
    size: file.size / 1024,
  }));
};

const downloadVideoFile = async (name: string) => {
  const blob = await saveVideoFile(name);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
};

export default {
  videoFiles,
  getVideoFiles,
  uploadVideoToServer,
  downloadVideoFile,
};
