import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import EmailModalComponent from '../../../../../../../../components/EmailModal/EmailModal';

const routeApi = getRouteApi('/app/products_/$productId/informations/lifesheet-email/$lifesheetId');

export default function AppViewProductViewInformationsViewLifesheetEmailModalView() {
  const navigate = routeApi.useNavigate();
  const { lifesheetId } = routeApi.useParams();

  const { data: lifesheet } = useSuspenseQuery(queries.lifesheets.detail._ctx.byId(lifesheetId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  return (
    <EmailModalComponent
      emailId={lifesheet.mailId!}
      onClose={onClose}
      replyLink={{ to: '/app/products/$productId/informations/lifesheet-email/$lifesheetId/reply', search: true, replace: true, resetScroll: false }}
      resendLink={{ to: '/app/products/$productId/informations/lifesheet-email/$lifesheetId/resend', search: true, replace: true, resetScroll: false }}
    />
  );
}
