import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { rmaDeliveryDetailQueryKeys } from '../../../../../../../../utils/constants/queryKeys/rmaDeliveryDetail';
import styles from './UpdateDetailModal.module.scss';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BusinessBillResponseDto from '../../../../../../../../utils/types/BusinessBillResponseDto';
import { getBusinessBillsByBusinessId } from '../../../../../../../../utils/api/businessBill';
import { getProductSerialNumberByNumber } from '../../../../../../../../utils/api/productSerialNumber';
import moment from 'moment';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { PulseLoader } from 'react-spinners';
import BillType from '../../../../../../../../utils/enums/BillType';
import { useEffect } from 'react';
import { updateRmaDeliveryDetail } from '../../../../../../../../utils/api/rmaDeliveryDetail';
import { queries } from '../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/delivery/update-detail/$detailId');

const yupSchema = yup.object().shape({
  productReference: yup.string().required('La référence est requise.'),
  productSerialNumber: yup.string().required('Le numéro de série est requis.'),
  businessNumber: yup.string().nullable(),
  productProblem: yup.string().nullable(),
  internalComment: yup.string().nullable(),
  comment: yup.string().nullable(),
  warranty: yup.string().required('Champs requis'),
  constat: yup.string().required('Champs requis'),
  solution: yup.string().nullable(),
  bill: yup.mixed<BusinessBillResponseDto>().nullable(),
});

export default function AppViewRmaViewDeliveryViewUpdateDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { rmaId, detailId } = routeApi.useParams();

  const {
    register,
    control,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));
  const { data: detail } = useSuspenseQuery(rmaDeliveryDetailQueryKeys.detail._ctx.byId(detailId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate: fetchProductBySerialNumber, isPending: isFetchingProductBySerialNumber } = useMutation({
    mutationFn: async () => {
      if (!(await trigger('productSerialNumber'))) throw new Error('INVALID SERIAL NUMBER');
      const productSerialNumber = await getProductSerialNumberByNumber(getValues('productSerialNumber'));
      let bills: Array<BusinessBillResponseDto> | undefined = undefined;
      if (productSerialNumber.businessId) bills = await getBusinessBillsByBusinessId(productSerialNumber.businessId);
      return { productSerialNumber, bills };
    },
    onSuccess: ({ productSerialNumber, bills }) => {
      setValue('productReference', productSerialNumber.productRef ?? '');
      setValue('businessNumber', productSerialNumber.businessNumber ?? '');
      const bill = bills?.find((bill) => bill.type === BillType.FACTURE);
      if (bill) {
        setValue('bill', bill);
        setValue('warranty', moment().diff(moment(bill.createdDate), 'years') >= 2 ? 'Non' : 'Oui'); // If the bill was created 2 or more years ago, the warranty is no longer valid.
      } else {
        setValue('bill', undefined);
        toast.warning('La date de facture n\'a pas pu être retrouvée. Le champ "Garantie" n\'a donc pas été mis à jour automatiquement.');
      }
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
    mutationFn: (data: yup.InferType<typeof yupSchema>) =>
      updateRmaDeliveryDetail(detail.id, {
        productRef: data.productReference,
        productSerialNumber: data.productSerialNumber,
        businessNum: data.businessNumber,
        issue: data.productProblem,
        warranty: data.warranty === 'Oui' ? true : false,
        comment: data.comment,
        internalComment: data.internalComment,
        found: data.constat === 'Oui' ? true : false,
        solution: data.solution,
        deliveryId: rma.assistanceDelivery?.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.rmas._def });
      toast.success('Détail modifié avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification du détail');
    },
  });

  useEffect(() => {
    setValue('productReference', detail.productRef);
    setValue('businessNumber', detail.businessNum);
    setValue('productSerialNumber', detail.productSerialNumber);
    setValue('productProblem', detail.issue);
    setValue('comment', detail.comment);
    setValue('warranty', detail.warranty ? 'Oui' : 'Non');
    setValue('comment', detail.comment);
    setValue('internalComment', detail.internalComment);
    setValue('constat', detail.found ? 'Oui' : 'Non');
    setValue('solution', detail.solution);
  }, [detail.id]);

  return (
    <ReactModal isOpen onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
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
              <label htmlFor="warranty">
                Produit sous garantie ?{' '}
                <Controller
                  control={control}
                  name="bill"
                  render={({ field: { value } }) => (
                    <>
                      {value && (
                        <b>
                          Facture {value.number} du {moment(value.createdDate).format('DD/MM/YYYY')}
                        </b>
                      )}
                    </>
                  )}
                />
              </label>
              <div className={styles.form_group_radio}>
                <div className={styles.form__radio}>
                  <input type="radio" {...register('warranty')} id="warranty-yes" value="Oui" />
                  <label htmlFor="warranty-yes">Oui</label>
                </div>
                <div className={styles.form__radio}>
                  <input type="radio" {...register('warranty')} id="warranty-no" value="Non" />
                  <label className="label" htmlFor="warranty-no">
                    Non
                  </label>
                </div>
              </div>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="productProblem">Problème décrit</label>
              <textarea id="productProblem" rows={4} {...register('productProblem')} />
              <p className={styles.__errors}>{errors.productProblem?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="warranty">Constaté ?</label>
              <div className={styles.form_group_radio}>
                <div className={styles.form__radio}>
                  <input type="radio" {...register('constat')} id="constat-yes" value="Oui" />
                  <label htmlFor="constat-yes">Oui</label>
                </div>
                <div className={styles.form__radio}>
                  <input type="radio" {...register('constat')} id="constat-no" value="Non" />
                  <label className="label" htmlFor="constat-no">
                    Non
                  </label>
                </div>
              </div>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="comment">Commentaire</label>
              <textarea id="comment" rows={4} {...register('comment')} />
              <p className={styles.__errors}>{errors.comment?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="comment">Commentaire interne</label>
              <textarea id="internalComment" rows={4} {...register('internalComment')} />
              <p className={styles.__errors}>{errors.comment?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="solution">Solution appliquée</label>
              <textarea id="solution" rows={4} {...register('solution')} />
              <p className={styles.__errors}>{errors.solution?.message}</p>
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
