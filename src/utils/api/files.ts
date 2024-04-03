import axios from 'axios';
import { FILE_STORAGE_BASE_URL } from '../constants/api';
import UploadFilesResponseDto from '../types/UploadFilesResponseDto';

export const uploadFiles = (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('newsFiles[]', file));
  return axios
    .post<UploadFilesResponseDto>(FILE_STORAGE_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data);
};
