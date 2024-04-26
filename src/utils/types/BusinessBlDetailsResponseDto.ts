type BusinessBlDetailsResponseDto = {
  id: string;
  numDetails: string;
  numBusiness: string;
  productReference: string;
  productVersionReference: string | null;
  comment: string | null;
  packageNumber: string | null;
  quantityDelivered: number | null;
  quantityOrdered: number | null;
  productDesignation: string;
  productDescription: string | null;
  productId: string | null;
  productVersionId: string | null;
  productName: string | null;
  publicUnitPrice: number | null;
  numBL: number | null;
  unitPrice: number | null;
  bom: boolean | null;
  createdDate: string | null;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default BusinessBlDetailsResponseDto;
