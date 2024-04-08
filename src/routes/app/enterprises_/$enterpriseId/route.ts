import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { getProfilesPageByEnterpriseId, getProfilesPageByEnterpriseIdAndSearch } from '../../../../utils/api/profile';
import { getTasksPageByEnterpriseId } from '../../../../utils/api/task';
import { allBusinesses } from '../../../../utils/constants/queryKeys/allBusiness';
import { enterprises } from '../../../../utils/constants/queryKeys/enterprise';
import { geds } from '../../../../utils/constants/queryKeys/ged';
import { lifesheets } from '../../../../utils/constants/queryKeys/lifesheet';
import { profileQueryKeys } from '../../../../utils/constants/queryKeys/profile';
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
    queryClient.ensureQueryData({
      queryKey: profileQueryKeys.pageByEnterpriseIdAndSearch(enterpriseId, contactsSearch, contactsPage, contactsSize),
      queryFn: () =>
        contactsSearch
          ? getProfilesPageByEnterpriseIdAndSearch(enterpriseId, contactsSearch, contactsPage, 5)
          : getProfilesPageByEnterpriseId(enterpriseId, contactsPage, 5),
    });
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
