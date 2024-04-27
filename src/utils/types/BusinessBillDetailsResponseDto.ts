type BusinessBillDetailsResponseDto = {
  id: string;
  numDetails: string | null;
  numBill: string;
  numCreditNotes: string | null;
  numBusiness: string;
  productId: string | null;
  productReference: string | null;
  quantityBill: number | null;
  quantity: number;
  productDesignation: string;
  productDescription: string | null;
  productName: string;
  publicUnitPrice: number | null;
  reduction: number | null;
  unitPrice: number | null;
  totalPriceBill: number | null;
  totalPrice: number | null;
  taxDEEE: number | null;
  bom: boolean | null;
  createdDate: Date | null;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default BusinessBillDetailsResponseDto;
