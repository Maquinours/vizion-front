type BusinessArcDetailsResponseDto = {
  id: string;
  productId: string | null;
  numDetails: string;
  productReference: string;
  quantity: number;
  productDesignation: string;
  productDescription: string | null;
  productName: string;
  reduction: number;
  publicUnitPrice: number;
  unitPrice: number;
  totalPrice: number;
  taxDEEE: number;
  stock: boolean | null;
  availableDate: Date | null;
  virtualQty: boolean | null;
  bom: boolean | null;
  createdDate: Date | null;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default BusinessArcDetailsResponseDto;
