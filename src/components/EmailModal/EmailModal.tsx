import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, LinkProps, Outlet } from '@tanstack/react-router';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import ReactModal from 'react-modal';
import { PUBLIC_BASE_URL } from '../../utils/constants/api';
import { emails } from '../../utils/constants/queryKeys/email';
import { formatDateWithHour } from '../../utils/functions/dates';
import styles from './EmailModal.module.scss';
import { useMemo } from 'react';

type EmailModalComponentProps = Readonly<{
  onClose: () => void;
  emailId: string;
  resendLink?: LinkProps;
  onResendClick?: () => void;
  replyLink?: LinkProps;
  onReplyClick?: () => void;
}>;
export default function EmailModalComponent({ onClose, emailId, resendLink, onResendClick, replyLink, onReplyClick }: EmailModalComponentProps) {
  const { data: email } = useSuspenseQuery(emails.detail(emailId));

  const replyButton = useMemo(() => {
    if (replyLink && onReplyClick) throw new Error('replyLink and onReplyClick cannot be both defined');

    const text = 'Répondre';

    if (replyLink)
      return (
        <Link {...replyLink} className="btn btn-primary">
          {text}
        </Link>
      );
    else if (onReplyClick)
      return (
        <button
          type="button"
          onClick={() => {
            onReplyClick();
          }}
          className="btn btn-primary"
        >
          {text}
        </button>
      );
    // else throw new Error('replyLink or onReplyClick must be defined');
  }, [replyLink, onReplyClick]);

  const resendButton = useMemo(() => {
    if (resendLink && onResendClick) throw new Error('resendLink and onResendClick cannot be both defined');

    const text = 'Renvoyer';

    if (resendLink)
      return (
        <Link {...resendLink} className="btn btn-primary">
          {text}
        </Link>
      );
    else if (onResendClick)
      return (
        <button
          type="button"
          onClick={() => {
            onResendClick();
          }}
          className="btn btn-primary"
        >
          {text}
        </button>
      );
    // else throw new Error('resendLink or onResendClick must be defined');
  }, [resendLink, onResendClick]);

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
                {resendButton}
                {replyButton}
                {/* {resendLink && (
                  <Link {...resendLink} className="btn btn-primary">
                    Renvoyer
                  </Link>
                )}
                {replyLink && (
                  <Link {...replyLink} className="btn btn-primary">
                    Répondre
                  </Link>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </ReactModal>
      <Outlet />
    </>
  );
}
