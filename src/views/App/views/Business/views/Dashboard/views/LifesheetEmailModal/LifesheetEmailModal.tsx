import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import EmailModalComponent from '../../../../../../../../components/EmailModal/EmailModal';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard/lifesheet-email/$lifesheetId');

export default function AppViewBusinessViewDashboardViewLifesheetEmailModalView() {
  const navigate = routeApi.useNavigate();
  const { lifesheetId } = routeApi.useParams();

  const { data: lifesheet } = useSuspenseQuery(queries.lifesheets.detail._ctx.byId(lifesheetId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  return <EmailModalComponent emailId={lifesheet.mailId!} onClose={onClose} />;
}
