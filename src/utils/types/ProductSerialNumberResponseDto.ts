type ProductSerialNumberResponseDto = {
  id: string;
  serialNumber: string | null;
  productId: string | null;
  productVersionId: string | null;
  productVersionRef: string | null;
  productRef: string | null;
  businessNumber: string | null;
  providerBusinessNumber: string | null;
  providerBusinessId: string | null;
  businessId: string | null;
  soldState: boolean | null;
  defaultStock: boolean | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default ProductSerialNumberResponseDto;
