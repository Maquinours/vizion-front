import ReactModal from 'react-modal';
import SendEmailComponent from '../../../../../../components/SendEmail/SendEmail';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import styles from './SendEmailToContactModal.module.scss';
import { useSuspenseQuery } from '@tanstack/react-query';
import { profileQueryKeys } from '../../../../../../utils/constants/queryKeys/profile';
import { getProfileById } from '../../../../../../utils/api/profile';

const Route = getRouteApi('/app/enterprises/$enterpriseId/send-email-to-contact/$contactId');

export default function AppViewEnterpriseViewSendEmailToContactModalView() {
  const navigate = useNavigate();

  const { contactId } = Route.useParams();
  const { sendEmailModal: modal } = Route.useSearch();

  const { data: contact } = useSuspenseQuery({
    queryKey: profileQueryKeys.detailById(contactId),
    queryFn: () => getProfileById(contactId),
  });

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={() => navigate({ from: Route.id, to: '../..', search: (old) => old })}
      overlayClassName="Overlay"
      className={styles.modal}
    >
      <SendEmailComponent
        defaultRecipient={[contact.email!]}
        showPredefinedMessagesModal={modal === 'predefined-messages'}
        openPredefinedMessagesModal={() => navigate({ from: Route.id, search: (old) => ({ ...old, sendEmailModal: 'predefined-messages' }) })}
        closePredefinedMessagesModal={() => navigate({ from: Route.id, search: (old) => ({ ...old, sendEmailModal: undefined }) })}
      />
    </ReactModal>
  );
}
