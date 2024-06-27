import readXlsxFile from 'read-excel-file';

export const getFileExtension = (fileName: string) => {
  return fileName.split('.').at(-1)!.toUpperCase();
};

export const isPdfFile = (fileName: string) => {
  return getFileExtension(fileName) === 'PDF';
};

export const isImageFile = (fileName: string) => {
  return ['JPG', 'JPEG', 'PNG', 'GIF'].includes(getFileExtension(fileName));
};

export const excelFileToObject = async (file: File) => {
  const rows = await readXlsxFile(file);
  const labels = rows.at(0)?.map((cell) => cell?.toString());

  if (!labels) throw new Error('Excel file contains no data');

  const data: Array<Record<string, string>> = [];

  rows.slice(1).forEach((row) => {
    const rowData: Record<string, string> = {};
    row.forEach((cell, i) => {
      const label = labels[i];
      if (!!label) rowData[label] = cell?.toString() ?? '';
    });
    data.push(rowData);
  });

  return data;
};

export const formatFileName = (fileName: string) => {
  return fileName.replace(/[\/\\?%*:|"<> ]/g, '_');
};
