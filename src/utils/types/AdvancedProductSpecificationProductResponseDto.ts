import AdvancedProductSpecificationResponseDto from './AdvancedProductSpecificationResponseDto';

type AdvancedSpecificationProductKeyResponseDto = {
  productId: string;
  specificationId: string;
};

type AdvancedProductSpecificationProductResponseDto = {
  id: AdvancedSpecificationProductKeyResponseDto | null;
  specification: AdvancedProductSpecificationResponseDto | null;
  value: number | null;
  minValue: number | null;
  maxValue: number | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default AdvancedProductSpecificationProductResponseDto;
