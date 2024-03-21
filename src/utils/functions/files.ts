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
  const labelCells = rows.at(0);

  if (!labelCells) throw new Error('Excel file contains no data');

  const data: Array<Record<string, string>> = [];

  rows.slice(1).forEach((row) => {
    const rowData: Record<string, string> = {};
    row.forEach((cell, i) => {
      rowData[labelCells[i].toString()] = cell.toString();
    });
    data.push(rowData);
  });

  return data;
};
