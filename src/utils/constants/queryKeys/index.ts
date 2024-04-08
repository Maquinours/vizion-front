import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { predefinedMessages } from './predefinedMessage';

export const queries = mergeQueryKeys(predefinedMessages);
