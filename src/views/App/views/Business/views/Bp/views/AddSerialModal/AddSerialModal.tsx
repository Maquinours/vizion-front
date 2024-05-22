import ReactModal from 'react-modal';
import styles from './AddSerialModal.module.scss';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import * as yup from 'yup';
import ProductVersionResponseDto from '../../../../../../../../utils/types/ProductVersionResponseDto';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { useEffect } from 'react';
import { createBpSerial } from '../../../../../../../../utils/api/businessBpSerials';
import SerialNumberOperationType from '../../../../../../../../utils/enums/SerialNumberOperationType';
import BusinessBpResponseDto from '../../../../../../../../utils/types/BusinessBpResponseDto';
import BusinessBpDetailsResponseDto from '../../../../../../../../utils/types/BusinessBpDetailsResponseDto';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bp/add-serial/$detailId');

const yupSchema = yup.object().shape({
  productVersion: yup.mixed<ProductVersionResponseDto>().required('Champs requis'),
  serialNumber: yup.string().required('Champs requis'),
});

export default function AppViewBusinessViewBpViewAddSerialModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId, detailId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: bp } = useSuspenseQuery(queries['business-bps'].detail._ctx.byBusinessId(businessId));
  const { data: detail } = useSuspenseQuery(queries['business-bp-details'].detail._ctx.byId(detailId));
  const { data: productVersions, isLoading: isLoadingProductVersions } = useQuery(queries['product-versions'].list._ctx.byProductId(detail.productId!));

  const {
    register,
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ productVersion, serialNumber }: yup.InferType<typeof yupSchema>) =>
      createBpSerial({
        productId: detail.productId,
        bpId: bp.id,
        bpDetailId: detail.id,
        buninessNumber: business.numBusiness,
        productReference: detail.productReference,
        productVersionReference: productVersion.reference,
        numBP: bp.number,
        numSerie: serialNumber,
        type: SerialNumberOperationType.DESTOCK,
        shelfId: null,
        extern: true,
      }),
    onSuccess: (data) => {
      const newDetail = { ...detail, bpSerialList: [...(detail.bpSerialList ?? []), data] };
      queryClient.setQueryData<BusinessBpResponseDto>(queries['business-bps'].detail._ctx.byBusinessId(detailId).queryKey, (old) =>
        old
          ? {
              ...old,
              bpDetailsList: old.bpDetailsList.map((d) => (d.id === detail.id ? newDetail : d)),
            }
          : old,
      );
      queryClient.setQueryData<BusinessBpDetailsResponseDto>(queries['business-bp-details'].detail._ctx.byId(detailId).queryKey, newDetail);
      queryClient.invalidateQueries({ queryKey: queries['business-bps']._def });
      queryClient.invalidateQueries({ queryKey: queries['business-bp-details']._def });
      toast.success('Numéro de série ajouté avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout du numéro de série");
    },
  });

  useEffect(() => {
    if (productVersions && productVersions.length > 0) setValue('productVersion', productVersions.at(-1)!);
  }, [isLoadingProductVersions]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Ajouter un numéro de série externe</h6>
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
              <label htmlFor="serialNumber">Saisir numéro de série</label>
              <input id="serialNumber" {...register('serialNumber')} />
              <p className={styles.__errors}>{errors.serialNumber?.message}</p>
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
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
