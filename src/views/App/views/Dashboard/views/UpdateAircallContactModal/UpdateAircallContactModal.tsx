import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { updateAircallContact } from '../../../../../../utils/api/aircall';
import { aircallQueryKeys } from '../../../../../../utils/constants/queryKeys/aircall';
import styles from './UpdateAircallContactModal.module.scss';

const routeApi = getRouteApi('/app/dashboard/update-aircall-contact/$contactId');

const yupSchema = yup.object({
  note: yup.string().required('Le contenu est requis'),
});

export default function AppViewDashboardViewUpdateAircallContactModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { contactId } = routeApi.useParams();

  const numberedContactId = Number(contactId);

  const { data: contact } = useSuspenseQuery(aircallQueryKeys.contacts._ctx.byId(numberedContactId));

  const {
    register,
    reset,
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
      updateAircallContact(numberedContactId, {
        information: note,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aircallQueryKeys._def });
      toast.success('Note modifiée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification de la note');
    },
  });

  useEffect(() => {
    reset({ note: contact.contact.information ?? '' });
  }, [contact.contact.information]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Modifier la note liée à un numéro de téléphone</p>
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
