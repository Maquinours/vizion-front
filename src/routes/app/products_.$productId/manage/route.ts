import { SearchSchemaInput, createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';
import { users } from '../../../../utils/constants/queryKeys/user';

const searchSchema = z.object({
  associatedProductsPage: z.number().min(0).catch(0),
  versionsPage: z.number().min(0).catch(0),
  specificationsPage: z.number().min(0).catch(0),
  stocksPage: z.number().min(0).catch(0),
  salesPage: z.number().min(0).catch(0),
  salesSize: z.union([z.literal(5), z.literal(20), z.literal(50), z.literal(100), z.literal(250), z.literal(500), z.literal(1000)]).catch(100),
  salesContact: z.string().optional(),
  salesDates: z.array(z.coerce.date()).length(2).optional().catch(undefined),
  stockEntriesPage: z.number().min(0).catch(0),
  stockEntriesSize: z.union([z.literal(5), z.literal(10), z.literal(15), z.literal(20), z.literal(25), z.literal(30), z.literal(50), z.literal(100)]).catch(5),
});

export const Route = createFileRoute('/app/products/$productId/manage')({
  validateSearch: (
    data: {
      associatedProductsPage?: number;
      versionsPage?: number;
      specificationsPage?: number;
      stocksPage?: number;
      salesPage?: number;
      salesSize?: number;
      salesContact?: string;
      salesDates?: Array<Date>;
      stockEntriesPage?: number;
      stockEntriesSize?: number;
    } & SearchSchemaInput,
  ) => searchSchema.parse(data),
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'))
      throw redirect({ from: Route.id, to: '../informations', search: { lifesheetPage: 0 }, replace: true });
  },
  loaderDeps: ({
    search: {
      associatedProductsPage,
      versionsPage,
      specificationsPage,
      stocksPage,
      salesPage,
      salesSize,
      salesContact,
      salesDates,
      stockEntriesPage,
      stockEntriesSize,
    },
  }) => ({
    associatedProductsPage,
    associatedProductsSize: 5,
    versionsPage,
    versionsSize: 5,
    specificationsPage,
    specificationsSize: 5,
    stocksPage,
    stocksSize: 5,
    salesPage,
    salesSize,
    salesContact,
    salesDates,
    stockEntriesPage,
    stockEntriesSize,
  }),
  loader: ({
    context: { queryClient },
    params: { productId },
    deps: {
      associatedProductsPage,
      associatedProductsSize,
      versionsPage,
      versionsSize,
      specificationsPage,
      specificationsSize,
      stocksPage,
      stocksSize,
      salesPage,
      salesSize,
      salesContact,
      salesDates,
      stockEntriesPage,
      stockEntriesSize,
    },
  }) => {
    queryClient.ensureQueryData(queries.product.detail(productId)).then((product) => {
      queryClient.prefetchQuery(
        queries['product-sale'].detail._ctx.byProductRefAndSearch({
          productRef: product.reference!,
          contact: salesContact,
          startDate: salesDates?.at(0),
          endDate: salesDates?.at(1),
          page: salesPage,
          size: salesSize,
        }),
      );
    });

    queryClient.prefetchQuery(queries.product.page({ page: associatedProductsPage, size: associatedProductsSize })._ctx.byAssociatedProductId(productId));

    queryClient.prefetchQuery(queries.product.detail(productId)._ctx.versions._ctx.page({ page: versionsPage, size: versionsSize }));

    queryClient.prefetchQuery(queries.product.detail(productId)._ctx.specifications._ctx.page({ page: specificationsPage, size: specificationsSize }));

    queryClient.prefetchQuery(queries.product.detail(productId)._ctx.versionShelfStocks._ctx.page({ page: stocksPage, size: stocksSize }));

    queryClient.prefetchQuery(queries.product.detail(productId)._ctx.stockEntries._ctx.page({ page: stockEntriesPage, size: stockEntriesSize }));
  },
});
