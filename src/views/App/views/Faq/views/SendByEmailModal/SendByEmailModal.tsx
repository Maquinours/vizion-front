import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../components/SendEmailModal/SendEmailModal';
import { useSuspenseQuery } from '@tanstack/react-query';
import { faqQueryKeys } from '../../../../../../utils/constants/queryKeys/faq';
import { getFaqById } from '../../../../../../utils/api/faq';

const routeApi = getRouteApi('/app/faq/send-by-email/$faqId');

export default function AppViewFaqViewSendByEmailModalView() {
  const navigate = useNavigate();
  const { faqId } = routeApi.useParams();

  const { data: faq } = useSuspenseQuery({
    queryKey: faqQueryKeys.detailById(faqId),
    queryFn: () => getFaqById(faqId),
  });

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={() => navigate({ from: routeApi.id, to: '../..', search: (old) => old })}
      defaultContent={faq.description}
    />
  );
}
