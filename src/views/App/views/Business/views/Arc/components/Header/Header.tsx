import { getRouteApi } from '@tanstack/react-router';
import AppViewBusinessViewArcViewHeaderComponentSectionOneComponent from './components/SectionOne/SectionOne';
import AppViewBusinessViewArcViewHeaderComponentSectionThreeComponent from './components/SectionThree/SectionThree';
import AppViewBusinessViewArcViewHeaderComponentSectionTwoComponent from './components/SectionTwo/SectionTwo';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/arc');

export default function AppViewBusinessViewArcViewHeaderComponent() {
  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  return (
    <>
      {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && !business.archived && <AppViewBusinessViewArcViewHeaderComponentSectionOneComponent />}
      <AppViewBusinessViewArcViewHeaderComponentSectionTwoComponent />
      <AppViewBusinessViewArcViewHeaderComponentSectionThreeComponent />
    </>
  );
}
