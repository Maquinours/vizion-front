import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { productQueryKeys } from '../../../../utils/constants/queryKeys/product';
import { getAssociatedProductsPage } from '../../../../utils/api/product';
import { productVersionQueryKeys } from '../../../../utils/constants/queryKeys/productVersion';
import { getProductVersionsPageByProductId } from '../../../../utils/api/productVersion';
import { productSpecificationQueryKeys } from '../../../../utils/constants/queryKeys/productSpecification';
import { getProductSpecificationsPageByProductId } from '../../../../utils/api/productSpecification';
import { productVersionShelfStocksQueryKeys } from '../../../../utils/constants/queryKeys/productVersionShelfStock';
import { getProductVersionShelfStocksPageByProductId } from '../../../../utils/api/productVersionShelfStock';
import { productSaleQueryKeys } from '../../../../utils/constants/queryKeys/productSale';
import { getProductSalesByProductId, getProductSalesByProductIdAndSearch } from '../../../../utils/api/productSale';
import { productStockEntryQueryKeys } from '../../../../utils/constants/queryKeys/productStockEntry';
import { getProductStockEntriesPageByProductId } from '../../../../utils/api/productStockEntry';
import { users } from '../../../../utils/constants/queryKeys/user';

const searchSchema = z.object({
  associatedProductsPage: z.number().min(0).catch(0),
  versionsPage: z.number().min(0).catch(0),
  specificationsPage: z.number().min(0).catch(0),
  stocksPage: z.number().min(0).catch(0),
  salesPage: z.number().min(0).catch(0),
  salesSize: z.union([z.literal(5), z.literal(20), z.literal(50), z.literal(100), z.literal(250), z.literal(500), z.literal(1000)]).catch(100),
  salesContact: z.string().optional(),
  salesDates: z.array(z.coerce.date()).min(2).max(2).optional().catch(undefined),
  stockEntriesPage: z.number().min(0).catch(0),
  stockEntriesSize: z.union([z.literal(5), z.literal(10), z.literal(15), z.literal(20), z.literal(25), z.literal(30), z.literal(50), z.literal(100)]).catch(5),
});

export const Route = createFileRoute('/app/products/$productId/manage')({
  validateSearch: searchSchema,
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
    queryClient.ensureQueryData({
      queryKey: productQueryKeys.pageByAssociatedProduct(productId, associatedProductsPage, associatedProductsSize),
      queryFn: () => getAssociatedProductsPage(productId, associatedProductsPage, associatedProductsSize),
    });

    queryClient.ensureQueryData({
      queryKey: productVersionQueryKeys.pageByProductId(productId, versionsPage, versionsSize),
      queryFn: () => getProductVersionsPageByProductId(productId, versionsPage, versionsSize),
    });

    queryClient.ensureQueryData({
      queryKey: productSpecificationQueryKeys.pageByProductId(productId, specificationsPage, specificationsSize),
      queryFn: () => getProductSpecificationsPageByProductId(productId, specificationsPage, specificationsSize),
    });

    queryClient.ensureQueryData({
      queryKey: productVersionShelfStocksQueryKeys.pageByProductId(productId, stocksPage, stocksSize),
      queryFn: () => getProductVersionShelfStocksPageByProductId(productId, stocksPage, stocksSize),
    });

    queryClient.ensureQueryData({
      queryKey: productSaleQueryKeys.detailByProductIdAndSearch(productId, salesContact, salesDates?.at(0), salesDates?.at(1), salesPage, salesSize),
      queryFn: () =>
        !!salesContact || !!salesDates
          ? getProductSalesByProductIdAndSearch(productId, salesContact, salesDates?.at(0), salesDates?.at(1), salesPage, salesSize)
          : getProductSalesByProductId(productId, salesPage, salesSize),
    });

    queryClient.ensureQueryData({
      queryKey: productStockEntryQueryKeys.pageByProductId(productId, stockEntriesPage, stockEntriesSize),
      queryFn: () => getProductStockEntriesPageByProductId(productId, stockEntriesPage, stockEntriesSize),
    });
  },
});
