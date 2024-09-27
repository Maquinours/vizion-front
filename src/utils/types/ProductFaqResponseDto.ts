import FaqResponseDto from './FaqResponseDto';

type ProductFaqResponseDto = Omit<FaqResponseDto, 'products'>;

export default ProductFaqResponseDto;
