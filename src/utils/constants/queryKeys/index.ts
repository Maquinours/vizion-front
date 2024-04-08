import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { predefinedMessages } from './predefinedMessage';
import { predefinedTexts } from './predefinedText';
import { products } from './product';

export const queries = mergeQueryKeys(predefinedMessages, predefinedTexts, products);
