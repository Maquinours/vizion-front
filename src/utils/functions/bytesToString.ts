export const bytesToString = (bytes: number) => {
  const sizes = ['octets', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0 || bytes === 1) return `${bytes} octet`;
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};
