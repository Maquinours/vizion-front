import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';
import CategoryClient from '../../../../../utils/enums/CategoryClient';
import { users } from '../../../../../utils/constants/queryKeys/user';
import { redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/app/tools/menu/create-enterprise')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.fullPath, to: '..', search: true, replace: true });
  },
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(queries.departments.list);
    queryClient.prefetchQuery(queries.enterprise.list._ctx.byCategory(CategoryClient.REPRESENTANT));
  },
  pendingComponent: LoaderModal,
});
