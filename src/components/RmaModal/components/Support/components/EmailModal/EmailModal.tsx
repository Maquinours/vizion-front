import { useSuspenseQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { emails } from '../../../../../../utils/constants/queryKeys/email';
import EmailModalComponent from '../../../../../EmailModal/EmailModal';
import ReplyEmailModalComponent from '../../../../../ReplyEmailModal/ReplyEmailModal';
import ResendEmailModalComponent from '../../../../../ResendEmailModal/ResendEmailModal';
import LoaderModal from '../../../../../LoaderModal/LoaderModal';

enum ModalType {
  REPLY,
  RESEND,
}

type RmaModalComponentSupportComponentEmailModalComponentProps = Readonly<{
  emailId: string;
  onClose: () => void;
}>;
export default function RmaModalComponentSupportoCmponentEmailModalComponent({ emailId, onClose }: RmaModalComponentSupportComponentEmailModalComponentProps) {
  const [modalType, setModalType] = useState<ModalType>();

  const { data: email } = useSuspenseQuery(emails.detail(emailId));

  const modal = useMemo(() => {
    switch (modalType) {
      case ModalType.REPLY:
        return <ReplyEmailModalComponent email={email} isOpen onClose={() => setModalType(undefined)} />;
      case ModalType.RESEND:
        return <ResendEmailModalComponent email={email} isOpen onClose={() => setModalType(undefined)} />;
    }
  }, [modalType]);

  return (
    <>
      <EmailModalComponent
        emailId={emailId}
        onClose={onClose}
        onReplyClick={() => setModalType(ModalType.REPLY)}
        onResendClick={() => setModalType(ModalType.RESEND)}
      />
      <React.Suspense fallback={<LoaderModal />}>{modal}</React.Suspense>
    </>
  );
}
