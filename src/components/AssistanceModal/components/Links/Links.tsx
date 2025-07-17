import { LinkOptions } from '@tanstack/react-router';
import { useCallback } from 'react';
import CategoryBusiness from '../../../../utils/enums/CategoryBusiness';
import AllBusinessResponseDto from '../../../../utils/types/AllBusinessResponseDto';
import BusinessResponseDto from '../../../../utils/types/BusinessResponseDto';
import { useAuthentifiedUserQuery } from '../../../../views/App/utils/functions/getAuthentifiedUser';
import BusinessRmaLinksComponent from '../../../BusinessRmaLinks/BusinessRmaLinks';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId');
// const routePath = '/app/businesses-rma/business/$businessId/assistance/$assistanceId';

type AssistanceModalComponentLinksComponentProps = Readonly<{
  business: BusinessResponseDto;
  onCreateClick: () => void;
  onDeleteClick: (data: AllBusinessResponseDto) => void;
}>;
export default function AssistanceModalComponentLinksComponent({ business, onCreateClick, onDeleteClick }: AssistanceModalComponentLinksComponentProps) {
  // const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

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
        onCreateClick={onCreateClick}
        onDeleteClick={onDeleteClick}
        // createLink={{
        //   from: routePath,
        //   to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/create-link',
        //   search: true,
        //   replace: true,
        //   resetScroll: false,
        // }}
        // getDeleteLink={(data) => ({
        //   from: routePath,
        //   to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/delete-link/$associatedId',
        //   params: { associatedId: data.id },
        //   search: true,
        //   replace: true,
        //   resetScroll: false,
        // })}
      />
    </div>
  );
}
