type BusinessBillDetailsRequestDto = {
  billId?: string | null;
  numDetails?: string | null;
  numBill?: string | null;
  numCreditNotes?: string | null;
  numBusiness?: string | null;
  productId?: string | null;
  productReference?: string | null;
  quantityBill?: number | null;
  quantity?: number | null;
  productDesignation?: string | null;
  productDescription?: string | null;
  productName?: string | null;
  publicUnitPrice?: number | null;
  reduction?: number | null;
  unitPrice?: number | null;
  totalPriceBill?: number | null;
  totalPrice?: number | null;
  taxDEEE?: number | null;
  totalAmount?: number | null;
  totalAmountHt?: number | null;
  bom?: boolean | null;
};

export default BusinessBillDetailsRequestDto;
