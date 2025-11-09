import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import CreateBusinessRmaLinkModalComponent from '../../../../../../components/CreateBusinessRmaLinkModal/CreateBusinessRmaLinkModal';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/create-link');

export default function AppViewAssistanceViewCreateLinkModalComponent() {
  const navigate = routeApi.useNavigate();

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  return <CreateBusinessRmaLinkModalComponent category={CategoryBusiness.AFFAIRE} number={business.numBusiness} onClose={onClose} />;
}
