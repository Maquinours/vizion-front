import { getRouteApi } from '@tanstack/react-router';
import BusinessRmaLinksComponent from '../../../../../../components/BusinessRmaLinks/BusinessRmaLinks';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId');
const routePath = '/app/businesses-rma/business/$businessId/assistance/$assistanceId';

export default function AppViewAssistanceViewLinksComponent() {
  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  return (
    <div className="col-[1/3] row-[4/13]">
      <BusinessRmaLinksComponent
        category={CategoryBusiness.AFFAIRE}
        number={business.numBusiness}
        canCreate={user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')}
        createLink={{
          from: routePath,
          to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/create-link',
          search: true,
          replace: true,
          resetScroll: false,
        }}
        getDeleteLink={(data) => ({
          from: routePath,
          to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/delete-link/$associatedId',
          params: { associatedId: data.id },
          search: true,
          replace: true,
          resetScroll: false,
        })}
      />
    </div>
  );
}
