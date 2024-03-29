import FaqAccessLevel from '../enums/FaqAccessLevel';

type ExternalLinkResponseDto = {
  id: string;
  title: string;
  url: string | null;
  fileUrl: string | null;
  description: string;
  type: string | null;
  targetType: string | null;
  accessLevel: FaqAccessLevel;
  archived: boolean;
  createdDate: string;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default ExternalLinkResponseDto;
