import AdvancedProductSpecificationProductResponseDto from './AdvancedProductSpecificationProductResponseDto';
import ProductBomDetailsResponseDto from './ProductBomDetailsResponseDto';
import ProductVersionResponseDto from './ProductVersionResponseDto';

type ProductProductResponseDto = Omit<ProductResponseDto, 'productCategory' | 'associatedProduct' | 'productVersions' | 'specifications'>;

type ProductProductBomDetailsResponseDto = Omit<ProductBomDetailsResponseDto, 'productBOM'>;

type ProductResponseDto = {
  id: string;
  name: string | null;
  reference: string | null;
  shortDescription: string;
  description: string | null;
  category: string | null;
  providerId: string | null;
  providerName: string | null;
  purchasePriceUSD: number | null;
  purchasePriceEUR: number | null;
  margin: number | null;
  shippingService: number | null;
  customsTax: number | null;
  ecoTaxDEEE: number | null;
  publicPrice: number | null;
  assistanceTime: number | null;
  vizeo: boolean | null;
  virtualQty: boolean | null;
  bom: boolean | null;
  productVersions: ProductVersionResponseDto[] | null;
  associatedProduct: ProductProductResponseDto[] | null;
  specificationProducts: AdvancedProductSpecificationProductResponseDto[] | null;
  qty: number | null;
  productBOMDetails: ProductProductBomDetailsResponseDto[] | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default ProductResponseDto;
