import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { generateUserEmailSignature } from '../../utils/functions/user';
import { useAuthentifiedUserQuery } from '../../views/App/utils/functions/getAuthentifiedUser';
import LoaderModal from '../LoaderModal/LoaderModal';
import SendEmailPredefinedMessagesModalComponent from '../SendEmailPredefinedMessagesModal/SendEmailPredefinedMessagesModal';
import SendEmailComponentBodyComponent from './components/Body/Body';
import SendEmailComponentHeaderComponent from './components/Header/Header';
import styles from './SendEmail.module.scss';
import { sendEmail } from './utils/api/email';
import { SendEmailFormContext } from './utils/contexts/sendEmail';

type Attachment = { id: string; file: File };

type StorageData = {
  recipient: Array<string>;
  cc: Array<string>;
  bcc: Array<string>;
  subject: string;
  content: string;
};

const isStorageData = (value: unknown): value is StorageData =>
  typeof value === 'object' &&
  value !== null &&
  'recipient' in value &&
  Array.isArray(value.recipient) &&
  value.recipient.every((item: unknown) => typeof item === 'string') &&
  'cc' in value &&
  Array.isArray(value.cc) &&
  value.cc.every((item: unknown) => typeof item === 'string') &&
  'bcc' in value &&
  Array.isArray(value.bcc) &&
  value.bcc.every((item: unknown) => typeof item === 'string') &&
  'subject' in value &&
  typeof value.subject === 'string' &&
  'content' in value &&
  typeof value.content === 'string';

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
  attachments: yup.array().of(yup.mixed<Attachment>().required()).required('Champs requis'),
});

export type SendEmailFormSchema = yup.InferType<typeof yupSchema>;

export type SendEmailComponentProps = Readonly<{
  defaultSubject?: string;
  defaultRecipient?: Array<string>;
  defaultCc?: Array<string>;
  defaultBcc?: Array<string>;
  defaultContent?: string;
  defaultContentSuffix?: string;
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
  onEmailSent?: () => void;
  storageKey?: string; // Used to handle storage in global send email modal
  useSignature?: boolean;
}>;
export default function SendEmailComponent({
  defaultSubject,
  defaultRecipient,
  defaultCc,
  defaultBcc,
  defaultContent,
  defaultContentSuffix,
  defaultAttachments,
  lifeSheetInfoDto,
  onEmailSent,
  storageKey,
  useSignature = true,
}: SendEmailComponentProps) {
  const pathname = useLocation({ select: (location) => location.pathname });

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
      recipient: [...(defaultRecipient ?? [])].filter((item) => item.trim().length > 0),
      cc: [...(defaultCc ?? [])].filter((item) => item.trim().length > 0),
      bcc: (defaultBcc ?? []).filter((item) => item.trim().length > 0),
      subject: defaultSubject ?? '',
      content: (defaultContent ?? '') + (useSignature ? generateUserEmailSignature(user) : '') + (defaultContentSuffix ?? ''),
      attachments: defaultAttachments?.map((file) => ({ id: file.name, file })) ?? [],
    },
  });

  const watch = useWatch({ control });

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
      localStorage.removeItem(fullStorageKey);
      toast.success('Email envoyé avec succès.');
      if (onEmailSent) onEmailSent();
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 413) toast.error('La taille des fichiers joints est trop grande.');
      else {
        console.error(error);
        toast.error("Une erreur est survenue lors de l'envoi de l'email.");
      }
    },
  });

  const fullStorageKey = `send_email_form_values_${storageKey ?? pathname}`;
  const contextValue = useMemo(() => ({ control, register, errors, getValues, setValue }), [control, register, errors, getValues, setValue]);

  useEffect(() => {
    const jsonData = sessionStorage.getItem(fullStorageKey);
    if (!jsonData) return;
    const data = JSON.parse(jsonData);
    if (isStorageData(data)) {
      setValue('recipient', data.recipient);
      setValue('cc', data.cc);
      setValue('bcc', data.bcc);
      setValue('subject', data.subject);
      setValue('content', data.content);
    } else sessionStorage.removeItem(fullStorageKey);
  }, [fullStorageKey]);

  useEffect(() => {
    const storage: StorageData = {
      recipient: watch.recipient ?? [],
      cc: watch.cc ?? [],
      bcc: watch.bcc ?? [],
      subject: watch.subject ?? '',
      content: watch.content ?? '',
    };
    sessionStorage.setItem(fullStorageKey, JSON.stringify(storage));
  }, [watch]);

  return (
    <>
      <SendEmailFormContext.Provider value={contextValue}>
        <div className={styles.container}>
          <div className={styles.header_container}>
            <div className={styles.header_right}>
              <button className="btn btn-primary" onClick={() => setIsPredefinedMessagesModalOpened(true)}>
                Messages prédéfinis
              </button>
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
        {isPredefinedMessagesModalOpened && <SendEmailPredefinedMessagesModalComponent onClose={() => setIsPredefinedMessagesModalOpened(false)} />}
      </SendEmailFormContext.Provider>
    </>
  );
}
