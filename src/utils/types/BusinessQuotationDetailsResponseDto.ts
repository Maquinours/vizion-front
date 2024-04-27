type BusinessQuotationDetailsResponseDto = {
  id: string;
  groupName: string;
  numDetails: string;
  productId: string | null;
  productReference: string;
  quantity: number | null;
  productDesignation: string;
  productDescription: string | null;
  productName: string;
  reduction: number | null;
  publicUnitPrice: number;
  unitPrice: number | null;
  totalPrice: number | null;
  taxDEEE: number | null;
  virtualQty: boolean | null;
  bom: boolean | null;
  createdDate: Date | null;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default BusinessQuotationDetailsResponseDto;
