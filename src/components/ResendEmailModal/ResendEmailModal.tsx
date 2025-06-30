import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../utils/constants/queryKeys';
import SendEmailModalComponent from '../SendEmailModal/SendEmailModal';
import { filesQueryKeys } from '../../utils/constants/queryKeys/files';
import { PUBLIC_BASE_URL } from '../../utils/constants/api';

type ResendEmailModalComponentProps = Readonly<{
  emailId: string;
  isOpen: boolean;
  onClose: () => void;
  onEmailSent?: () => void;
}>;
export default function ResendEmailModalComponent({ emailId, isOpen, onClose, onEmailSent }: ResendEmailModalComponentProps) {
  const { data: email } = useSuspenseQuery(queries.emails.detail(emailId));

  //   const { data } = useSuspenseQuery(filesQueryKeys.blob._ctx.fromUri());

  const fileQuery = useSuspenseQueries({
    queries:
      email.pjList?.map((item) => ({
        ...filesQueryKeys.blob._ctx.fromUri(`${PUBLIC_BASE_URL}mail/v1/download-file/${item.name}?ref=${email.id}`),
        select: (blob: Blob) => new File([blob], item.name ?? '', { type: blob.type }),
      })) ?? [],
  });

  const files = fileQuery.map(({ data }) => data);

  return (
    <SendEmailModalComponent
      isOpen={isOpen}
      defaultSubject={email.subject ?? undefined}
      defaultRecipient={email.receiver?.split(';')}
      defaultCc={email.cc?.split(';')}
      defaultBcc={email.bcc?.split(';')}
      defaultContent={email.content}
      defaultAttachments={files}
      onEmailSent={onEmailSent}
      onClose={onClose}
    />
  );
}
