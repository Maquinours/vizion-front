import { Link, getRouteApi } from '@tanstack/react-router';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './StepOne.module.scss';
import ProfileRequestDto from '../../../../../../../../utils/types/ProfileRequestDto';
import { excelFileToObject } from '../../../../../../../../utils/functions/files';
import ProfileClient from '../../../../../../../../utils/enums/ProfileClient';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/import-contacts');
const routePath = '/app/enterprises/$enterpriseId/import-contacts';

type AppViewEnterpriseViewImportContactsModalViewStepOneComponentProps = Readonly<{
  file: File | undefined;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  setProfiles: React.Dispatch<React.SetStateAction<Array<ProfileRequestDto>>>;
  setStep: React.Dispatch<React.SetStateAction<0 | 1>>;
}>;
export default function AppViewEnterpriseViewImportContactsModalViewStepOneComponent({
  file,
  setFile,
  setProfiles,
  setStep,
}: AppViewEnterpriseViewImportContactsModalViewStepOneComponentProps) {
  const { enterpriseId } = routeApi.useParams();

  const onDrop = useCallback(
    (files: Array<File>) => {
      if (files.length === 1) setFile(files[0]);
    },
    [setFile],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/vnd.ms-excel': ['.xls'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    maxFiles: 1,
  });

  const onSubmit = useCallback(
    (file: File) => {
      excelFileToObject(file).then((data) => {
        setProfiles(
          data.map((row) => ({
            lastName: row.Nom ?? '',
            firstName: row.Prenom,
            civility: row.Civilité === 'M' ? 'Monsieur' : row.Civilité === 'F' ? 'Madame' : 'Service',
            email: row.Mail,
            password: null,
            phoneNumber: row.Telephone,
            standardPhoneNumber: row.Portable,
            landlinePhoneNumber: row.AGENCE,
            job: row.Fonction,
            profileClient: ProfileClient[row.Profil as keyof typeof ProfileClient],
            siteIdentifier: null,
            enterpriseId,
            expert: false,
          })),
        );
      });
      setStep(1);
    },
    [enterpriseId, setProfiles, setStep],
  );

  return (
    <div className={styles.modal_container}>
      <div className={styles.modal_title}>
        <h6>Import de contacts</h6>
      </div>

      <div className={styles.modal_content}>
        <div className={styles.form_group}>
          <label htmlFor="contacts-files">Téléverser le fichier</label>
          <div {...getRootProps({ className: styles.dropzone })}>
            <input id="contacts-files" {...getInputProps()} />
            <p>Glissez le fichier de contacts à importer ici</p>
          </div>
          {file && (
            <p>
              {file.name} - {file.size} octets
            </p>
          )}
        </div>
      </div>
      <div className={styles.modal_buttons}>
        <Link from={routePath} to=".." search className="btn btn-primary">
          Annuler
        </Link>
        <button className="btn btn-secondary" onClick={() => onSubmit(file!)}>
          Valider
        </button>
      </div>
    </div>
  );
}
