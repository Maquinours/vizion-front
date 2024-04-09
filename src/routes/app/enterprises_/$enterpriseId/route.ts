import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { getTasksPageByEnterpriseId } from '../../../../utils/api/task';
import { queries } from '../../../../utils/constants/queryKeys';
import { allBusinesses } from '../../../../utils/constants/queryKeys/allBusiness';
import { enterprises } from '../../../../utils/constants/queryKeys/enterprise';
import { geds } from '../../../../utils/constants/queryKeys/ged';
import { lifesheets } from '../../../../utils/constants/queryKeys/lifesheet';
import { taskQueryKeys } from '../../../../utils/constants/queryKeys/task';
import FileType from '../../../../utils/enums/FileType';
import { LifesheetAssociatedItem } from '../../../../utils/enums/LifesheetAssociatedItem';
import { WorkloadAssociatedItem } from '../../../../utils/enums/WorkloadAssociatedItem';

const searchSchema = z.object({
  allBusinessPage: z.number().int().min(0).catch(0),
  contactsSearch: z.string().optional().catch(undefined),
  contactsPage: z.number().int().min(0).catch(0),
  lifesheetPage: z.number().int().min(0).catch(0),
});

export const Route = createFileRoute('/app/enterprises/$enterpriseId')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { allBusinessPage, contactsSearch, contactsPage, lifesheetPage } }) => ({
    allBusinessPage,
    contactsSearch,
    contactsPage,
    lifesheetPage,
  }),
  loader: ({ context: { queryClient }, params: { enterpriseId }, deps: { allBusinessPage, contactsSearch, contactsPage, lifesheetPage } }) => {
    const allBusinessSize = 15;
    const contactsSize = 5;
    const lifesheetSize = 5;
    const workloadsSize = 100;
    const workloadsPage = 0;

    queryClient.ensureQueryData(enterprises.detail(enterpriseId));
    queryClient.ensureQueryData(allBusinesses.page({ enterpriseId, page: allBusinessPage, size: allBusinessSize }));
    queryClient.prefetchQuery(queries.profiles.page._ctx.byEnterpriseIdAndSearch(enterpriseId, contactsSearch, { page: contactsPage, size: contactsSize }));
    queryClient.prefetchQuery(
      lifesheets
        .page({ page: lifesheetPage, size: lifesheetSize })
        ._ctx.byAssociatedItem({ associatedItemType: LifesheetAssociatedItem.ENTERPRISE, associatedItemId: enterpriseId }),
    );
    queryClient.ensureQueryData({
      queryKey: taskQueryKeys.pageByAssociatedItemAndId(WorkloadAssociatedItem.ENTERPRISE, enterpriseId, workloadsPage, workloadsSize),
      queryFn: () => getTasksPageByEnterpriseId(enterpriseId, workloadsPage, workloadsSize),
    });
    queryClient.ensureQueryData(geds.detail._ctx.byTypeAndId(FileType.CONTACT, enterpriseId));
  },
});
