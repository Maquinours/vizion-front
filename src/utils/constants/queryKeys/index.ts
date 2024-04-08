import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { predefinedMessages } from './predefinedMessage';
import { predefinedTexts } from './predefinedText';
import { products } from './product';
import { productFilters } from './productFilter';
import { productSales } from './productSale';

export const queries = mergeQueryKeys(predefinedMessages, predefinedTexts, products, productFilters, productSales);
