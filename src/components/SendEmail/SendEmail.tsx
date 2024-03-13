import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import SendEmailComponentHeaderComponent from './components/Header/Header';
import SendEmailComponentBodyComponent from './components/Body/Body';
import { useAuthentifiedUserQuery } from '../../views/App/utils/functions/getAuthentifiedUser';
import { generateUserEmailSignature } from '../../utils/functions/user';
import styles from './SendEmail.module.scss';
import LoaderModal from '../LoaderModal/LoaderModal';
import { useMutation } from '@tanstack/react-query';
import { sendEmail } from './utils/api/email';
import SendEmailComponentPredefinedMessagesModalComponent from './components/PredefinedMessagesModal/PredefinedMessagesModal';
import { SendEmailFormContext } from './utils/contexts/sendEmail';
import { useMemo } from 'react';
import MailResponseDto from '../../utils/types/MailResponseDto';
import { formatDateWithHour } from '../../utils/functions/dates';

const yupSchema = yup.object({
  recipient: yup
    .array()
    .of(
      yup
        .string()
        .email(({ value }) => `${value} est invalide.`)
        .required(),
    )
    .default(() => [])
    .typeError('Format invalide')
    .min(1, 'Au moins une addresse')
    .required('Champs requis'),
  cc: yup
    .array()
    .of(
      yup
        .string()
        .email(({ value }) => `${value} est invalide.`)
        .required(),
    )
    .default(() => [])
    .typeError('Format invalide'),
  bcc: yup
    .array()
    .of(
      yup
        .string()
        .email(({ value }) => `${value} est invalide.`)
        .required(),
    )
    .default(() => [])
    .typeError('Format invalide'),
  subject: yup.string().required('Champs requis.'),
  content: yup.string().required('Champs requis'),
  attachments: yup.array().of(yup.mixed<{ id: string; file: File }>().required()).required('Champs requis'),
});

export type SendEmailFormSchema = yup.InferType<typeof yupSchema>;

type SendEmailComponentProps = Readonly<{
  defaultSubject?: string;
  defaultRecipient?: Array<string>;
  defaultCc?: Array<string>;
  defaultBcc?: Array<string>;
  defaultContent?: string;
  defaultAttachments?: Array<File>;
  lifeSheetInfoDto?: {
    author?: string;
    businessId?: string;
    businessNumber?: string;
    businessName?: string;
    rmaId?: string;
    rmaNumber?: string;
    enterpriseId?: string;
    enterpriseName?: string;
    productId?: string;
    productReference?: string;
    technicalAssistanceId?: string;
  };
  showPredefinedMessagesModal?: boolean;
  openPredefinedMessagesModal: () => void;
  closePredefinedMessagesModal: () => void;
  emailToReply?: MailResponseDto;
}>;
export default function SendEmailComponent({
  defaultSubject,
  defaultRecipient,
  defaultCc,
  defaultBcc,
  defaultContent,
  defaultAttachments,
  lifeSheetInfoDto,
  showPredefinedMessagesModal = false,
  openPredefinedMessagesModal,
  closePredefinedMessagesModal,
  emailToReply,
}: SendEmailComponentProps) {
  const { data: user } = useAuthentifiedUserQuery();

  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      recipient: [...(emailToReply?.sender ? [emailToReply.sender] : []), ...(defaultRecipient ?? [])],
      cc: defaultCc ?? [],
      bcc: defaultBcc ?? [],
      subject: defaultSubject ?? (emailToReply?.subject ? `Re: ${emailToReply.subject}` : ''),
      content:
        (defaultContent ?? '') +
        generateUserEmailSignature(user) +
        (emailToReply ? `<br /><br />Le ${formatDateWithHour(emailToReply.sendDate)}, ${emailToReply.sender} a envoyé :<br />${emailToReply.content}` : ''),
      attachments: defaultAttachments?.map((file) => ({ id: file.name, file })) ?? [],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SendEmailFormSchema) =>
      sendEmail({
        subject: data.subject,
        cc: data.cc,
        bcc: data.bcc,
        to: data.recipient,
        content: data.content,
        ownerId: user.profile.id,
        sender: user.userInfo.email,
        files: data.attachments.map(({ file }) => file),
        ...lifeSheetInfoDto,
      }),
  });

  const contextValue = useMemo(() => ({ control, register, errors, watch, setValue }), [control, register, errors, watch, setValue]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header_container}>
          <div className={styles.header_right}>
            <button className="btn btn-primary" onClick={() => openPredefinedMessagesModal()}>
              Messages prédéfinis
            </button>
          </div>
        </div>
        <div className={styles.mailbox_container}>
          <form onSubmit={handleSubmit((data) => mutate(data))} onReset={() => reset()}>
            <SendEmailFormContext.Provider value={contextValue}>
              <SendEmailComponentHeaderComponent />
              <SendEmailComponentBodyComponent />
            </SendEmailFormContext.Provider>
          </form>
        </div>
      </div>
      {showPredefinedMessagesModal && (
        <SendEmailComponentPredefinedMessagesModalComponent watch={watch} setValue={setValue} onClose={closePredefinedMessagesModal} />
      )}
      <LoaderModal isLoading={isPending} />
    </>
  );
}
