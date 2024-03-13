import AdvancedProductSpecificationResponseDto from './AdvancedProductSpecificationResponseDto';

type AdvancedSpecificationProductKeyResponseDto = {
  productId: string;
  specificationId: string;
};

type AdvancedProductSpecificationProductResponseDto = {
  id: AdvancedSpecificationProductKeyResponseDto | null;
  specification: AdvancedProductSpecificationResponseDto | null;
  value: string | null;
  minValue: string | null;
  maxValue: string | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default AdvancedProductSpecificationProductResponseDto;
