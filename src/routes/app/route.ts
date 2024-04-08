import { createFileRoute, redirect } from '@tanstack/react-router';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { businesses } from '../../utils/constants/queryKeys/business';
import { enterprises } from '../../utils/constants/queryKeys/enterprise';
import { geds } from '../../utils/constants/queryKeys/ged';
import { users } from '../../utils/constants/queryKeys/user';
import FileType from '../../utils/enums/FileType';
import { findRecursively } from '../../utils/functions/arrays';
import { getToken } from '../../utils/functions/token';

const searchSchema = z.object({
  mobileSidebar: z
    .boolean()
    .optional()
    .transform((value) => (value === true ? value : undefined))
    .catch(undefined),
  appModal: z
    .enum([
      'create-business',
      'business-ged',
      'business-ged-create-dir',
      'business-ged-import-files',
      'business-ged-rename',
      'business-ged-delete',
      'create-client-business',
    ])
    .optional()
    .catch(undefined),
  businessId: z.string().optional().catch(undefined),
  gedItemKey: z.string().optional().catch(undefined),
});

export const Route = createFileRoute('/app')({
  validateSearch: searchSchema,
  beforeLoad: ({ search }) => {
    const token = getToken();
    if (!token)
      throw redirect({
        to: '/auth/login',
      });
    if (search.appModal?.startsWith('business-ged') && !search.businessId) {
      toast.error('Aucune affaire sélectionnée');
      throw redirect({
        from: Route.id,
        search: (old) => ({ ...old, appModal: undefined, businessId: undefined, gedItemKey: undefined }),
      });
    }
    if ((search.appModal === 'business-ged-rename' || search.appModal === 'business-ged-delete') && !search.gedItemKey)
      throw redirect({
        from: Route.id,
        search: (old) => ({ ...old, appModal: 'business-ged', gedItemKey: undefined }),
      });
  },
  loaderDeps: ({ search: { appModal, businessId, gedItemKey } }) => ({ appModal, businessId, gedItemKey }),
  loader: async ({ context: { queryClient }, deps: { appModal, businessId, gedItemKey } }) => {
    const userPromise = queryClient.ensureQueryData(users.authentified());
    const promises = [];
    if (businessId) promises.push(queryClient.ensureQueryData(businesses.detail(businessId)));
    if (gedItemKey) {
      queryClient.ensureQueryData(geds.detail._ctx.byTypeAndId(FileType.AFFAIRE, businessId!)).then((ged) => {
        if (!findRecursively(ged, 'subRows', (d) => d.key === gedItemKey)) {
          // ged element does not exists
          throw redirect({
            from: Route.id,
            search: (old) => ({ ...old, appModal: 'business-ged', gedItemKey: undefined }),
          });
        }
      });
    }
    if (appModal === 'create-client-business') {
      const currentUser = await userPromise;
      if (!currentUser.userInfo.roles.some((role) => ['ROLE_DISTRIBUTEUR', 'ROLE_CLIENT'].includes(role)))
        throw redirect({
          from: Route.id,
          search: (old) => ({ ...old, appModal: undefined, businessId: undefined, gedItemKey: undefined }),
        });
    }
    if (appModal === 'create-business' || appModal === 'create-client-business') {
      const currentUser = await userPromise;
      promises.push(queryClient.ensureQueryData(enterprises.detail(currentUser.profile.enterprise!.id)));
    }
    await Promise.all(promises);
  },
});
