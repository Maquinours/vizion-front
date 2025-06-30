import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, LinkProps, Outlet } from '@tanstack/react-router';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { useState } from 'react';
import ReactModal from 'react-modal';
import { PUBLIC_BASE_URL } from '../../utils/constants/api';
import { emails } from '../../utils/constants/queryKeys/email';
import { formatDateWithHour } from '../../utils/functions/dates';
import ResendEmailModalComponent from '../ResendEmailModal/ResendEmailModal';
import styles from './EmailModal.module.scss';

type EmailModalComponentProps = Readonly<{
  onClose: () => void;
  emailId: string;
  replyLink?: LinkProps;
}>;
export default function EmailModalComponent({ onClose, emailId, replyLink }: EmailModalComponentProps) {
  const { data: email } = useSuspenseQuery(emails.detail(emailId));

  const [showResendModal, setShowResendModal] = useState(false);

  return (
    <>
      <ReactModal isOpen={true} onRequestClose={onClose} className={styles.mail_modal} overlayClassName="Overlay">
        <div className={styles.modal_container}>
          <div className={styles.modal_title}>
            <p>Contenu du mail</p>
          </div>
          <div className={styles.modal_content}>
            <div className={styles.attached_files}>
              <div>
                <p>A : {email?.receiver?.split(';').join(' ')}</p>
                <p>De : {email?.sender}</p>
                <h4>Pièces jointes : </h4>
                {email.pjList?.length > 0 ? (
                  <ul>
                    {email.pjList?.map((item) => (
                      <li key={item.id} style={{ marginBottom: '5px', cursor: 'pointer' }}>
                        <a href={`${PUBLIC_BASE_URL}mail/v1/download-file/${item.name}?ref=${email.id}`} target="_blank" rel="noopener noreferrer">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ marginBottom: '1rem' }}>Aucune pièce jointe</div>
                )}
              </div>
              <div className={styles.receiveDate}>Envoyé le : {formatDateWithHour(email?.sendDate)}</div>
            </div>
            <div className={styles.mailbox}>{parse(DOMPurify.sanitize(email.content))}</div>
          </div>
          <div className={styles.modal_footer}>
            <div className={styles.buttons_container}>
              <button className="btn btn-secondary" onClick={() => onClose()}>
                Fermer
              </button>
              <div className="flex gap-1">
                <button className="btn btn-primary" onClick={() => setShowResendModal(true)}>
                  Renvoyer
                </button>
                {replyLink && (
                  <Link {...replyLink} className="btn btn-primary">
                    Répondre
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </ReactModal>
      <Outlet />

      <ResendEmailModalComponent isOpen={showResendModal} emailId={emailId} onClose={() => setShowResendModal(false)} />
    </>
  );
}
