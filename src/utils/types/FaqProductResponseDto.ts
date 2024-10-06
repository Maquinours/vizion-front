import ProductResponseDto from './ProductResponseDto';

type FaqProductResponseDto = Omit<ProductResponseDto, 'faqList'>;

export default FaqProductResponseDto;
