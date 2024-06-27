import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { PropagateLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import TableComponent from '../../../../../../../../../../components/Table/Table';
import { createAddresses } from '../../../../../../../../../../utils/api/address';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import AddressRequestDto from '../../../../../../../../../../utils/types/AddressRequestDto';
import styles from './StepTwo.module.scss';
import AmountFormat from '../../../../../../../../../../components/AmountFormat/AmountFormat';

const columnHelper = createColumnHelper<AddressRequestDto>();
const columns = [
  columnHelper.display({ header: 'Entreprise', cell: ({ row: { original } }) => original.enterpriseName }),
  columnHelper.display({ header: 'Adresse 1', cell: ({ row: { original } }) => original.addressLineOne }),
  columnHelper.display({ header: 'Adresse 2', cell: ({ row: { original } }) => original.addressLineTwo }),
  columnHelper.display({ header: 'Code postal', cell: ({ row: { original } }) => original.zipCode }),
  columnHelper.display({ header: 'Ville', cell: ({ row: { original } }) => original.city }),
  columnHelper.display({ header: 'Numéro de téléphone', cell: ({ row: { original } }) => original.phoneNumber }),
  columnHelper.display({ header: 'Adresse email', cell: ({ row: { original } }) => original.email }),
  columnHelper.display({ header: 'Nom complet', cell: ({ row: { original } }) => original.fullName }),
  columnHelper.display({ id: 'scrollbar_compensator' }),
];

type AppViewEnterpriseViewAddressBookModalViewImportModalViewStepTwoComponentProps = Readonly<{
  addresses: Array<AddressRequestDto>;
  onPrevious: () => void;
  onClose: () => void;
}>;
export default function AppViewEnterpriseViewAddressBookModalViewImportModalViewStepTwoComponent({
  addresses,
  onPrevious,
  onClose,
}: AppViewEnterpriseViewAddressBookModalViewImportModalViewStepTwoComponentProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => createAddresses(addresses),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.address._def });
      toast.success('Les adresses ont été importées avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'importation des adresses");
    },
  });

  return (
    <div className={styles.modal_container}>
      <div className={styles.modal_title}>
        <h6>Liste des adresses importées</h6>
      </div>

      <div className={styles.modal_content}>
        <div className={styles.table_content}>
          <TableComponent data={addresses} columns={columns} isLoading={false} rowId="email" />
        </div>
        <div className="mt-2 flex justify-end">
          <AmountFormat value={addresses.length} prefix="Total : " suffix=" adresses" className="font-bold" />
        </div>
      </div>

      <div className={styles.modal_loader}>
        <PropagateLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
      </div>

      <div className={styles.modal_buttons}>
        <button className="btn btn-primary" onClick={() => onPrevious()}>
          Annuler
        </button>
        <button disabled={isPending || addresses.length === 0} className="btn btn-secondary" onClick={() => mutate()}>
          Importer la séléction
        </button>
      </div>
    </div>
  );
}
