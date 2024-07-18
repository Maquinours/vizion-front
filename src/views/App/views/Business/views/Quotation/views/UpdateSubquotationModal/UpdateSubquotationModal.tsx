import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './UpdateSubquotationModal.module.scss';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { updateBusinessSubQuotation } from '../../../../../../../../utils/api/businessSubQuotations';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation/update-subquotation/$subquotationId');

const yupSchema = yup.object({
  name: yup.string().required('Le nom est requis'),
});

export default function AppViewBusinessViewQuotationViewUpdateSubquotationModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId, subquotationId } = routeApi.useParams();

  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));
  const { data: subquotation } = useSuspenseQuery(queries['business-sub-quotations'].detail._ctx.byId(subquotationId));

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      name: subquotation.name,
    },
  });

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ name }: yup.InferType<typeof yupSchema>) => updateBusinessSubQuotation(subquotation.id, { quotationId: quotation.id, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-sub-quotations']._def });
      toast.success('Sous devis modifié avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erreur lors de la modification du sous devis');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Modification du sous devis</h6>
        </div>
        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
            <div className={styles.form_group}>
              <label htmlFor="subQuoteName">Nom :</label>
              <input id="subQuoteName" {...register('name')} autoComplete="off" />
              <p className={styles.__errors}>{errors.name?.message}</p>
            </div>

            <div className={styles.modal_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.modal_buttons}>
              <button type="reset" className="btn btn-primary-light">
                Annuler
              </button>
              <button type="submit" className="btn btn-secondary">
                Modifier
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
