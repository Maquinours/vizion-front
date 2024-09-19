import { useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../components/SendEmailModal/SendEmailModal';

export default function AppViewSendEmailModalComponent() {
  const navigate = useNavigate();

  const onClose = () => {
    navigate({
      to: '.',
      search: (old) => ({ ...old, appModal: undefined, businessId: undefined, gedItemKey: undefined }),
      replace: true,
      resetScroll: false,
    });
  };

  return <SendEmailModalComponent isOpen onClose={onClose} />;
}
