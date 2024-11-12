import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { createFormationSubscription } from '../../../../../../../../../../utils/api/formationSubscriptions';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import styles from './CreateModal.module.scss';

const routeApi = getRouteApi('/app/tools/formations/subscribers/$formationDetailId/create');

const yupSchema = yup.object({
  lastName: yup.string().required('Le nom est requis'),
  firstName: yup.string().required('Le prénom est requis'),
  email: yup.string().email().required("L'email est requis"),
  phoneNumber: yup.string().required('Le numéro de téléphone est requis'),
});

export default function AppViewToolsViewFormationsViewSubscribersModalViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { formationDetailId } = routeApi.useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ email, phoneNumber, lastName, firstName }: yup.InferType<typeof yupSchema>) =>
      createFormationSubscription({
        email,
        phoneNumber,
        lastName,
        firstName,
        subscriptionFormationInfoId: formationDetailId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['formation-subscriptions']._def });
      toast.success('Participant ajouté avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout du participant");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.header}>
          <h6>Ajouter un participant</h6>
        </div>
        <div className={styles.container}>
          <form className={styles.content} onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.form_group}>
              <label htmlFor="lastName">Nom</label>
              <input type="text" id="lastName" {...register('lastName')} />
              <p className={styles.__errors}>{errors.lastName?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="firstName">Prénom</label>
              <input type="text" placeholder="Prénom" id="firstName" {...register('firstName')} />
              <p className={styles.__errors}>{errors.firstName?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="email">Adresse email</label>
              <input type="email" id="email" {...register('email')} />
              <p className={styles.__errors}>{errors.email?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="phoneNumber">Numéro de téléphone</label>
              <input type="text" id="phoneNumber" {...register('phoneNumber')} />
              <p className={styles.__errors}>{errors.phoneNumber?.message}</p>
            </div>
            <div className={styles.buttons}>
              <button type="submit" disabled={isPending} className="btn btn-primary">
                Ajouter
              </button>
            </div>
          </form>
          <div className={styles.form__loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
