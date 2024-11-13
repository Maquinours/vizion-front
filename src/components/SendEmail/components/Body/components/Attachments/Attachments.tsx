import { useDropzone } from 'react-dropzone';
import { MdAdd } from 'react-icons/md';
import styles from './Attachments.module.scss';
import { v4 as uuidv4 } from 'uuid';
import { FaTrash } from 'react-icons/fa';
import { useContext } from 'react';
import { SendEmailFormContext } from '../../../../utils/contexts/sendEmail';
import { formatFileName } from '../../../../../../utils/functions/files';
import { useWatch } from 'react-hook-form';

export default function SendEmailComponentBodyComponentAttachmentsComponent() {
  const { setValue, control } = useContext(SendEmailFormContext)!;

  const attachments = useWatch({ control, name: 'attachments' });

  const onDrop = (acceptedFiles: Array<File>) => {
    setValue('attachments', [
      ...attachments,
      ...acceptedFiles.map((file) => ({
        id: uuidv4(),
        file: new File([file], formatFileName(file.name), { type: file.type, lastModified: file.lastModified }),
      })),
    ]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={styles.dropzone_container}>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Deposer le(s) fichier(s) dans la zone.</p>
        ) : (
          <div className="plus">
            <p>Ajouter une pièce jointe</p>
            <MdAdd size="45" color="#F24C52" />
          </div>
        )}
      </div>
      {attachments.length > 0 && (
        <div className={styles.selected_files}>
          <h4>Pièces jointes</h4>
          <ul>
            {attachments.map(({ id, file }) => {
              let fileSize;
              if (file.size > 1_000_000) fileSize = `${Math.floor(file.size / 1_000_000)} Mo`;
              else if (file.size > 1_000) fileSize = `${Math.floor(file.size / 1_000)} Ko`;
              else fileSize = `${file.size} octets`;
              return (
                <li key={id}>
                  <span>
                    <a href={URL.createObjectURL(file)} target="_blank" rel="noreferrer">
                      {formatFileName(file.name)}
                    </a>
                    - {fileSize}
                  </span>
                  <button
                    onClick={() =>
                      setValue(
                        'attachments',
                        attachments.filter((f) => f.id !== id),
                      )
                    }
                  >
                    <FaTrash color="#F24C52" width={14} height={14} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
