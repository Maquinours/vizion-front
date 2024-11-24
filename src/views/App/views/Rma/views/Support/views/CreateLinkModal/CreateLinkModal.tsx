import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import CreateBusinessRmaLinkModalComponent from '../../../../../../../../components/CreateBusinessRmaLinkModal/CreateBusinessRmaLinkModal';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CategoryBusiness from '../../../../../../../../utils/enums/CategoryBusiness';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support/create-link');

export default function AppViewRmaViewSupportViewCreateLinkModalView() {
  const navigate = routeApi.useNavigate();

  const { rmaId } = routeApi.useParams();

  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  return <CreateBusinessRmaLinkModalComponent category={CategoryBusiness.RMA} number={rma.number} onClose={onClose} />;
}
