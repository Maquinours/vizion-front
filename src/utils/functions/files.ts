export const getFileExtension = (fileName: string) => {
  return fileName.split('.').at(-1)!.toUpperCase();
};

export const isPdfFile = (fileName: string) => {
  return getFileExtension(fileName) === 'PDF';
};

export const isImageFile = (fileName: string) => {
  return ['JPG', 'JPEG', 'PNG', 'GIF'].includes(getFileExtension(fileName));
};
