type FileDataTreeResponseDto = {
  dir: boolean | null;
  name: string;
  ext: string;
  type: string;
  url: string;
  key: string;
  relativePath: string;
  absolutePath: string;
  fileStoragePath: string;
  subRows: FileDataTreeResponseDto[] | null;
  size: number;
  createdDate: Date;
  updatedAt: Date;
};

export default FileDataTreeResponseDto;
