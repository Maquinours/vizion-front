import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../utils/constants/queryKeys';
import { allBusinesses } from '../../../utils/constants/queryKeys/allBusiness';
import { enterprises } from '../../../utils/constants/queryKeys/enterprise';
import { geds } from '../../../utils/constants/queryKeys/ged';
import { lifesheets } from '../../../utils/constants/queryKeys/lifesheet';
import FileType from '../../../utils/enums/FileType';
import { LifesheetAssociatedItem } from '../../../utils/enums/LifesheetAssociatedItem';
import { WorkloadAssociatedItem } from '../../../utils/enums/WorkloadAssociatedItem';
import Page from '../../../utils/types/Page';
import EnterpriseResponseDto from '../../../utils/types/EnterpriseResponseDto';
import { QueryKey } from '@tanstack/react-query';

const searchSchema = z.object({
  allBusinessPage: z.number().int().min(0).catch(0),
  contactsSearch: z.string().optional().catch(undefined),
  contactsPage: z.number().int().min(0).catch(0),
  lifesheetPage: z.number().int().min(0).catch(0),
  allBusinessProfileId: z.uuid().optional().catch(undefined),
  allBusinessSortBy: z
    .union([z.literal('number'), z.literal('totalHt'), z.literal('modifiedDate'), z.literal('state')])
    .optional()
    .catch(undefined),
  allBusinessSortOrder: z
    .union([z.literal('ASC'), z.literal('DESC')])
    .optional()
    .catch(undefined),
  fromCall: z.boolean().optional().catch(undefined),
  enterpriseModal: z.enum(['before-close']).optional().catch(undefined),
});

export const Route = createFileRoute('/app/enterprises_/$enterpriseId')({
  validateSearch: (
    data: {
      allBusinessPage?: number;
      contactsSearch?: string;
      contactsPage?: number;
      lifesheetPage?: number;
      allBusinessProfileId?: string;
      allBusinessSortBy?: 'number' | 'totalHt' | 'modifiedDate' | 'state';
      allBusinessSortOrder?: 'ASC' | 'DESC';
      fromCall?: boolean;
    } & SearchSchemaInput,
  ) => searchSchema.parse(data),
  loaderDeps: ({
    search: { allBusinessPage, contactsSearch, contactsPage, lifesheetPage, allBusinessProfileId, allBusinessSortBy, allBusinessSortOrder },
  }) => ({
    allBusinessPage,
    contactsSearch,
    contactsPage,
    lifesheetPage,
    allBusinessProfileId,
    allBusinessSortBy,
    allBusinessSortOrder,
  }),
  loader: async ({
    context: { queryClient },
    params: { enterpriseId },
    deps: { allBusinessPage, contactsSearch, contactsPage, lifesheetPage, allBusinessProfileId, allBusinessSortBy, allBusinessSortOrder },
  }) => {
    const allBusinessSize = 15;
    const contactsSize = 5;
    const lifesheetSize = 5;
    const workloadsSize = 100;
    const workloadsPage = 0;

    let initialDataKey: QueryKey | undefined = undefined;
    const enterprisePromise = queryClient.ensureQueryData({
      ...enterprises.detail(enterpriseId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<EnterpriseResponseDto>>({ queryKey: enterprises.page._def })) {
          const item = value?.content.find((item) => item.id === enterpriseId);
          if (item) {
            initialDataKey = key;
            return item;
          }
        }
      },
      initialDataUpdatedAt: () => (initialDataKey ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt : undefined),
    });

    queryClient.prefetchQuery(
      allBusinesses.page._ctx.byEnterpriseIdAndPossibleProfileId({
        enterpriseId,
        profileId: allBusinessProfileId,
        page: allBusinessPage,
        size: allBusinessSize,
        sortBy: allBusinessSortBy,
        sortOrder: allBusinessSortOrder,
      }),
    );
    queryClient.prefetchQuery(queries.profiles.page._ctx.byEnterpriseIdAndSearch(enterpriseId, contactsSearch, { page: contactsPage, size: contactsSize }));
    queryClient.prefetchQuery(
      lifesheets.page({ page: lifesheetPage, size: lifesheetSize })._ctx.byAssociatedItem({
        associatedItemType: LifesheetAssociatedItem.ENTERPRISE,
        associatedItemId: enterpriseId,
      }),
    );
    queryClient.prefetchQuery(
      queries.tasks.page._ctx.byAssociatedItem(
        {
          associatedItemType: WorkloadAssociatedItem.ENTERPRISE,
          associatedItemId: enterpriseId,
        },
        { page: workloadsPage, size: workloadsSize },
      ),
    );
    queryClient.prefetchQuery(geds.detail._ctx.byTypeAndId(FileType.CONTACT, enterpriseId));

    await enterprisePromise;
  },
  staticData: {
    getTitle: async (queryClient, match) => {
      const enterpriseId = (match.params as { enterpriseId: string }).enterpriseId;
      const enterprise = await queryClient.ensureQueryData({ ...queries.enterprise.detail(enterpriseId) });
      return enterprise.name;
    },
    getCloseTabRoute: (prev) =>
      prev.search.fromCall
        ? {
            to: prev.to,
            params: prev.params,
            search: { ...prev.search, enterpriseModal: 'before-close' },
          }
        : undefined,
  },
});
