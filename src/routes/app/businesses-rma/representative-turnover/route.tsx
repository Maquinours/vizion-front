import { SearchSchemaInput, createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

const searchSchema = z.object({
  year: z.number().catch(new Date().getFullYear()),
  month: z.number().catch(new Date().getMonth() + 1),
});

export const Route = createFileRoute('/app/businesses-rma/representative-turnover')({
  validateSearch: (data: { month?: number; year?: number } & SearchSchemaInput) => searchSchema.parse(data),
  loaderDeps: ({ search: { year, month } }) => ({ year, month }),
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (!user.userInfo.roles.includes('ROLE_REPRESENTANT'))
      throw redirect({ from: Route.id, to: '..', search: (old) => ({ ...old, year: undefined, month: undefined }), replace: true });
  },
  loader: async ({ context: { queryClient }, deps: { year, month } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    const enterprise = await queryClient.ensureQueryData(queries.enterprise.detail(user.profile.enterprise!.id));
    queryClient.prefetchQuery(
      queries['sales-vva'].list._ctx.byDepartmentCodesYearAndMonth({ departmentCodes: enterprise.departments?.map((d) => d.code) ?? [], year, month }),
    );
  },
  pendingComponent: LoaderModal,
});
