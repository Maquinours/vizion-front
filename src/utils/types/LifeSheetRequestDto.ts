import LifeSheetTaskRequestDto from './LifeSheetTaskRequestDto';

type LifeSheetRequestDto = {
  receiver?: string | null;
  name?: string | null;
  description?: string | null;
  content?: string | null;
  productId?: string | null;
  enterpriseId?: string | null;
  businessId?: string | null;
  rmaId?: string | null;
  mailId?: string | null;
  technicalSupportId?: string | null;
  productReference?: string | null;
  enterpriseName?: string | null;
  businessNumber?: string | null;
  rmaNumber?: string | null;
  technicalSupportName?: string | null;
  concernedId?: string | null;
  concernedName?: string | null;
  tasksDtoList?: LifeSheetTaskRequestDto[] | null;
};

export default LifeSheetRequestDto;
