import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../components/SendEmailModal/SendEmailModal';
import { useSuspenseQuery } from '@tanstack/react-query';
import { faqs } from '../../../../../../utils/constants/queryKeys/faq';

const routeApi = getRouteApi('/app/faq/send-by-email/$faqId');

export default function AppViewFaqViewSendByEmailModalView() {
  const navigate = useNavigate();
  const { faqId } = routeApi.useParams();

  const { data: faq } = useSuspenseQuery(faqs.detail._ctx.byId(faqId));

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={() => navigate({ from: routeApi.id, to: '../..', search: (old) => old, replace: true, resetScroll: false })}
      defaultContent={faq.description}
    />
  );
}
