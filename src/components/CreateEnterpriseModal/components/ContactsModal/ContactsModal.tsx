import { createColumnHelper } from '@tanstack/react-table';
import { useCallback, useContext, useMemo } from 'react';
import { MdClose } from 'react-icons/md';
import ReactModal from 'react-modal';
import ProfileAgencyRequestDto from '../../../../utils/types/ProfileAgencyRequestDto';
import TableComponent from '../../../Table/Table';
import { CreateEnterpriseContext } from '../../utils/contexts/context';
import styles from './ContactsModal.module.scss';

const columnHelper = createColumnHelper<Omit<ProfileAgencyRequestDto, 'categoryClient'>>();

export default function CreateEnterpriseModalComponentContactsModalComponent() {
  const { contacts, setContacts, closeModal } = useContext(CreateEnterpriseContext)!;

  const removeContact = useCallback((index: number) => setContacts((prev) => [...prev].filter((_, i) => i !== index)), [setContacts]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Agence',
        cell: ({ row: { original } }) => original.landlinePhoneNumber,
      }),
      columnHelper.display({
        header: 'Civilité',
        cell: ({ row: { original } }) => original.civility,
      }),
      columnHelper.display({
        header: 'Nom',
        cell: ({ row: { original } }) => original.lastName,
      }),
      columnHelper.display({
        header: 'Prénom(s)',
        cell: ({ row: { original } }) => original.firstName,
      }),
      columnHelper.display({
        header: 'Email',
        cell: ({ row: { original } }) => original.email,
      }),
      columnHelper.display({
        header: 'Téléphone',
        cell: ({ row: { original } }) => original.phoneNumber,
      }),
      columnHelper.display({
        header: '',
        id: 'action',
        cell: ({ row: { index } }) => (
          <button onClick={() => removeContact(index)}>
            <MdClose />
          </button>
        ),
      }),
    ],
    [removeContact],
  );

  return (
    <ReactModal isOpen={true} onRequestClose={closeModal} className={styles.data_modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Liste des contacts ajoutés</h6>
        </div>

        <div className={styles.modal_content}>
          <div className={styles.table_content}>
            <TableComponent data={contacts} columns={columns} isLoading={false} />
          </div>
        </div>

        <div className={styles.modal_buttons}>
          <button className="btn btn-secondary" onClick={closeModal}>
            Valider
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
