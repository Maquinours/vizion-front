import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteBusinessBpSerial } from '../../../../../../../../utils/api/businessBpSerials';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import SerialNumberOperationType from '../../../../../../../../utils/enums/SerialNumberOperationType';
import styles from './DeleteSerialModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bp/delete-serial/$serialId');

export default function AppViewBusinessViewBpViewDeleteSerialModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId, serialId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: bp } = useSuspenseQuery(queries['business-bps'].detail._ctx.byBusinessId(businessId));
  const { data: serialNumber } = useSuspenseQuery(queries['business-bp-serials'].detail._ctx.byId(serialId));

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      deleteBusinessBpSerial({
        productId: serialNumber.productId,
        productVersionId: serialNumber.productVersionId,
        bpId: bp.id,
        bpDetailId: bp.bpDetailsList.find((detail) => detail.bpSerialList?.some((serial) => serial.id === serialNumber.id))?.id,
        buninessNumber: business.numBusiness,
        productReference: serialNumber.productReference,
        productVersionReference: serialNumber.productVersionReference,
        numBP: serialNumber.numBP,
        numSerie: serialNumber.numSerie,
        type: SerialNumberOperationType.STOCK,
        shelfId: serialNumber.shelfId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-bps']._def });
      queryClient.removeQueries({ queryKey: queries['business-bp-serials'].detail._ctx.byId(serialId).queryKey, exact: true });
      toast.success('Numéro de série supprimé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du numéro de série');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>supprimer</span> ce numéro de série{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{serialNumber.numSerie}</span> ?
          </h6>
        </div>
        <form onSubmit={onSubmit} onReset={onClose}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer le numéro de série définitivement.</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button type="reset" className="btn btn-primary-light">
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              Supprimer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
