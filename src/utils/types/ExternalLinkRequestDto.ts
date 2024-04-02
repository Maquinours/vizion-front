import FaqAccessLevel from '../enums/FaqAccessLevel';

type ExternalLinkRequestDto = {
  title: string;
  description: string;
  url?: string | null;
  fileUrl?: string | null;
  accessLevel: FaqAccessLevel;
  archived: boolean;
  type?: string | null;
  targetType?: string | null;
};

export default ExternalLinkRequestDto;
