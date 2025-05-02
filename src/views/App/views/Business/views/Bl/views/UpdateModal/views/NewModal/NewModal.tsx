import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CustomSelect from '../../../../../../../../../../components/CustomSelect/CustomSelect';
import { createBusinessBlDetail } from '../../../../../../../../../../utils/api/businessBlDetails';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import BusinessBpDetailsResponseDto from '../../../../../../../../../../utils/types/BusinessBpDetailsResponseDto';
import styles from './NewModal.module.scss';

const yupSchema = yup.object().shape({
  bpDetail: yup.mixed<BusinessBpDetailsResponseDto>().required('Champs requis'),
});

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bl/update/new');

export default function AppViewBusinessViewBlViewUpdateModalViewNewModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { businessId } = routeApi.useParams();
  const { page } = routeApi.useSearch();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: businessBl } = useSuspenseQuery({
    ...queries['business-bls'].list._ctx.byBusinessId(businessId),
    select: (data) => data.at(page),
  });

  const { data: businessBp, isLoading: isLoadingBusinessBp } = useQuery({ ...queries['business-bps'].detail._ctx.byBusinessId(businessId) });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ bpDetail }: yup.InferType<typeof yupSchema>) => {
      if (!businessBl) throw new Error('Impossible de trouver le bon de livraison');
      return createBusinessBlDetail({
        blId: businessBl.id,
        numDetails: business.numBusiness,
        numBusiness: business.numBusiness,
        productId: bpDetail.productId,
        productVersionId: (bpDetail.bpSerialList ?? []).length > 0 ? bpDetail.bpSerialList![0].productVersionId : null,
        bpDetailId: bpDetail.id,
        productReference: bpDetail.productReference,
        productVersionReference: bpDetail.productVersionReference,
        quantityDelivered: (bpDetail.quantityDelivered ?? 0) > 0 ? Number(bpDetail.quantityPrep) - Number(bpDetail.quantityDelivered) : bpDetail.quantityPrep,
        quantityOrdered: bpDetail.quantity,
        productDesignation: bpDetail.productDesignation,
        productDescription: bpDetail.productDescription,
        productName: bpDetail.productName,
        publicUnitPrice: bpDetail.publicUnitPrice,
        unitPrice: bpDetail.unitPrice,
        comment: bpDetail.comment,
        packageNumber: bpDetail.packageNumber,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-bls'].list._ctx.byBusinessId(businessId).queryKey });
      toast.success('Le produit a bien été ajouté');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout du produit");
    },
  });

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return (
    <ReactModal isOpen onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.modal_title}>
          <h6>Ajouter un contact</h6>
        </div>
        <form className={styles.form} onSubmit={handleSubmit((data) => mutate(data))} onReset={() => onClose()} autoComplete="off" autoCorrect="off">
          <div className={styles.form_container}>
            <div className={styles.form__group}>
              <label htmlFor="detailSelect">Produit :</label>
              <Controller
                control={control}
                name="bpDetail"
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    id="detailSelect"
                    options={businessBp?.bpDetailsList}
                    isLoading={isLoadingBusinessBp}
                    getOptionLabel={(opt) => opt.productReference ?? ''}
                    getOptionValue={(opt) => opt.id}
                    value={value}
                    onChange={onChange}
                    placeholder="Sélectionnez un produit"
                  />
                )}
              />
            </div>
          </div>
          <div className={styles.modal_buttons}>
            <button type="reset" className="btn btn-primary-light">
              Annuler
            </button>
            <button className="btn btn-secondary" type="submit" disabled={isPending}>
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
