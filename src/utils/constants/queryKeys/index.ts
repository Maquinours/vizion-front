import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { addresses } from './address';
import { allBusinesses } from './allBusiness';
import { businesses } from './business';
import { businessArcDetails } from './businessArcDetails';
import { businessArcs } from './businessArcs';
import { businessBills } from './businessBill';
import { businessBls } from './businessBls';
import { businessBpDetails } from './businessBpDetails';
import { businessBpSerials } from './businessBpSerials';
import { businessBps } from './businessBps';
import { businessQuotationDetails } from './businessQuotationDetails';
import { businessQuotations } from './businessQuotations';
import { businessSubQuotations } from './businessSubQuotations';
import { commercialNotices } from './commercialNotices';
import { departments } from './departments';
import { emails } from './email';
import { enterprises } from './enterprise';
import { externalLinks } from './externalLink';
import { formationSubscriptions } from './formationSubscriptions';
import { formations } from './formations';
import { geds } from './ged';
import { lifesheets } from './lifesheet';
import { predefinedMessages } from './predefinedMessage';
import { predefinedTexts } from './predefinedText';
import products from './product';
import { productFilters } from './productFilter';
import { productSales } from './productSale';
import { productSerialNumbers } from './productSerialNumber';
import { productShelves } from './productShelf';
import { productStocks } from './productStocks';
import { productVersionShelfStockEntries } from './productVersionShelfStockEntries';
import { productVersionShelfStocks } from './productVersionShelfStocks';
import { productVersionStocks } from './productVersionStocks';
import { productVersions } from './productVersions';
import { profiles } from './profile';
import { progressiveInfos } from './progressiveInfo';
import { rdvs } from './rdv';
import { rdvUserInfos } from './rdvUserInfo';
import { rmas } from './rma';
import { salesVva } from './salesVva';
import { tasks } from './task';
import { taskComments } from './taskComment';
import { technicalSupports } from './technicalSupports';
import { turnovers } from './turnovers';
import { users } from './user';

// @ts-ignore
export const queries = mergeQueryKeys(
  businesses,
  businessQuotations,
  businessArcs,
  businessBills,
  emails,
  enterprises,
  departments,
  predefinedMessages,
  predefinedTexts,
  products,
  productVersions,
  productVersionShelfStocks,
  productVersionShelfStockEntries,
  productFilters,
  productSales,
  productSerialNumbers,
  productShelves,
  productStocks,
  profiles,
  progressiveInfos,
  rdvs,
  rdvUserInfos,
  rmas,
  tasks,
  taskComments,
  turnovers,
  salesVva,
  formations,
  formationSubscriptions,
  users,
  technicalSupports,
  addresses,
  allBusinesses,
  geds,
  lifesheets,
  commercialNotices,
  businessSubQuotations,
  businessQuotationDetails,
  businessArcDetails,
  businessBps,
  productVersionStocks,
  businessBpDetails,
  businessBpSerials,
  businessBls,
  externalLinks,
);
