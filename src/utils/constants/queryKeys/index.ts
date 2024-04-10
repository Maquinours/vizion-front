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
import { rdvs } from './rdv';
import { rdvUserInfos } from './rdvUserInfo';
import { rmas } from './rma';
import { tasks } from './task';
import { taskComments } from './taskComment';
import { emails } from './email';
import { departments } from './departments';

export const queries = mergeQueryKeys(
  emails,
  enterprises,
  departments,
  predefinedMessages,
  predefinedTexts,
  products,
  productFilters,
  productSales,
  productSerialNumbers,
  productShelves,
  profiles,
  progressiveInfos,
  rdvs,
  rdvUserInfos,
  rmas,
  tasks,
  taskComments,
);
