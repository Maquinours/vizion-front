import BusinessBpDetailsRequestDto from './BusinessBpDetailsRequestDto';

type BusinessBpRequestDto = {
  number?: string | null;
  globalPrep?: number | null;
  dateBP?: Date | null;
  vat?: number | null;
  shippingServicePrice?: number | null;
  totalAmount?: number | null;
  totalAmountHT?: number | null;
  numOrder?: string | null;
  businessId?: string | null;
  bpDetailsList?: BusinessBpDetailsRequestDto[] | null;
  bom?: boolean | null;
};

export default BusinessBpRequestDto;
