import BusinessBpSerialRequestDto from './BusinessBpSerialRequestDto';

type BusinessBpDetailsRequestDto = {
  bpId?: string | null;
  numDetails?: string | null;
  productId?: string | null;
  productVersionId?: string | null;
  productReference?: string | null;
  productVersionReference?: string | null;
  quantity?: number | null;
  quantityRemain?: number | null;
  quantityPrep?: number | null;
  productDesignation?: string | null;
  productDescription?: string | null;
  packageNumber?: string | null;
  productName?: string | null;
  publicUnitPrice?: number | null;
  comment?: string | null;
  unitPrice?: number | null;
  totalPrice?: number | null;
  bpSerialList?: BusinessBpSerialRequestDto[] | null;
  quantityDelivered?: number | null;
  totalAmount?: number | null;
  totalAmountHT?: number | null;
  shippingServicePrice?: number | null;
  virtualQty?: boolean | null;
};

export default BusinessBpDetailsRequestDto;
