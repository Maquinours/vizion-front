import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import * as yup from 'yup';
import styles from './UpdateDetailModal.module.scss';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import ProductVersionResponseDto from '../../../../../../../../utils/types/ProductVersionResponseDto';
import { updateBusinessBpDetail } from '../../../../../../../../utils/api/businessBpDetails';
import BusinessBpResponseDto from '../../../../../../../../utils/types/BusinessBpResponseDto';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { useEffect } from 'react';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bp/update-detail/$detailId');

const yupSchema = yup.object().shape({
  quantity: yup.number().typeError('Format invalide').integer('La quantité doit être un nombre entier').required('Le champs est requis'),
  colis: yup.string().typeError('Format invalide').nullable(),
  comment: yup.string().nullable(),
  productVersion: yup.mixed<ProductVersionResponseDto>().required('Champs requis'),
});

export default function AppViewBusinessViewBpViewUpdateDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId, detailId } = routeApi.useParams();

  const { data: bp } = useSuspenseQuery(queries['business-bps'].detail._ctx.byBusinessId(businessId));
  const { data: detail } = useSuspenseQuery(queries['business-bp-details'].detail._ctx.byId(detailId));
  const { data: productVersions, isLoading: isLoadingProductVersions } = useQuery(queries['product-versions'].list._ctx.byProductId(detail.productId!));

  const {
    register,
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ productVersion, colis, quantity, comment }: yup.InferType<typeof yupSchema>) =>
      updateBusinessBpDetail(detail.id, {
        bpId: bp.id,
        numDetails: detail.numDetails,
        productId: detail.productId,
        productVersionId: detail.productVersionId,
        productReference: detail.productReference,
        productVersionReference: productVersion.reference,
        packageNumber: colis,
        quantity: detail.quantity,
        quantityRemain: detail.quantityRemain,
        quantityPrep: quantity,
        productDesignation: detail.productDesignation,
        productDescription: detail.productDescription,
        productName: detail.productName,
        publicUnitPrice: detail.publicUnitPrice,
        comment: comment,
        unitPrice: detail.unitPrice,
        totalPrice: quantity * detail.unitPrice,
        virtualQty: detail.virtualQty,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData<BusinessBpResponseDto>(queries['business-bps'].detail._ctx.byBusinessId(businessId).queryKey, (old) =>
        old
          ? {
              ...old,
              bpDetailsList: old.bpDetailsList?.map((d) => (d.id === data.id ? data : d)),
            }
          : old,
      );
      queryClient.setQueryData(queries['business-bp-details'].detail._ctx.byId(detailId).queryKey, data);
      queryClient.invalidateQueries({ queryKey: queries['business-bps']._def });
      toast.success('Détail modifié avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification du détail');
    },
  });

  useEffect(() => {
    setValue('colis', detail.packageNumber);
    setValue('quantity', detail.quantityPrep ?? 0);
    setValue('comment', detail.comment);
  }, [detail.id]);

  useEffect(() => {
    const productVersion = productVersions?.find((v) => v.reference === detail.productVersionReference);
    if (productVersion) setValue('productVersion', productVersion);
  }, [isLoadingProductVersions]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Modifier le produit {detail.productReference}</h6>
        </div>
        <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
          <div className={styles.modal_content}>
            <div className={styles.form_group}>
              <label htmlFor="productVersion">Version du produit</label>
              <Controller
                control={control}
                name="productVersion"
                render={({ field: { value, onChange } }) => (
                  <CustomSelect
                    id="productVersion"
                    placeholder="Sélectionnez une version"
                    options={productVersions}
                    isLoading={isLoadingProductVersions}
                    getOptionLabel={(opt) => opt.reference ?? ''}
                    getOptionValue={(opt) => opt.id}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <p className={styles.__errors}>{errors.productVersion?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="quantity">Quantité préparée</label>
              <input id="quantity" type="number" autoComplete="on" min={0} {...register('quantity')} />
              <p className={styles.__errors}>{errors.quantity?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="colis">Colis</label>
              <input id="colis" type="text" {...register('colis')} />
              <p
                style={{
                  textAlign: 'left',
                  fontSize: '11px',
                  lineHeight: '10px',
                  color: 'var(--secondary-color)',
                  opacity: 1,
                }}
              >
                Veuillez séparer les colis par une virgule (Ex: 1,2) pour plusieurs colis.
              </p>
              <p className={styles.__errors}>{errors.colis?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="comment">Commentaire</label>
              <input id="comment" {...register('comment')} type="text" autoComplete="on" />
              <p className={styles.__errors}>{errors.comment?.message}</p>
            </div>
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
    </ReactModal>
  );
}
