import BusinessBpSerialResponseDto from './BusinessBpSerialResponseDto';

type BusinessBpDetailsResponseDto = {
  id: string;
  numDetails: string;
  productId: string | null;
  productVersionId: string | null;
  productReference: string;
  productVersionReference: string | null;
  quantity: number | null;
  quantityRemain: number | null;
  quantityPrep: number | null;
  quantityDelivered: number | null;
  productDesignation: string;
  productDescription: string | null;
  productName: string;
  publicUnitPrice: number | null;
  virtualQty: boolean | null;
  comment: string | null;
  numBusiness: string | null;
  unitPrice: number;
  packageNumber: string | null;
  bpSerialList: BusinessBpSerialResponseDto[] | null;
  createdDate: Date | null;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default BusinessBpDetailsResponseDto;
