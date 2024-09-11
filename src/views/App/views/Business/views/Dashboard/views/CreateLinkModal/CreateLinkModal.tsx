import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CreateBusinessRmaLinkModalComponent from '../../../../../../../../components/CreateBusinessRmaLinkModal/CreateBusinessRmaLinkModal';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CategoryBusiness from '../../../../../../../../utils/enums/CategoryBusiness';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard/create-link');

export default function AppViewBusinessViewDashboardViewCreateLinkModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  return <CreateBusinessRmaLinkModalComponent category={CategoryBusiness.AFFAIRE} number={business.numBusiness} onClose={onClose} />;
}
