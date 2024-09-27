import FaqAccessLevel from '../enums/FaqAccessLevel';
import FaqProductResponseDto from './FaqProductResponseDto';

type FaqResponseDto = {
  id: string;
  title: string;
  description: string;
  accessLevel: FaqAccessLevel;
  archived: boolean;
  products: Array<FaqProductResponseDto> | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default FaqResponseDto;
