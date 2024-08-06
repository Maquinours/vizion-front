import readXlsxFile from 'read-excel-file';
import * as PDFJS from 'pdfjs-dist';

PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.js`;

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

export const pdfUriToBase64Image = async (uri: string): Promise<string> => {
  let pdf = await PDFJS.getDocument(uri).promise;
  const canvas = document.createElement('canvas');
  const page = await pdf.getPage(1); // 1 is first page
  let viewport = page.getViewport({ scale: 1 });
  const scale = Math.max(1000 / viewport.width, 750 / viewport.height);
  viewport = page.getViewport({ scale: scale });
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  const renderContext = {
    canvasContext: canvas.getContext('2d')!,
    viewport: viewport,
  };
  await page.render(renderContext).promise;
  const img = canvas.toDataURL('image/webp');
  return img;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const fileToBase64Image = async (file: File, { compress = false }: { compress?: boolean } = {}): Promise<string> => {
  if (file.type.startsWith('image/')) {
    if (compress && ['image/png', 'image/jpeg'].includes(file.type)) {
      return new Promise(async (resolve, reject) => {
        const image = new Image();
        // We compress the image in webp format to reduce its size
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          canvas.getContext('2d')!.drawImage(image, 0, 0);
          const img = canvas.toDataURL('image/webp');
          resolve(img);
        };
        image.onerror = (error) => {
          reject(error);
        };
        image.src = await fileToBase64(file);
      });
    } else {
      return await fileToBase64(file);
    }
  } else if (file.type === 'application/pdf') {
    let pdf = await PDFJS.getDocument(await fileToBase64(file)).promise;
    const canvas = document.createElement('canvas');
    const page = await pdf.getPage(1); // 1 is first page
    let viewport = page.getViewport({ scale: 1 });
    const scale = Math.max(1000 / viewport.width, 750 / viewport.height);
    viewport = page.getViewport({ scale: scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: canvas.getContext('2d')!,
      viewport: viewport,
    };
    await page.render(renderContext).promise;
    const img = canvas.toDataURL('image/webp');
    return img;
  }
  throw new Error('File type not supported');
};
