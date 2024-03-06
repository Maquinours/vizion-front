import FileType from '../enums/FileType';
import { privateInstance } from '../functions/axios';
import FileDataTreeResponseDto from '../types/FileDataTreeResponseDto';

export const getDirectoryByTypeAndIdOnS3 = async (type: FileType, id: string) => {
  return (
    await privateInstance<Array<FileDataTreeResponseDto>>({
      method: 'GET',
      url: `/ged/v1/s3/list-dir`,
      params: {
        type,
        id,
      },
    })
  ).data;
};

export const uploadFilesOnS3 = async (path: string, id: string, type: FileType, files: File[]) => {
  const formdata = new FormData();
  formdata.append('path', path);
  formdata.append('id', id);
  formdata.append(`type`, FileType[type]);

  for (const file of files) {
    formdata.append('files', file);
  }
  return (
    await privateInstance<Array<string>>({
      method: 'POST',
      url: '/ged/v1/s3/upload-list-file',
      data: formdata,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  ).data;
};

export const createDirectoryOnS3 = async (type: FileType, id: string, name: string) => {
  return (
    await privateInstance<string>({
      method: 'POST',
      url: '/ged/v1/s3/new-dir',
      params: {
        type,
        id,
        name,
      },
    })
  ).data;
};

export const deleteObjectOnS3 = async (type: FileType, id: string, object: FileDataTreeResponseDto) => {
  return (
    await privateInstance<void>({
      method: 'DELETE',
      url: object.dir ? '/ged/v1/s3/remove-dir' : '/ged/v1/s3/remove-file',
      params: {
        type,
        id,
        relativePath: object.relativePath,
      },
    })
  ).data;
};

export const renameObjectOnS3 = async (type: FileType, id: string, object: FileDataTreeResponseDto, newName: string) => {
  return (
    await privateInstance<void>({
      method: 'POST',
      url: object.dir ? '/ged/v1/s3/rename-dir' : '/ged/v1/s3/rename-file',
      params: {
        type: type,
        id: id,
        relativePath: object.relativePath,
        newName: newName,
      },
    })
  ).data;
};
