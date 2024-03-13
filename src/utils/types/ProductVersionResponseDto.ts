import ProductResponseDto from './ProductResponseDto';

type ProductVersionProductResponseDto = Omit<
  ProductResponseDto,
  | 'shortDescription'
  | 'description'
  | 'category'
  | 'providerId'
  | 'providerName'
  | 'purchasePriceUSD'
  | 'purchasePriceEUR'
  | 'margin'
  | 'shippingService'
  | 'customsTax'
  | 'ecoTaxDEEE'
  | 'publicPrice'
  | 'assistanceTime'
  | 'vizeo'
  | 'productVersions'
  | 'associatedProduct'
  | 'specificationProducts'
  | 'faqList'
  | 'createdDate'
  | 'modifiedDate'
  | 'createdBy'
  | 'modifiedBy'
>;

type ProductVersionResponseDto = {
  id: string;
  reference: string | null;
  productRef: string | null;
  providerId: string | null;
  providerName: string | null;
  purchasePriceUSD: number | null;
  purchasePriceEUR: number | null;
  shippingService: number | null;
  margin: number | null;
  customsTax: number | null;
  ecoTaxDEEE: number | null;
  publicPrice: number | null;
  vizeo: boolean | null;
  virtualQty: boolean | null;
  bom: boolean | null;
  product: ProductVersionProductResponseDto | null;
  qty: number | null;
  createdDate: string;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default ProductVersionResponseDto;
