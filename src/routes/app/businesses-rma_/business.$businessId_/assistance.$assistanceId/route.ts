import { createFileRoute } from '@tanstack/react-router';
import { technicalSupportRecapOptionsQueryKeys } from '../../../../../utils/constants/queryKeys/technicalSupportRecapOptions';
import { queries } from '../../../../../utils/constants/queryKeys';
import { lifesheets } from '../../../../../utils/constants/queryKeys/lifesheet';
import { LifesheetAssociatedItem } from '../../../../../utils/enums/LifesheetAssociatedItem';
import { geds } from '../../../../../utils/constants/queryKeys/ged';
import FileType from '../../../../../utils/enums/FileType';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/assistance/$assistanceId')({
  loader: async ({ context: { queryClient }, params: { assistanceId } }) => {
    queryClient.prefetchQuery(technicalSupportRecapOptionsQueryKeys.list._ctx.byTechnicalSupportId(assistanceId));
    queryClient.prefetchQuery(
      lifesheets.page({ page: 0, size: 100 })._ctx.byAssociatedItem({ associatedItemType: LifesheetAssociatedItem.ASSISTANCE, associatedItemId: assistanceId }),
    );
    queryClient.prefetchQuery(geds.detail._ctx.byTypeAndId(FileType.ASSISTANCE, assistanceId));
    await queryClient.ensureQueryData(queries['technical-supports'].detail._ctx.byId(assistanceId));
  },
  staticData: {
    getTitle: (queryClient, match) =>
      queryClient
        .ensureQueryData(queries['technical-supports'].detail._ctx.byId((match.params as { assistanceId: string }).assistanceId))
        .then((assistance) => `Assistance (${assistance.businessNumber})`),
  },
});
