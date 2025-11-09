import { getRouteApi, Outlet } from '@tanstack/react-router';
import AppViewBusinessViewQuotationViewHeaderComponent from './components/Header/Header';
import AppViewBusinessViewQuotationViewRecapComponent from './components/Recap/Recap';
import AppViewBusinessViewQuotationViewTableComponent from './components/Table/Table';
import { useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/quotation');

export default function AppViewBusinessViewQuotationView() {
  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries['businesses'].detail._ctx.byId(businessId));

  const showAmounts = useMemo(
    () => user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') || (!!user.profile.enterprise && user.profile.enterprise.id === business.enterpriseId),
    [user, business],
  );

  console.log({ showAmounts });

  return (
    <>
      <AppViewBusinessViewQuotationViewHeaderComponent />
      <AppViewBusinessViewQuotationViewTableComponent showAmounts={showAmounts} />
      <AppViewBusinessViewQuotationViewRecapComponent showAmounts={showAmounts} />
      <Outlet />
    </>
  );
}
