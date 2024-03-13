type AdvancedProductSpecificationResponseDto = {
  id: string;
  name: string | null;
  type: string | null;
  unit: string | null;
  comment: string | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default AdvancedProductSpecificationResponseDto;
