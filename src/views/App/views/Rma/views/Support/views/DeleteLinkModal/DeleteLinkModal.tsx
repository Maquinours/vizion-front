import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import DeleteBusinessRmaLinkModalComponent from '../../../../../../../../components/DeleteBusinessRmaLinkModal/DeleteBusinessRmaLinkModal';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CategoryBusiness from '../../../../../../../../utils/enums/CategoryBusiness';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/support/delete-link/$associatedId');

export default function AppViewRmaViewSupportViewDeleteLinkModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { rmaId, associatedId } = routeApi.useParams();

  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  return <DeleteBusinessRmaLinkModalComponent category={CategoryBusiness.RMA} number={rma.number} associatedId={associatedId} onClose={onClose} />;
}
