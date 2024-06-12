import { UseFormGetValues, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import PdfFileImage from '../../../../../../../../../../assets/images/pdf_file.webp';
import UnknownFileImage from '../../../../../../../../../../assets/images/unknown_file.webp';
import { PUBLIC_BASE_URL } from '../../../../../../../../../../utils/constants/api';
import { isImageFile, isPdfFile } from '../../../../../../../../../../utils/functions/files';
import MailAttachmentResponseDto from '../../../../../../../../../../utils/types/MailAttachmentResponseDto';
import MailResponseDto from '../../../../../../../../../../utils/types/MailResponseDto';
import { TaskEmailCopyYupSchema } from '../../Attachments';
import styles from './Attachment.module.scss';
import classNames from 'classnames';
import { useMemo } from 'react';

type AppViewDashboardViewTaskEmailModalViewAttachmentsComponentAttachmentComponentProps = Readonly<{
  email: MailResponseDto;
  attachment: MailAttachmentResponseDto;
  getValues: UseFormGetValues<TaskEmailCopyYupSchema>;
  watch: UseFormWatch<TaskEmailCopyYupSchema>;
  setValue: UseFormSetValue<TaskEmailCopyYupSchema>;
}>;
export default function AppViewDashboardViewTaskEmailModalViewAttachmentsComponentAttachmentComponent({
  email,
  attachment,
  getValues,
  watch,
  setValue,
}: AppViewDashboardViewTaskEmailModalViewAttachmentsComponentAttachmentComponentProps) {
  const copy = useMemo(() => getValues('copy'), [watch('copy')]);
  const isSelected = useMemo(() => getValues('files').find((file) => file.id === attachment.id), [watch('files')]);

  const selectFile = () => {
    const files = getValues('files');
    setValue('files', isSelected ? files.filter((file) => file.id !== attachment.id) : [...files, attachment]);
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

    if (!!copy)
      return (
        <button
          onClick={selectFile}
          className={classNames(styles.file, {
            [styles.is_selected]: isSelected,
          })}
        >
          {image}
          <h6>{attachment.name}</h6>
        </button>
      );
    else
      return (
        <a
          href={`${PUBLIC_BASE_URL}mail/v1/download-file/${attachment.name}?ref=${email.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.file}
        >
          {image}
          <h6>{attachment.name}</h6>
        </a>
      );
  }
}
