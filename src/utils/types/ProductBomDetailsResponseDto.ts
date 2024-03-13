import ProductResponseDto from './ProductResponseDto';

type ProductBomDetailsProductResponseDto = Omit<ProductResponseDto, 'associatedProduct' | 'productBOMDetails' | 'productVersions' | 'specificationProducts'>;

type ProductBomDetailsResponseDto = {
  id: string;
  qte: number | null;
  product: ProductBomDetailsProductResponseDto | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default ProductBomDetailsResponseDto;
