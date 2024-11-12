import { SearchSchemaInput, createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { users } from '../../../../../utils/constants/queryKeys/user';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

const searchSchema = z.object({
  gedObjectRelativePath: z.string().catch(''),
});

export const Route = createFileRoute('/app/products_/$productId/informations/import-ged-files')({
  validateSearch: (data: { gedObjectRelativePath?: string } & SearchSchemaInput) => searchSchema.parse(data),
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'))
      throw redirect({
        from: Route.fullPath,
        to: '..',
        search: ({ lifesheetPage }) => ({ lifesheetPage }),
        replace: true,
      });
  },
  pendingComponent: LoaderModal,
});
