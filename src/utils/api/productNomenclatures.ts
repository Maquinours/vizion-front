import { privateInstance } from '../functions/axios';
import ProductBomDetailsRequestDto from '../types/ProductBomDetailsRequestDto';
import ProductBomDetailsResponseDto from '../types/ProductBomDetailsResponseDto';

export const addProductNomenclatureDetail = (productId: string, data: ProductBomDetailsRequestDto) => {
  return privateInstance<ProductBomDetailsResponseDto>({
    method: 'POST',
    url: `/product/v1/product-bom-details/add/${encodeURIComponent(productId)}`,
    data,
  }).then((res) => res.data);
};

export const updateProductNomenclatureDetail = (productId: string, nomenclatureDetailId: string, data: ProductBomDetailsRequestDto) => {
  return privateInstance<ProductBomDetailsResponseDto>({
    method: 'PUT',
    url: `/product/v1/product-bom-details/${encodeURIComponent(productId)}/${encodeURIComponent(nomenclatureDetailId)}`,
    data,
  }).then((res) => res.data);
};

export const deleteProductNomenclatureDetail = (nomenclatureDetailId: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/product/v1/product-bom-details/delete/${encodeURIComponent(nomenclatureDetailId)}`,
  }).then((res) => res.data);
};
