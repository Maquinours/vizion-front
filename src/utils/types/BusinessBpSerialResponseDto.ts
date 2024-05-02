type BusinessBpSerialResponseDto = {
  id: string;
  numBP: string | null;
  productId: string | null;
  productVersionId: string | null;
  productReference: string | null;
  productVersionReference: string | null;
  numSerie: string;
  type: number;
  shelfId: string | null;
  shelf: string | null;
  createdDate: string | null;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default BusinessBpSerialResponseDto;
