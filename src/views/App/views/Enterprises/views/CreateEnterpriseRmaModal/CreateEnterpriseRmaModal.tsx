import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { createRma } from '../../../../../../utils/api/rma';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { enterprises } from '../../../../../../utils/constants/queryKeys/enterprise';
import styles from './CreateEnterpriseRmaModal.module.scss';

const routeApi = getRouteApi('/app/enterprises/create-enterprise-rma/$enterpriseId');

export default function CreateEnterpriseRmaModal() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { enterpriseId } = routeApi.useParams();

  const { data: enterprise } = useSuspenseQuery(enterprises.detail(enterpriseId));

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createRma({
        addressCompanyName: enterprise.name,
        addressOne: enterprise.addressLineOne,
        addressTwo: enterprise.addressLineTwo,
        addressZipCode: enterprise.zipCode,
        addressCity: enterprise.city,
        addressPhone: enterprise.phoneNumber,
        addressEmail: enterprise.email,
        enterpriseId: enterprise.id,
        enterpriseName: enterprise.name,
        enterpriseCategory: enterprise.category,
        deliveryDepartmentCode: null,
      }),
    onSuccess: (data) => {
      toast.success('RMA créé avec succès');
      queryClient.setQueryData(queries.rmas.detail(data.id).queryKey, data);
      // TODO: navigate to the created RMA
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la création du RMA');
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
          <p>Ajouter un RMA</p>
        </div>

        <div className={styles.__form}>
          <form onSubmit={onSubmit} onReset={onClose}>
            <div className={styles.content}>
              <p>
                {"Vous êtes sur le point de créer un RMA pour l'entreprise "}
                <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{enterprise.name}</span>{' '}
              </p>
              <p>Voulez-vous continuer ?</p>
            </div>

            <div className={styles.form__loader}>
              <PulseLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.form__buttons}>
              <button className="btn btn-primary-light" type="reset">
                Annuler
              </button>
              <button type="submit" className="btn btn-secondary">
                Oui
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
