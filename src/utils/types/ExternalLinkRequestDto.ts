import ToolAccessLevel from '../enums/ToolAccessLevel';

type ExternalLinkRequestDto = {
  title: string;
  description: string;
  url?: string | null;
  fileUrl?: string | null;
  accessLevel: ToolAccessLevel;
  archived: boolean;
  type?: string | null;
  targetType?: string | null;
};

export default ExternalLinkRequestDto;
