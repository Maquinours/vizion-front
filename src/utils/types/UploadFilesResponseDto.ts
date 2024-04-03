import UploadedFile from './UploadedFile';

type UploadFilesResponseDto = {
  valid: boolean;
  content: UploadedFile[];
};

export default UploadFilesResponseDto;
