import ToolAccessLevel from '../enums/ToolAccessLevel';

type ExternalLinkResponseDto = {
  id: string;
  title: string;
  url: string | null;
  fileUrl: string | null;
  description: string;
  type: string | null;
  targetType: string | null;
  accessLevel: ToolAccessLevel;
  archived: boolean;
  createdDate: string;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default ExternalLinkResponseDto;
