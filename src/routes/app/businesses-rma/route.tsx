import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import AllBusinessState from '../../../utils/enums/AllBusinessState';
import CategoryClient from '../../../utils/enums/CategoryClient';
import { queries } from '../../../utils/constants/queryKeys';

const searchSchema = z.object({
  number: z.string().min(1).optional().catch(undefined),
  numOrder: z.string().min(1).optional().catch(undefined),
  name: z.string().min(1).optional().catch(undefined),
  contact: z.string().min(1).optional().catch(undefined),
  deliverPhoneNumber: z.string().min(1).optional().catch(undefined),
  zipCode: z.string().min(1).optional().catch(undefined),
  representative: z.string().min(1).uuid().optional().catch(undefined),
  installer: z.string().min(1).optional().catch(undefined),
  amounts: z.array(z.number().int()).length(2).optional().catch(undefined),
  enterpriseName: z.string().min(1).optional().catch(undefined),
  state: z.nativeEnum(AllBusinessState).optional().catch(undefined),
  dates: z.array(z.coerce.date()).length(2).optional().catch(undefined),
  excludeds: z.array(z.nativeEnum(CategoryClient)).catch([CategoryClient.FOURNISSEUR]),
  page: z.number().catch(0),
  size: z.union([z.literal(20), z.literal(30), z.literal(40), z.literal(50), z.literal(100), z.literal(150), z.literal(200)]).catch(50),
});

export const Route = createFileRoute('/app/businesses-rma')({
  validateSearch: (
    data: {
      number?: string;
      numOrder?: string;
      name?: string;
      contact?: string;
      deliverPhoneNumber?: string;
      zipCode?: string;
      representative?: string;
      installer?: string;
      amounts?: Array<number>;
      enterpriseName?: string;
      state?: AllBusinessState;
      dates?: Array<Date>;
      excludeds?: Array<CategoryClient>;
      page?: number;
      size?: 20 | 30 | 40 | 50 | 100 | 150 | 200;
    } & SearchSchemaInput,
  ) => searchSchema.parse(data),
  loaderDeps: ({
    search: {
      number,
      numOrder,
      name,
      contact,
      deliverPhoneNumber,
      zipCode,
      representative,
      amounts,
      installer,
      enterpriseName,
      state,
      dates,
      excludeds,
      page,
      size,
    },
  }) => ({
    number,
    numOrder,
    name,
    contact,
    deliverPhoneNumber,
    zipCode,
    representative,
    amounts,
    installer,
    enterpriseName,
    state,
    dates,
    excludeds,
    page,
    size,
  }),
  loader: ({
    context: { queryClient },
    deps: {
      number,
      numOrder,
      name,
      contact,
      deliverPhoneNumber,
      zipCode,
      representative,
      installer,
      amounts,
      enterpriseName,
      state,
      dates,
      excludeds,
      page,
      size,
    },
    location: {
      state: { qInfos },
    },
  }) => {
    queryClient.prefetchQuery(
      queries['all-businesses'].page._ctx.search(
        {
          numBusiness: number,
          numOrder,
          title: name,
          contact,
          deliverPhoneNumber,
          zipCode,
          representativeId: representative,
          installerName: installer,
          minAmount: amounts?.at(0),
          maxAmount: amounts?.at(1),
          enterpriseName,
          state,
          startDate: dates?.at(0),
          endDate: dates?.at(1),
          excludedList: excludeds,
          qInfos,
        },
        { page, size },
      ),
    );
  },
  staticData: {
    title: 'Tableau des affaires',
  },
});
