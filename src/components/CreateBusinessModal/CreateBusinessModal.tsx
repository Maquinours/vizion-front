import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { createBusiness } from '../../utils/api/business';
import { queries } from '../../utils/constants/queryKeys';
import { businesses } from '../../utils/constants/queryKeys/business';
import { enterprises } from '../../utils/constants/queryKeys/enterprise';
import BusinessType from '../../utils/enums/BusinessType';
import CategoryClient from '../../utils/enums/CategoryClient';
import styles from './CreateBusinessModal.module.scss';

type CreateBusinessModalComponentProps = Readonly<{
  contactId: string;
  onClose: () => void;
}>;
export default function CreateBusinessModalComponent({ contactId, onClose }: CreateBusinessModalComponentProps) {
  const queryClient = useQueryClient();

  const { data: contact } = useSuspenseQuery(queries.profiles.detail(contactId));

  const { data: enterprise } = useSuspenseQuery(enterprises.detail(contact.enterprise!.id));

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createBusiness({
        title: null,
        billingAddressOne: enterprise.addressLineOne,
        billingZipCode: enterprise.zipCode,
        billingCity: enterprise.city,
        billingCompany: enterprise.name,
        billingName: `${contact.firstName ?? ''} ${contact.lastName ?? ''}`,
        reduction: enterprise.accountability?.discount ?? 0,
        deliverAddressOne: null,
        deliverAddressTwo: null,
        deliverAddressZipCode: null,
        deliverAddressCity: contact.landlinePhoneNumber,
        deliverAddressCompany: enterprise.name,
        deliverAddressName: `${contact.firstName ?? ''} ${contact.lastName ?? ''}`,
        deliverPhoneNumber: null,
        enterpriseId: enterprise.id,
        enterpriseName: enterprise.name,
        enterpriseCategory: enterprise.category,
        representativeId: null,
        installerProfileId: enterprise.category === CategoryClient.INSTALLATEUR ? contact.id : null,
        installerProfileName: enterprise.category === CategoryClient.INSTALLATEUR ? enterprise.name : null,
        installerProfileEmail: enterprise.category === CategoryClient.INSTALLATEUR ? contact.email : null,
        representativeName: null,
        representativeZipCode: null,
        zipCode: null,
        type: enterprise.category === CategoryClient.FOURNISSEUR ? BusinessType.CONTACT_FOURNISSEUR : BusinessType.CONTACT,
        profileId: contact.id,
        profileName: `${contact.firstName ?? ''} ${contact.lastName ?? ''}`,
        profileEmail: contact.email,
        profilePhone: contact.phoneNumber,
        deliveryDepartmentCode: null,
        exportTva: true,
        deliveryMode: 'A expédier',
        billAndLock: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businesses._def });
      toast.success('Affaire créée avec succès');
      // TODO: navigate to business
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la création de l'affaire");
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <p>Ajouter une affaire</p>
        </div>

        <div className={styles.__form}>
          <form onSubmit={onSubmit}>
            <div className={styles.content}>
              <p>
                {"Vous êtes sur le point de créer une affaire pour l'entreprise "}
                <span
                  style={{
                    color: 'var(--secondary-color)',
                    fontWeight: 'bold',
                  }}
                >
                  {enterprise.name}
                </span>{' '}
              </p>
              <p>Voulez-vous continuer ?</p>
            </div>

            <div className={styles.form__loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.form__buttons}>
              <button className="btn btn-primary-light" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-secondary">
                Créer
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
