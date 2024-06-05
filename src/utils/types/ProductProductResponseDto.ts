import ProductResponseDto from './ProductResponseDto';

type ProductProductResponseDto = Omit<ProductResponseDto, 'productCategory' | 'associatedProduct' | 'productVersions' | 'specifications'>;

export default ProductProductResponseDto;
