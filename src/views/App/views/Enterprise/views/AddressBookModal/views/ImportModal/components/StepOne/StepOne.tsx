import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { PropagateLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { excelFileToObject } from '../../../../../../../../../../utils/functions/files';
import AddressRequestDto, { isAddressRequestDto } from '../../../../../../../../../../utils/types/AddressRequestDto';
import styles from './StepOne.module.scss';
import { useEffect } from 'react';
import AmountFormat from '../../../../../../../../../../components/AmountFormat/AmountFormat';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/app/enterprises/$enterpriseId/address-book/import');

const yupSchema = yup.object().shape({
  file: yup.mixed<File>().required('Le fichier est requis'),
});

type AppViewEnterpriseViewAddressBookModalViewImportModalViewStepOneComponentProps = Readonly<{
  onSubmit: (file: File, addresses: Array<AddressRequestDto>) => void;
  onClose: () => void;
  file: File | undefined;
}>;
export default function AppViewEnterpriseViewAddressBookModalViewImportModalViewStepOneComponent({
  onSubmit,
  onClose,
  file,
}: AppViewEnterpriseViewAddressBookModalViewImportModalViewStepOneComponentProps) {
  const { enterpriseId } = routeApi.useParams();

  const { setValue, control, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const onDrop = (files: Array<File>) => {
    if (files.length === 1) setValue('file', files[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/vnd.ms-excel': ['.xls'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    maxFiles: 1,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ file }: yup.InferType<typeof yupSchema>) => excelFileToObject(file),
    onSuccess: (data, { file }) => {
      const addresses = data
        .map((row) => ({
          enterpriseName: row['Société'],
          addressLineOne: row['Adresse 1'],
          addressLineTwo: row['Adresse 2'],
          zipCode: row['Code postal'],
          city: row['Ville'],
          email: row['Adresse email'],
          phoneNumber: row['Téléphone'],
          fullName: row['Nom complet'],
          enterpriseId,
        }))
        .filter(isAddressRequestDto);
      onSubmit(file, addresses);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la lecture du fichier');
    },
  });

  useEffect(() => {
    if (file) setValue('file', file);
  }, [file]);

  return (
    <div className={styles.modal_container}>
      <div className={styles.modal_title}>
        <h6>Import d'adresses</h6>
      </div>

      <form onSubmit={handleSubmit((data) => mutate(data))}>
        <div className={styles.modal_content}>
          <div className={styles.form_group}>
            <label htmlFor="addresses-files">Téléverser le fichier</label>
            <div {...getRootProps({ className: styles.dropzone })}>
              <input id="addresses-files" {...getInputProps()} />
              <p>Glissez le fichier d'adresses à importer ici</p>
            </div>
            <Controller
              control={control}
              name="file"
              render={({ field: { value } }) =>
                !!value && (
                  <p>
                    {value.name} - <AmountFormat displayType="text" value={value.size} suffix=" octets" />
                  </p>
                )
              }
            />
          </div>
        </div>
        <div className={styles.modal_loader}>
          <PropagateLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
        </div>
        <div className={styles.modal_buttons}>
          <button type="button" className="btn btn-primary" onClick={() => onClose()}>
            Annuler
          </button>
          <button type="submit" disabled={isPending} className="btn btn-secondary">
            Valider
          </button>
        </div>
      </form>
    </div>
  );
}
