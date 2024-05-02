import BillType from '../enums/BillType';
import BusinessBillDetailsResponseDto from './BusinessBillDetailsResponseDto';

type BusinessBillResponseDto = {
  id: string;
  number: string;
  billNumberOrder: string | null;
  numBusiness: string;
  shippingServicePrice: number;
  vat: number;
  totalAmount: number | null;
  totalAmountHT: number | null;
  numOrder: string;
  dateCN: Date | null;
  numBill: string;
  type: BillType;
  paid: number;
  payment: number | null;
  published: number | null;
  paymentDeadline: Date | null;
  billDetails: BusinessBillDetailsResponseDto[];
  bom: boolean | null;
  createdDate: Date | null;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default BusinessBillResponseDto;
