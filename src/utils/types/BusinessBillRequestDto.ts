import BillType from '../enums/BillType';
import BusinessBillDetailsRequestDto from './BusinessBillDetailsRequestDto';
import BusinessRequestDto from './BusinessRequestDto';

type BusinessBillRequestDto = {
  number?: string | null;
  numBusiness?: string | null;
  shippingServicePrice?: number | null;
  vat?: number | null;
  totalAmount?: number | null;
  totalAmountHT?: number | null;
  numOrder?: string | null;
  paid?: number | null;
  payment?: number | null;
  businessId?: string | null;
  published?: number | null;
  dateCN?: Date | null;
  numBill?: string | null;
  type?: BillType | null;
  detailsDtoList?: BusinessBillDetailsRequestDto[] | null;
  businessDto?: BusinessRequestDto | null;
  paymentDeadline?: Date | null;
  bom?: boolean | null;
};

export default BusinessBillRequestDto;
