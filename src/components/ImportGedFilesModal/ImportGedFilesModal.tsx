import ReactModal from 'react-modal';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import styles from './ImportGedFilesModal.module.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFilesOnS3 } from '../../utils/api/ged';
import FileType from '../../utils/enums/FileType';
import { MdAdd } from 'react-icons/md';
import { ClipLoader } from 'react-spinners';
import { FaTrash } from 'react-icons/fa';
import { gedQueryKeys } from '../../utils/constants/queryKeys/ged';
import { toast } from 'react-toastify';

type ImportGedFilesModalComponentProps = Readonly<{
  directoryRelativePath: string;
  id: string;
  type: FileType;
  onClose: () => void;
}>;
export default function ImportGedFilesModalComponent({ directoryRelativePath, id, type, onClose }: ImportGedFilesModalComponentProps) {
  const queryClient = useQueryClient();

  const [files, setFiles] = useState<{ file: File; id: string }[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles((old) => [...old, ...acceptedFiles.map((file) => ({ file, id: uuidv4() }))]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      uploadFilesOnS3(
        directoryRelativePath ?? `ged/${type.toLowerCase()}/${id}/`,
        id,
        type,
        files.map((file) => file.file),
      ),
    onMutate: () => ({ files }),
    onSuccess: (_data, _params, context) => {
      queryClient.invalidateQueries({ queryKey: gedQueryKeys.all });
      onClose();
      if (context.files.length > 1) toast.success('Fichiers importés avec succès');
      else toast.success('Fichier importé avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'importation des fichiers");
    },
  });

  const onFileNameChange = (id: string, newName: string) => {
    const sanitizedValue = newName.replace(/[/\\:*?"<>|]/g, ''); // Remove forbidden characters
    setFiles((files) => files.map((f) => (f.id === id ? { ...f, file: new File([f.file], sanitizedValue) } : f)));
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <h6>Importer un fichier</h6>
        </div>

        <div className={styles.form}>
          <div className={styles.form_group}>
            <div className={styles.form_label}>
              <div className={styles.dropzone_container}>
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Deposer le(s) fichier(s) dans la zone.</p>
                  ) : (
                    <div className="plus">
                      <MdAdd size="45" color="#F24C52" />
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.fileName}>
                {files.length > 0 && (
                  <div className={styles.selected_files}>
                    <h4>Pièces jointes</h4>
                    <ul>
                      {files.map((file) => (
                        <li key={file.id}>
                          <div className={styles.file_detail}>
                            <input value={file.file.name} onChange={(e) => onFileNameChange(file.id, e.target.value)} />
                          </div>
                          <div className={styles.file_remove}>
                            <button onClick={() => setFiles((files) => files.filter((f) => f.id !== file.id))}>
                              <FaTrash color="#F24C52" width={16} height={16} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className={styles.loader}>
                <ClipLoader color="#31385A" loading={isPending} size="18px" />
              </div>

              <div className={styles.form_buttons}>
                <button className="btn btn-primary-light" onClick={() => setFiles([])}>
                  Annuler
                </button>
                <button disabled={files.length === 0} className="btn btn-secondary" onClick={() => mutate()}>
                  Importer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
