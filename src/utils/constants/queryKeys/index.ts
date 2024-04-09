import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { predefinedMessages } from './predefinedMessage';
import { predefinedTexts } from './predefinedText';
import products from './product';
import { productFilters } from './productFilter';
import { productSales } from './productSale';
import { productSerialNumbers } from './productSerialNumber';
import { productShelves } from './productShelf';
import { enterprises } from './enterprise';
import { profiles } from './profile';
import { progressiveInfos } from './progressiveInfo';

export const queries = mergeQueryKeys(
  enterprises,
  predefinedMessages,
  predefinedTexts,
  products,
  productFilters,
  productSales,
  productSerialNumbers,
  productShelves,
  profiles,
  progressiveInfos,
);
