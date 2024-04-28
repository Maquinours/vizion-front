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
import { turnovers } from './turnovers';
import { businesses } from './business';
import { businessBills } from './businessBill';
import { salesVva } from './salesVva';
import { formations } from './formations';
import { formationSubscriptions } from './formationSubscriptions';
import { productVersions } from './productVersions';
import { productVersionShelfStocks } from './productVersionShelfStocks';
import { productVersionShelfStockEntries } from './productVersionShelfStockEntries';
import { users } from './user';
import { technicalSupports } from './technicalSupports';
import { addresses } from './address';
import { allBusinesses } from './allBusiness';
import { businessQuotations } from './businessQuotations';
import { geds } from './ged';
import { lifesheets } from './lifesheet';
import { commercialNotices } from './commercialNotices';
import { businessArcs } from './businessArcs';
import { productStocks } from './productStocks';
import { businessSubQuotations } from './businessSubQuotations';
import { businessQuotationDetails } from './businessQuotationDetails';
import { businessArcDetails } from './businessArcDetails';
import { businessBps } from './businessBps';
import { productVersionStocks } from './productVersionStocks';
import { businessBpDetails } from './businessBpDetails';
import { businessBpSerials } from './businessBpSerials';
import { businessBls } from './businessBls';
import { externalLinks } from './externalLink';

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
