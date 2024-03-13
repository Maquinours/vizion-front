import { BiSolidFilePdf } from 'react-icons/bi';
import { isImageFile, isPdfFile } from '../../../../../../../../../../utils/functions/files';
import MailAttachmentResponseDto from '../../../../../../../../../../utils/types/MailAttachmentResponseDto';
import { PUBLIC_BASE_URL } from '../../../../../../../../../../utils/constants/api';
import MailResponseDto from '../../../../../../../../../../utils/types/MailResponseDto';
import { FaFile } from 'react-icons/fa';
import styles from './Attachment.module.scss';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { TaskEmailCopyYupSchema } from '../../Attachments';

type AppViewDashboardViewTaskEmailModalViewAttachmentsComponentAttachmentComponentProps = Readonly<{
  email: MailResponseDto;
  attachment: MailAttachmentResponseDto;
  watch: UseFormWatch<TaskEmailCopyYupSchema>;
  setValue: UseFormSetValue<TaskEmailCopyYupSchema>;
}>;
export default function AppViewDashboardViewTaskEmailModalViewAttachmentsComponentAttachmentComponent({
  email,
  attachment,
  watch,
  setValue,
}: AppViewDashboardViewTaskEmailModalViewAttachmentsComponentAttachmentComponentProps) {
  const isSelected = watch('files').find((file) => file.id === attachment.id);

  const selectFile = () => {
    setValue('files', isSelected ? watch('files').filter((file) => file.id !== attachment.id) : [...watch('files'), attachment]);
  };

  if (attachment.name) {
    const image = (() => {
      if (isPdfFile(attachment.name)) return <BiSolidFilePdf />;
      if (isImageFile(attachment.name))
        return <img src={`${PUBLIC_BASE_URL}mail/v1/download-file/${attachment.name}?ref=${email.id}`} alt={`Pièce jointe ${attachment.name}`} />;
      return <FaFile />;
    })();

    return watch('copy') ? (
      <button onClick={selectFile} className={styles.file}>
        {image}
      </button>
    ) : (
      <a href={`${PUBLIC_BASE_URL}mail/v1/download-file/${attachment.name}?ref=${email.id}`} target="_blank" rel="noopener noreferrer" className={styles.file}>
        {image}
      </a>
    );
  }
}
