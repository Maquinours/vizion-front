import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import DeleteBusinessRmaLinkModalComponent from '../../../../../../../../components/DeleteBusinessRmaLinkModal/DeleteBusinessRmaLinkModal';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CategoryBusiness from '../../../../../../../../utils/enums/CategoryBusiness';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard/delete-link/$associatedId');

export default function AppViewBusinessViewDashboardViewDeleteLinkModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId, associatedId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  return (
    <DeleteBusinessRmaLinkModalComponent category={CategoryBusiness.AFFAIRE} number={business.numBusiness} associatedId={associatedId} onClose={onClose} />
  );
}
