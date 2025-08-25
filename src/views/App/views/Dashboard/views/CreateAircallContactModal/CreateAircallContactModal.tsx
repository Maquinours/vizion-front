import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { createAircallContact } from '../../../../../../utils/api/aircall';
import { aircallQueryKeys } from '../../../../../../utils/constants/queryKeys/aircall';
import styles from './CreateAircallContactModal.module.scss';

const routeApi = getRouteApi('/app/dashboard/create-aircall-contact/$number');

const yupSchema = yup.object({
  note: yup.string().required('Le contenu est requis'),
});

export default function AppViewDashboardViewCreateAircallContactModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { number } = routeApi.useParams();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      note: '',
    },
  });

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ note }: yup.InferType<typeof yupSchema>) =>
      createAircallContact({
        last_name: note,
        phone_numbers: [{ label: 'other', value: number.replaceAll(' ', '') }],
        emails: [],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aircallQueryKeys._def });
      toast.success('Note ajoutée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout de note");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Ajouter une note au numéro de téléphone {number}</p>
        </div>

        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.form_group}>
              <label className="label" htmlFor="information">
                Note :
              </label>
              <input type="text" id="information" {...register('note')} />
              <p className={styles.__errors}>{errors.note?.message}</p>
            </div>

            <div className={styles.form_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.form_buttons}>
              <button className="btn btn-primary-light" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" disabled={isPending} className="btn btn-secondary">
                Valider
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
