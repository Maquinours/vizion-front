import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import styles from './AttachmentLinkField.module.scss';
import { useMutation } from '@tanstack/react-query';
import { formatFileName } from '../../../../../../../../utils/functions/files';
import { useContext } from 'react';
import { SendEmailFormContext } from '../../../../../../utils/contexts/sendEmail';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { isAxiosError } from 'axios';

const yupSchema = yup.object({
  attachmentLink: yup.string().url('Ce champ doit contenir une URL valide.').required('Champs requis'),
});

export default function SendEmailComponentHeaderComponentInputsComponentAttachmentLinkFieldComponent() {
  const { setValue, getValues } = useContext(SendEmailFormContext)!;

  const {
    handleSubmit,
    register,
    formState: { errors },
    resetField,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      attachmentLink: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ attachmentLink }: yup.InferType<typeof yupSchema>) => {
      if (!attachmentLink.split('/').pop()?.trim()) throw new Error('Unable to retrieve a file name');
      const response = await fetch(attachmentLink);
      const contentType = response.headers.get('content-type');
      if (!contentType?.startsWith('image/') && !contentType?.startsWith('video/') && contentType !== 'application/pdf')
        throw new Error('File type not supported');
      const blob = await response.blob();
      return { response, blob };
    },
    onSuccess: ({ response, blob }, { attachmentLink }) => {
      const contentType = response.headers.get('content-type');
      const file = new File([blob], formatFileName(attachmentLink.split('/').pop()!), { type: contentType ?? undefined });
      setValue('attachments', [...getValues('attachments'), { id: uuidv4(), file }]);
      resetField('attachmentLink');
      toast.success('Pièce jointe ajoutée avec succès');
    },
    onError: (error) => {
      console.error(error);
      if (!isAxiosError(error)) {
        switch (error.message) {
          case 'Unable to retrieve a file name':
            toast.error('Le fichier est invalide');
            return;
          case 'File type not supported':
            toast.error('Type de fichier non supporté');
            return;
        }
      }
      toast.error('Une erreur est survenue lors de la récupération du fichier');
    },
  });

  const onSubmit = handleSubmit((data) => mutate(data));

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={styles.form_group}>
      <input className={styles.input} type="text" placeholder="Ajouter une pièce jointe depuis un lien" {...register('attachmentLink')} onKeyDown={onKeyDown} />
      <p className={styles.__errors}>{errors.attachmentLink?.message}</p>
      <PulseLoader loading={isPending} color="#31385A" size={10} className="text-center" />
    </div>
  );
}
