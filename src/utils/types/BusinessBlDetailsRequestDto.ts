type BusinessBlDetailsRequestDto = {
  blId?: string | null;
  numDetails?: string | null;
  numBusiness?: string | null;
  productId?: string | null;
  bpDetailId?: string | null;
  productVersionId?: string | null;
  comment?: string | null;
  packageNumber?: string | null;
  productReference?: string | null;
  productVersionReference?: string | null;
  quantityDelivered?: number | null;
  quantityOrdered?: number | null;
  productDesignation?: string | null;
  productDescription?: string | null;
  productName?: string | null;
  publicUnitPrice?: number | null;
  unitPrice?: number | null;
  totalAmount?: number | null;
  totalAmountHT?: number | null;
  bom?: boolean | null;
};

export default BusinessBlDetailsRequestDto;
