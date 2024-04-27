import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import _ from 'lodash';
import FileType from '../../../../../utils/enums/FileType';
import { LifesheetAssociatedItem } from '../../../../../utils/enums/LifesheetAssociatedItem';
import { WorkloadAssociatedItem } from '../../../../../utils/enums/WorkloadAssociatedItem';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/dashboard')({
  loaderDeps: () => ({ lifesheetSize: 100, lifesheetPage: 0, tasksPage: 0, tasksSize: 100 }),
  loader: async ({ context: { queryClient }, params: { businessId }, deps: { lifesheetSize, lifesheetPage, tasksPage, tasksSize } }) => {
    queryClient.ensureQueryData(queries.user.authentified()).then((user) => {
      if (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) {
        queryClient.prefetchQuery(
          queries.lifesheets
            .page({ page: lifesheetPage, size: lifesheetSize })
            ._ctx.byAssociatedItem({ associatedItemType: LifesheetAssociatedItem.BUSINESS, associatedItemId: businessId }),
        );
        queryClient.prefetchQuery(
          queries.tasks.page._ctx.byAssociatedItem(
            { associatedItemType: WorkloadAssociatedItem.BUSINESS, associatedItemId: businessId },
            { page: tasksPage, size: tasksSize },
          ),
        );
        queryClient.prefetchQuery(queries.businesses.list._ctx.all);
      }
    });
    queryClient.prefetchQuery(queries.departments.list);
    queryClient.prefetchQuery(queries.geds.detail._ctx.byTypeAndId(FileType.AFFAIRE, businessId));
    const business = await queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId));
    const profileIds = _.uniq([business.createdBy, business.modifiedBy].filter((id) => id !== null) as Array<string>);
    if (profileIds.length > 0) queryClient.prefetchQuery(queries.profiles.list._ctx.byIds(profileIds));
  },
});
