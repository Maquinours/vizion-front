import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import EmailModalComponent from '../../../../../../components/EmailModal/EmailModal';
import { queries } from '../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/assistance/$assistanceId/lifesheet-email/$lifesheetId');

export default function AppViewAssistanceViewLifesheetEmailModalView() {
  const navigate = routeApi.useNavigate();
  const { lifesheetId } = routeApi.useParams();

  const { data: lifesheet } = useSuspenseQuery(queries.lifesheets.detail._ctx.byId(lifesheetId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  return <EmailModalComponent emailId={lifesheet.mailId!} onClose={onClose} />;
}
