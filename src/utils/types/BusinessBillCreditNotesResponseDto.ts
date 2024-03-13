type BusinessBillCreditNotesResponseDto = {
  id: string;
  number: string;
  billNumberOrder: number | null;
  numBusiness: string;
  shippingServicePrice: number;
  vat: number;
  totalAmount: number | null;
  totalAmountHT: number | null;
  numOrder: string;
  dateCN: Date | null;
  numBill: string | null;
  paid: boolean;
  payment: number | null;
  published: number | null;
  paymentDeadline: Date | null;
  createdDate: Date | null;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default BusinessBillCreditNotesResponseDto;
