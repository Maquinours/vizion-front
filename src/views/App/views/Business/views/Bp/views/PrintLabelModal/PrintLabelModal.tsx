import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { printLabel } from '../../../../../../../../utils/api/business';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './PrintLabelModal.module.scss';
import { useEffect } from 'react';

const yupSchema = yup.object().shape({
  reference: yup.string().required(),
  text: yup.string().optional(),
});

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bp/print-label/$detailId');

export default function AppViewBusinessViewBpViewPrintLabelModalView() {
  const navigate = routeApi.useNavigate();

  const { detailId } = routeApi.useParams();

  const { data: detail } = useSuspenseQuery(queries['business-bp-details'].detail._ctx.byId(detailId));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ reference, text }: yup.InferType<typeof yupSchema>) => printLabel({ bigText: reference, smallText: text }),
    onSuccess: () => {
      toast.success("L'étiquette a été imprimée avec succès");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'impression de l'étiquette");
    },
  });

  useEffect(() => {
    reset({ reference: detail.productReference }, { keepDirtyValues: true });
  }, [detail.productReference]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Imprimer une étiquette</h6>
        </div>
        <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
          <div className={styles.modal_content}>
            <div className={styles.form_group}>
              <label htmlFor="reference">Référence :</label>
              <input id="reference" {...register('reference')} type="text" />
              <p className={styles.__errors}>{errors.reference?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="text">Texte libre :</label>
              <input id="text" {...register('text')} type="text" />
              <p className={styles.__errors}>{errors.text?.message}</p>
            </div>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button type="reset" className="btn btn-primary-light">
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              Imprimer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
