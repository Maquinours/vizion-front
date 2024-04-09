import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { PropagateLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import TableComponent from '../../../../../../../../components/Table/Table';
import { createProfiles } from '../../../../../../../../utils/api/profile';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import ProfileRequestDto from '../../../../../../../../utils/types/ProfileRequestDto';
import styles from './StepTwo.module.scss';

const Route = getRouteApi('/app/enterprises/$enterpriseId/import-contacts');

const columnHelper = createColumnHelper<ProfileRequestDto>();
const columns = [
  columnHelper.display({ header: 'Agence', cell: ({ row: { original } }) => original.landlinePhoneNumber }),
  columnHelper.display({ header: 'Civilité', cell: ({ row: { original } }) => original.civility }),
  columnHelper.display({ header: 'Nom', cell: ({ row: { original } }) => original.lastName }),
  columnHelper.display({ header: 'Email', cell: ({ row: { original } }) => original.email }),
  columnHelper.display({ header: 'Téléphone', cell: ({ row: { original } }) => original.phoneNumber }),
];

type AppViewEnterpriseViewImportContactsModalViewStepTwoComponentProps = Readonly<{
  profiles: Array<ProfileRequestDto>;
  setStep: React.Dispatch<React.SetStateAction<0 | 1>>;
}>;
export default function AppViewEnterpriseViewImportContactsModalViewStepTwoComponent({
  profiles,
  setStep,
}: AppViewEnterpriseViewImportContactsModalViewStepTwoComponentProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: () => createProfiles(profiles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.profiles._def });
      toast.success('Les contacts ont été importés avec succès');
      navigate({ from: Route.id, to: '..', search: (old) => old });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'importation des contacts");
    },
  });

  return (
    <div className={styles.modal_container}>
      <div className={styles.modal_title}>
        <h6>Liste des contacts importés</h6>
      </div>

      <div className={styles.modal_content}>
        <div className={styles.table_content}>
          <TableComponent<ProfileRequestDto> data={profiles} columns={columns} isLoading={false} rowId="email" />
        </div>
      </div>

      <div className={styles.modal_loader}>
        <PropagateLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
      </div>

      <div className={styles.modal_buttons}>
        <button className="btn btn-primary" onClick={() => setStep(0)}>
          Annuler
        </button>
        <button className="btn btn-secondary" onClick={() => mutate()}>
          Importer la séléction
        </button>
      </div>
    </div>
  );
}
