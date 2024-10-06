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
      'send-email',
    ])
    .optional()
    .catch(undefined),
  businessId: z.string().optional().catch(undefined),
  gedItemKey: z.string().optional().catch(undefined),
});

export const Route = createFileRoute('/app')({
  validateSearch: searchSchema,
  beforeLoad: ({ search, location }) => {
    const token = getToken();
    if (!token)
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.href },
        replace: true,
      });
    if (search.appModal?.startsWith('business-ged') && !search.businessId) {
      toast.error('Aucune affaire sélectionnée');
      throw redirect({
        to: '.',
        search: (old) => ({ ...old, appModal: undefined, businessId: undefined, gedItemKey: undefined }),
        replace: true,
        resetScroll: false,
      });
    }
    if ((search.appModal === 'business-ged-rename' || search.appModal === 'business-ged-delete') && !search.gedItemKey)
      throw redirect({
        to: '.',
        search: (old) => ({ ...old, appModal: 'business-ged', gedItemKey: undefined }),
        replace: true,
        resetScroll: false,
      });
  },
  loaderDeps: ({ search: { appModal, businessId, gedItemKey } }) => ({ appModal, businessId, gedItemKey }),
  loader: async ({ context: { queryClient }, deps: { appModal, businessId, gedItemKey } }) => {
    const userPromise = queryClient.ensureQueryData(users.authentified());
    const promises = [];
    if (businessId) promises.push(queryClient.ensureQueryData(businesses.detail._ctx.byId(businessId)));
    if (gedItemKey) {
      queryClient.ensureQueryData(geds.detail._ctx.byTypeAndId(FileType.AFFAIRE, businessId!)).then((ged) => {
        if (!findRecursively(ged, 'subRows', (d) => d.key === gedItemKey)) {
          // ged element does not exists
          throw redirect({ to: '.', search: (old) => ({ ...old, appModal: 'business-ged', gedItemKey: undefined }), replace: true, resetScroll: false });
        }
      });
    }
    switch (appModal) {
      case 'create-business':
      case 'create-client-business': {
        const currentUser = await userPromise;
        if (appModal === 'create-client-business') {
          if (!currentUser.userInfo.roles.some((role) => ['ROLE_DISTRIBUTEUR', 'ROLE_CLIENT'].includes(role)))
            throw redirect({
              to: '.',
              search: (old) => ({ ...old, appModal: undefined, businessId: undefined, gedItemKey: undefined }),
              replace: true,
              resetScroll: false,
            });
        }
        promises.push(queryClient.ensureQueryData(enterprises.detail(currentUser.profile.enterprise!.id)));
        break;
      }
      case 'send-email': {
        const currentUser = await userPromise;
        if (!currentUser.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'))
          throw redirect({
            to: '.',
            search: (old) => ({ ...old, appModal: undefined, businessId: undefined, gedItemKey: undefined }),
            replace: true,
            resetScroll: false,
          });
        break;
      }
    }
    await Promise.all(promises);
  },
});
