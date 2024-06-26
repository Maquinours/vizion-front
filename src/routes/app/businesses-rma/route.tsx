import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import AllBusinessState from '../../../utils/enums/AllBusinessState';
import CategoryClient from '../../../utils/enums/CategoryClient';
import { queries } from '../../../utils/constants/queryKeys';

const searchSchema = z.object({
  number: z.string().optional().catch(undefined),
  numOrder: z.string().optional().catch(undefined),
  name: z.string().optional().catch(undefined),
  contact: z.string().optional().catch(undefined),
  deliverPhoneNumber: z.string().optional().catch(undefined),
  zipCode: z.string().optional().catch(undefined),
  representative: z.string().uuid().optional().catch(undefined),
  installer: z.string().optional().catch(undefined),
  enterpriseName: z.string().optional().catch(undefined),
  state: z.nativeEnum(AllBusinessState).optional().catch(undefined),
  dates: z.array(z.coerce.date().nullable()).length(2).catch([null, null]),
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
      enterpriseName?: string;
      state?: AllBusinessState;
      dates?: Array<Date | null>;
      excludeds?: Array<CategoryClient>;
      page?: number;
      size?: 20 | 30 | 40 | 50 | 100 | 150 | 200;
    } & SearchSchemaInput,
  ) => searchSchema.parse(data),
  loaderDeps: ({
    search: { number, numOrder, name, contact, deliverPhoneNumber, zipCode, representative, installer, enterpriseName, state, dates, excludeds, page, size },
  }) => ({ number, numOrder, name, contact, deliverPhoneNumber, zipCode, representative, installer, enterpriseName, state, dates, excludeds, page, size }),
  loader: ({
    context: { queryClient },
    deps: { number, numOrder, name, contact, deliverPhoneNumber, zipCode, representative, installer, enterpriseName, state, dates, excludeds, page, size },
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
          enterpriseName,
          state,
          startDate: dates.at(0),
          endDate: dates.at(1),
          excludedList: excludeds,
        },
        { page, size },
      ),
    );
  },
  staticData: {
    title: 'Tableau des affaires',
  },
});
