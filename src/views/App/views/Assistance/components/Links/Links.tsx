import { getRouteApi, LinkOptions } from '@tanstack/react-router';
import BusinessRmaLinksComponent from '../../../../../../components/BusinessRmaLinks/BusinessRmaLinks';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import { useCallback } from 'react';
import AllBusinessResponseDto from '../../../../../../utils/types/AllBusinessResponseDto';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId');
const routePath = '/app/businesses-rma/business/$businessId/assistance/$assistanceId';

export default function AppViewAssistanceViewLinksComponent() {
  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const getItemLink = useCallback((item: AllBusinessResponseDto): LinkOptions => {
    switch (item.category) {
      case CategoryBusiness.AFFAIRE:
        return {
          to: '/app/businesses-rma/business/$businessId',
          params: { businessId: item.businessId },
        };
      case CategoryBusiness.RMA:
        return {
          to: '/app/businesses-rma/rma/$rmaId',
          params: { rmaId: item.businessId },
        };
    }
  }, []);

  return (
    <div className="col-[1/3] row-[4/13]">
      <BusinessRmaLinksComponent
        category={CategoryBusiness.AFFAIRE}
        number={business.numBusiness}
        getItemLink={getItemLink}
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
