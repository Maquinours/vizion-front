import { useMutation, useQueryClient } from '@tanstack/react-query';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { updateBusinessBpDetail } from '../../../../../../utils/api/businessBpDetails';
import { createRmaFromBusiness } from '../../../../../../utils/api/rma';
import { queries } from '../../../../../../utils/constants/queryKeys';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';
import BusinessBpResponseDto from '../../../../../../utils/types/BusinessBpResponseDto';
import BusinessBpSerialResponseDto from '../../../../../../utils/types/BusinessBpSerialResponseDto';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import styles from './CreateSerialRmaModal.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bp/create-serial-rma/$serialId');

type BusinessModalComponentBpComponentCreateSerialRmaModalComponentProps = Readonly<{
  business: BusinessResponseDto;
  bp: BusinessBpResponseDto;
  serialNumber: BusinessBpSerialResponseDto;
  onClose: () => void;
}>;
export default function BusinessModalComponentBpComponentCreateSerialRmaModalComponent({
  business,
  bp,
  serialNumber,
  onClose,
}: BusinessModalComponentBpComponentCreateSerialRmaModalComponentProps) {
  const queryClient = useQueryClient();
  //   const navigate = routeApi.useNavigate();

  //   const { businessId, serialId } = routeApi.useParams();

  //   const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  //   const { data: bp } = useSuspenseQuery(queries['business-bps'].detail._ctx.byBusinessId(businessId));
  //   const { data: serialNumber } = useSuspenseQuery(queries['business-bp-serials'].detail._ctx.byId(serialId));

  //   const onClose = () => {
  //     navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  //   };

  const { mutate: mutateDetailComment } = useMutation({
    mutationFn: (comment: string) => {
      const detail = bp.bpDetailsList?.find((d) => d.bpSerialList?.findIndex((s) => s.id == serialNumber.id) !== -1)!;
      return updateBusinessBpDetail(detail.id, {
        bpId: bp.id,
        numDetails: detail.numDetails,
        productId: detail.productId,
        productVersionId: detail.productVersionId,
        productReference: detail.productReference,
        productVersionReference: detail.productVersionReference,
        packageNumber: detail.packageNumber,
        quantity: detail.quantity,
        quantityRemain: detail.quantityRemain,
        quantityPrep: detail.quantityPrep,
        productDesignation: detail.productDesignation,
        productDescription: detail.productDescription,
        productName: detail.productName,
        publicUnitPrice: detail.publicUnitPrice,
        comment: comment,
        unitPrice: detail.unitPrice,
        virtualQty: detail.virtualQty,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData<BusinessBpResponseDto>(queries['business-bps'].detail._ctx.byBusinessId(business.id).queryKey, (old) =>
        old
          ? {
              ...old,
              bpDetailsList: old.bpDetailsList?.map((d) => (d.id === data.id ? data : d)),
            }
          : old,
      );
      queryClient.setQueryData(queries['business-bp-details'].detail._ctx.byId(data.id).queryKey, data);
      queryClient.invalidateQueries({ queryKey: queries['business-bps']._def });
      toast.success('Détail modifié avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification du détail');
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => createRmaFromBusiness(CategoryBusiness.AFFAIRE, business.numBusiness, [serialNumber.numSerie]),
    onSuccess: (rma) => {
      queryClient.invalidateQueries({ queryKey: queries.rmas._def });
      try {
        const detail = bp.bpDetailsList?.find((d) => d.bpSerialList?.findIndex((s) => s.id == serialNumber.id) !== -1)!;
        const comment = `${detail.comment}\n${rma.number}`.trim();
        mutateDetailComment(comment);
      } finally {
        toast.success('Le RMA a été généré avec succès');
        // navigate({ to: '/app/businesses-rma/rma/$rmaId', params: { rmaId: rma.id } }); // TODO: go to rma modal
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la génération du RMA');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal
      isOpen={true}
      overlayClassName="Overlay"
      className={styles.modal}
      shouldCloseOnOverlayClick={!isPending}
      shouldCloseOnEsc={!isPending}
      onRequestClose={onClose}
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>générer</span> un RMA pour la{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}> {serialNumber.productReference} </span> de numéro de série{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}> {serialNumber.numSerie} </span> ?
          </h6>
        </div>
        <form onSubmit={onSubmit} onReset={onClose}>
          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button type="reset" className="btn btn-primary-light">
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              Générer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
