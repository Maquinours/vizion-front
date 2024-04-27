import { useForm } from 'react-hook-form';
import MailAttachmentResponseDto from '../../../../../../../../utils/types/MailAttachmentResponseDto';
import MailResponseDto from '../../../../../../../../utils/types/MailResponseDto';
import TaskResponseDto from '../../../../../../../../utils/types/TaskResponseDto';
import styles from './Attachments.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AppViewDashboardViewTaskMailModalViewAttachmentsComponentAttachmentComponent from './components/Attachment/Attachment';
import { useMutation } from '@tanstack/react-query';
import { copyMailAttachmentToGed } from './utils/api/ged';
import FileType from '../../../../../../../../utils/enums/FileType';
import MailFileToDestinationRequestDto from './utils/types/MailFileToDestinationRequestDto';
import { toast } from 'react-toastify';

const yupSchema = yup.object({
  copy: yup.boolean().required(),
  files: yup.array(yup.mixed<MailAttachmentResponseDto>().required()).required(),
});

export type TaskEmailCopyYupSchema = yup.InferType<typeof yupSchema>;

type AppViewDashboardViewTaskEmailModalViewAttachmentsComponentProps = Readonly<{
  task: TaskResponseDto;
  email: MailResponseDto;
}>;
export default function AppViewDashboardViewTaskEmailModalViewAttachmentsComponent({
  task,
  email,
}: AppViewDashboardViewTaskEmailModalViewAttachmentsComponentProps) {
  const { register, watch, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      copy: false,
      files: [],
    },
  });

  const { mutate } = useMutation({
    mutationFn: ({ files }: TaskEmailCopyYupSchema) => {
      let data: MailFileToDestinationRequestDto = {
        path: '',
        fileList: files.filter((file) => Boolean(file.path)).map((el) => el.path!),
      };
      if (task.rmaId) data = { ...data, type: FileType.SAV, keyId: task.rmaId };
      else if (task.businessId) data = { ...data, type: FileType.AFFAIRE, keyId: task.businessId };
      else if (task.productId) data = { ...data, type: FileType.PRODUIT, keyId: task.productId };
      else if (task.enterpriseId) data = { ...data, type: FileType.CONTACT, keyId: task.enterpriseId };
      return copyMailAttachmentToGed(data);
    },
    onSuccess: (_data, params) => {
      if (params.files.length > 1) toast.success(`Fichiers copiés dans la GED`);
      else toast.success(`Fichier copié dans la GED`);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la copie des fichiers dans la GED');
    },
  });

  return (
    <>
      {email.pjList.length > 0 && Boolean(task.rmaId ?? task.businessId ?? task.productId ?? task.enterpriseId) && (
        <div>
          <input type="checkbox" id="copyFile" {...register('copy')} />
          <label style={{ marginLeft: '3px' }} htmlFor="copyFile">
            Activer la copie du fichier joint
          </label>
        </div>
      )}
      <div className={styles.attached_files}>
        <div className={styles.preview_container}>
          {email.pjList.map((attachment) => (
            <AppViewDashboardViewTaskMailModalViewAttachmentsComponentAttachmentComponent
              key={attachment.id}
              email={email}
              attachment={attachment}
              watch={watch}
              setValue={setValue}
            />
          ))}
        </div>

        {watch('copy') && watch('files').length > 0 && (
          <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
            <button className="btn btn-secondary" onClick={handleSubmit((data) => mutate(data))}>
              Envoyer dans la GED
            </button>
          </div>
        )}
      </div>
    </>
  );
}
