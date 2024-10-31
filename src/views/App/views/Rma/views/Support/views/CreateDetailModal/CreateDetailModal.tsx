import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { getProductSerialNumberByNumber } from '../../../../../../../../utils/api/productSerialNumber';
import { createRmaSupportDetail } from '../../../../../../../../utils/api/rmaSupportDetail';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './CreateDetailModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support/create-detail');

const yupSchema = yup.object().shape({
  productReference: yup.string().required('La référence est requise.'),
  productSerialNumber: yup.string().required('Champs requis'),
  businessNumber: yup.string().nullable(),
  issue: yup.string().nullable(),
  internalComment: yup.string().nullable(),
});

export default function AppViewRmaViewSupportViewCreateDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { rmaId } = routeApi.useParams();

  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      productReference: '',
      productSerialNumber: '',
      businessNumber: '',
      issue: '',
      internalComment: '',
    },
  });

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  const { mutate: fetchProductBySerialNumber, isPending: isFetchingProductBySerialNumber } = useMutation({
    mutationFn: async () => {
      if (!(await trigger('productSerialNumber'))) throw new Error('INVALID SERIAL NUMBER');
      return getProductSerialNumberByNumber(getValues('productSerialNumber'));
    },
    onSuccess: (data) => {
      setValue('productReference', data.productRef ?? '');
      setValue('businessNumber', data.businessNumber);
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 404) toast.error('Numéro de série introuvable');
      else if (error.message !== 'INVALID SERIAL NUMBER') {
        console.error(error);
        toast.error('Une erreur est survenue lors de la recherche du numéro de série');
      }
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ productReference, productSerialNumber, businessNumber, issue, internalComment }: yup.InferType<typeof yupSchema>) =>
      createRmaSupportDetail({
        productRef: productReference,
        productSerialNumber,
        businessNum: businessNumber,
        issue,
        warranty: false,
        comment: null,
        internalComment,
        supportId: rma.assistanceSupport!.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.rmas._def });
      toast.success('Détail ajouté avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout du détail");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Ajouter un article</h6>
        </div>
        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.form_group}>
              <label htmlFor="productSerialNumber">Numéro de série</label>
              <input id="productSerialNumber" {...register('productSerialNumber')} type="text" />
              <p className={styles.__errors}>{errors.productSerialNumber?.message}</p>
            </div>
            <div className={styles.search_button}>
              <button type="button" className="btn btn-primary" onClick={() => fetchProductBySerialNumber()}>
                Rechercher
              </button>
            </div>
            <div className={styles.search_loader}>
              <PulseLoader color="#31385A" loading={isFetchingProductBySerialNumber} className="" size={10} speedMultiplier={0.5} />
            </div>
            <div className={styles.form_group}>
              <label htmlFor="productReference">Référence</label>
              <input id="productReference" {...register('productReference')} type="text" />
              <p className={styles.__errors}>{errors.productReference?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="businessNumber">{"Nr d'affaire"}</label>
              <input id="businessNumber" {...register('businessNumber')} type="text" />
              <p className={styles.__errors}>{errors.businessNumber?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="productProblem">Problème décrit</label>
              <textarea id="productProblem" rows={4} {...register('issue')} />
              <p className={styles.__errors}>{errors.issue?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="comment">Commentaire interne</label>
              <textarea id="comment" rows={4} {...register('internalComment')} />
              <p className={styles.__errors}>{errors.internalComment?.message}</p>
            </div>
            <div className={styles.modal_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>
            <div className={styles.modal_buttons}>
              <button
                type="button"
                disabled={isPending}
                className="btn btn-primary-light"
                onClick={() => {
                  onClose();
                }}
              >
                Annuler
              </button>
              <button type="submit" className="btn btn-secondary">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
