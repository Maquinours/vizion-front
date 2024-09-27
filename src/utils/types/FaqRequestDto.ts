import FaqAccessLevel from '../enums/FaqAccessLevel';

type FaqRequestDto = {
  title: string;
  description: string;
  accessLevel: FaqAccessLevel;
  archived: boolean;
  products?: string[] | null;
};

export default FaqRequestDto;
