import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../components/SendEmailModal/SendEmailModal';
import { faqs } from '../../../../../../utils/constants/queryKeys/faq';

const routeApi = getRouteApi('/app/faq/send-by-email/$faqId');

export default function AppViewFaqViewSendByEmailModalView() {
  const navigate = routeApi.useNavigate();
  const { faqId } = routeApi.useParams();

  const { data: faq } = useSuspenseQuery(faqs.detail._ctx.byId(faqId));

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={() => navigate({ to: '../..', search: true, replace: true, resetScroll: false })}
      defaultContent={faq.description}
    />
  );
}
