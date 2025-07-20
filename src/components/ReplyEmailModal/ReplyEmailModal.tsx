import { formatDateWithHour } from '../../utils/functions/dates';
import MailResponseDto from '../../utils/types/MailResponseDto';
import SendEmailModalComponent from '../SendEmailModal/SendEmailModal';

type ReplyEmailModalComponentProps = Readonly<{
  email: MailResponseDto;
  isOpen: boolean;
  onClose: () => void;
  onEmailSent?: () => void;
}>;
export default function ReplyEmailModalComponent({ email, isOpen, onClose, onEmailSent }: ReplyEmailModalComponentProps) {
  return (
    <SendEmailModalComponent
      isOpen={isOpen}
      defaultSubject={`Re: ${email.subject}`}
      defaultRecipient={[email.sender]}
      defaultCc={email.cc?.split(';')}
      defaultBcc={email.bcc?.split(';')}
      defaultContentSuffix={`<br /><br />Le ${formatDateWithHour(email.sendDate)}, ${email.sender} a envoyé :<br />${email.content}`}
      onEmailSent={onEmailSent ?? onClose}
      onClose={onClose}
    />
  );
}
