import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import PdfFileImage from '../../../../../../../../../../assets/images/pdf_file.webp';
import UnknownFileImage from '../../../../../../../../../../assets/images/unknown_file.webp';
import { PUBLIC_BASE_URL } from '../../../../../../../../../../utils/constants/api';
import { isImageFile, isPdfFile } from '../../../../../../../../../../utils/functions/files';
import MailAttachmentResponseDto from '../../../../../../../../../../utils/types/MailAttachmentResponseDto';
import MailResponseDto from '../../../../../../../../../../utils/types/MailResponseDto';
import { TaskEmailCopyYupSchema } from '../../Attachments';
import styles from './Attachment.module.scss';

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
      if (isPdfFile(attachment.name)) return <img src={PdfFileImage} width={75} height={75} />;
      if (isImageFile(attachment.name))
        return (
          <img
            src={`${PUBLIC_BASE_URL}mail/v1/download-file/${attachment.name}?ref=${email.id}`}
            alt={`Pièce jointe ${attachment.name}`}
            width={200}
            height={200}
          />
        );
      return <img src={UnknownFileImage} width={75} height={75} />;
    })();

    return watch('copy') ? (
      <button onClick={selectFile} className={styles.file}>
        {image}
        <h6>{attachment.name}</h6>
      </button>
    ) : (
      <a href={`${PUBLIC_BASE_URL}mail/v1/download-file/${attachment.name}?ref=${email.id}`} target="_blank" rel="noopener noreferrer" className={styles.file}>
        {image}
        <h6>{attachment.name}</h6>
      </a>
    );
  }
}
