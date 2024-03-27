import CategoryClient from '../enums/CategoryClient';

type BpProductInfoHistoryResponseDto = {
  enterpriseName: string | null;
  businessNumber: string | null;
  businessId: string | null;
  enterpriseCategory: CategoryClient | null;
  qty: number | null;
  qtyPrepared: number | null;
  createdDate: string | null;
  modifiedDate: string | null;
};

export default BpProductInfoHistoryResponseDto;
