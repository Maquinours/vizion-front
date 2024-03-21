type LifeSheetResponseDto = {
  id: string;
  name?: string | null;
  receiver?: string | null;
  description?: string | null;
  content?: string | null;
  productId?: string | null;
  enterpriseId?: string | null;
  businessId?: string | null;
  rmaId?: string | null;
  technicalSupportId?: string | null;
  productReference?: string | null;
  enterpriseName?: string | null;
  businessNumber?: string | null;
  rmaNumber?: string | null;
  mailId?: string | null;
  comments?: string | null;
  createdDate?: Date | null;
  modifiedDate?: Date | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
};

export default LifeSheetResponseDto;
