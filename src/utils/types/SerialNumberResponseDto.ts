import ProductSerialNumberResponseDto from './ProductSerialNumberResponseDto';

type SerialNumberResponseDto = {
  serialNumber: ProductSerialNumberResponseDto | null;
  vizeo: boolean;
  category: boolean;
};

export default SerialNumberResponseDto;
