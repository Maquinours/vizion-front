import SerialNumberOperationType from '../enums/SerialNumberOperationType';

type BusinessBpSerialRequestDto = {
  productId?: string | null;
  productVersionId?: string | null;
  bpId?: string | null;
  bpDetailId?: string | null;
  buninessNumber?: string | null;
  productReference?: string | null;
  productVersionReference?: string | null;
  numBP?: string | null;
  numSerie?: string | null;
  extern?: boolean | null;
  type?: SerialNumberOperationType | null;
  shelfId?: string | null;
};

export default BusinessBpSerialRequestDto;
