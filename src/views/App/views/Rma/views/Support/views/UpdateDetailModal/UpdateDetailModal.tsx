import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './UpdateDetailModal.module.scss';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { updateRmaSupportDetail } from '../../../../../../../../utils/api/rmaSupportDetail';
import * as yup from 'yup';
import { rmaSupportDetailQueryKeys } from '../../../../../../../../utils/constants/queryKeys/rmaSupportDetail';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getProductSerialNumberByNumber } from '../../../../../../../../utils/api/productSerialNumber';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { useEffect } from 'react';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/support/update-detail/$detailId');

const yupSchema = yup.object().shape({
  productReference: yup.string().required('La référence est requise.'),
  productSerialNumber: yup.string().required('Champs requis'),
  businessNum: yup.string().nullable(),
  issue: yup.string().nullable(),
  internalComment: yup.string().nullable(),
});

export default function AppViewRmaViewSupportViewUpdateDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { rmaId, detailId } = routeApi.useParams();

  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));
  const { data: detail } = useSuspenseQuery(rmaSupportDetailQueryKeys.detail._ctx.byId(detailId));

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
      businessNum: '',
      issue: '',
      internalComment: '',
    },
  });

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate: fetchProductBySerialNumber, isPending: isFetchingProductBySerialNumber } = useMutation({
    mutationFn: async () => {
      if (!(await trigger('productSerialNumber'))) throw new Error('INVALID SERIAL NUMBER');
      return getProductSerialNumberByNumber(getValues('productSerialNumber'));
    },
    onSuccess: (data) => {
      setValue('productReference', data.productRef ?? '');
      setValue('businessNum', data.businessNumber);
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
    mutationFn: ({ productReference, productSerialNumber, issue, businessNum, internalComment }: yup.InferType<typeof yupSchema>) =>
      updateRmaSupportDetail(detail.id, {
        productRef: productReference,
        productSerialNumber,
        businessNum,
        issue,
        warranty: detail.warranty,
        comment: detail.comment,
        internalComment,
        supportId: rma.assistanceSupport?.id,
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

  useEffect(() => {
    setValue('productReference', detail.productRef ?? '');
    setValue('businessNum', detail.businessNum);
    setValue('productSerialNumber', detail.productSerialNumber);
    setValue('issue', detail.issue);
    setValue('internalComment', detail.internalComment);
  }, [detail.id]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Modifier un article</h6>
        </div>
        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))} onReset={() => onClose()}>
            <div className={styles.form_group}>
              <label htmlFor="productSerialNumber">Numéro de série</label>
              <input id="productSerialNumber" {...register('productSerialNumber')} type="text" />
              <p className={styles.__errors}>{errors.productSerialNumber?.message}</p>
            </div>
            <div className={styles.search_button}>
              <button className="btn btn-primary" onClick={() => fetchProductBySerialNumber()}>
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
              <input id="businessNumber" {...register('businessNum')} type="text" />
              <p className={styles.__errors}>{errors.businessNum?.message}</p>
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
              <button className="btn btn-primary-light" type="reset">
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
