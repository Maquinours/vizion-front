import FileType from '../../../../../../../../../../utils/enums/FileType';

type MailFileToDestinationRequestDto = {
  path?: string | null;
  type?: FileType | null;
  keyId?: string | null;
  fileList?: Array<string> | null;
};

export default MailFileToDestinationRequestDto;
