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
import { SendEmailFormContext } from './utils/contexts/sendEmail';
import React, { useMemo, useState } from 'react';
import MailResponseDto from '../../utils/types/MailResponseDto';
import { formatDateWithHour } from '../../utils/functions/dates';
import { toast } from 'react-toastify';
import { LinkProps, Outlet, Link } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import SendEmailPredefinedMessagesModalComponent from '../SendEmailPredefinedMessagesModal/SendEmailPredefinedMessagesModal';

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

export type SendEmailComponentProps = Readonly<{
  defaultSubject?: string;
  defaultRecipient?: Array<string>;
  defaultCc?: Array<string>;
  defaultBcc?: Array<string>;
  defaultContent?: string;
  defaultAttachments?: Array<File>;
  lifeSheetInfoDto?: {
    author?: string | null;
    businessId?: string | null;
    businessNumber?: string | null;
    businessName?: string | null;
    rmaId?: string | null;
    rmaNumber?: string | null;
    enterpriseId?: string | null;
    enterpriseName?: string | null;
    productId?: string | null;
    productReference?: string | null;
    technicalAssistanceId?: string | null;
  };
  predefinedMessagesModalLink?: LinkProps;
  emailToReply?: MailResponseDto;
  onEmailSent?: () => void;
}>;
export default function SendEmailComponent({
  defaultSubject,
  defaultRecipient,
  defaultCc,
  defaultBcc,
  defaultContent,
  defaultAttachments,
  lifeSheetInfoDto,
  predefinedMessagesModalLink,
  emailToReply,
  onEmailSent,
}: SendEmailComponentProps) {
  const { data: user } = useAuthentifiedUserQuery();

  const [isPredefinedMessagesModalOpened, setIsPredefinedMessagesModalOpened] = useState(false);

  const {
    control,
    register,
    getValues,
    setValue,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      recipient: [...(emailToReply?.sender ? [emailToReply.sender] : []), ...(defaultRecipient ?? [])].filter((item) => item.trim().length > 0),
      cc: [
        ...[...(emailToReply?.receiver.split(';') ?? []), ...(emailToReply?.cc?.split(';') ?? [])].filter(
          (item) => item.toLowerCase() !== user.userInfo.email.toLowerCase(),
        ),
        ...(defaultCc ?? []),
      ].filter((item) => item.trim().length > 0),
      bcc: (defaultBcc ?? []).filter((item) => item.trim().length > 0),
      subject: defaultSubject ?? (emailToReply?.subject ? `Re: ${emailToReply.subject}` : ''),
      content:
        (defaultContent ?? '') +
        generateUserEmailSignature(user) +
        (emailToReply ? `<br /><br />Le ${formatDateWithHour(emailToReply.sendDate)}, ${emailToReply.sender} a envoyé :<br />${emailToReply.content}` : ''),
      attachments: defaultAttachments?.map((file) => ({ id: file.name, file })) ?? [],
    },
  });

  const onReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    reset();
  };

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
        author: lifeSheetInfoDto ? `${user.userInfo.firstName} ${user.userInfo.lastName.charAt(0)}.` : undefined,
        ...lifeSheetInfoDto,
      }),
    onSuccess: () => {
      toast.success('Email envoyé avec succès.');
      if (onEmailSent) {
        onEmailSent();
      }
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 413) toast.error('La taille des fichiers joints est trop grande.');
      else {
        console.error(error);
        toast.error("Une erreur est survenue lors de l'envoi de l'email.");
      }
    },
  });

  const contextValue = useMemo(() => ({ control, register, errors, getValues, setValue }), [control, register, errors, getValues, setValue]);

  return (
    <SendEmailFormContext.Provider value={contextValue}>
      <div className={styles.container}>
        <div className={styles.header_container}>
          <div className={styles.header_right}>
            {predefinedMessagesModalLink ? (
              <Link {...predefinedMessagesModalLink} className="btn btn-primary">
                Messages prédéfinis
              </Link>
            ) : (
              <button className="btn btn-primary" onClick={() => setIsPredefinedMessagesModalOpened(true)}>
                Messages prédéfinis
              </button>
            )}
          </div>
        </div>
        <div className={styles.mailbox_container}>
          <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onReset}>
            <SendEmailComponentHeaderComponent />
            <SendEmailComponentBodyComponent />
          </form>
        </div>
      </div>
      <LoaderModal isLoading={isPending} />
      {predefinedMessagesModalLink ? (
        <Outlet />
      ) : (
        isPredefinedMessagesModalOpened && <SendEmailPredefinedMessagesModalComponent onClose={() => setIsPredefinedMessagesModalOpened(false)} />
      )}
    </SendEmailFormContext.Provider>
  );
}
