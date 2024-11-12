import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteBusinessBpSerial } from '../../../../../../../../utils/api/businessBpSerials';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import SerialNumberOperationType from '../../../../../../../../utils/enums/SerialNumberOperationType';
import styles from './RemoveFromBusinessModal.module.scss';

const routeApi = getRouteApi('/app/products/serial-numbers/remove-from-business/$serialNumberId');

export default function AppViewProductsViewSerialNumbersModalViewRemoveFromBusinessModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { serialNumber, business, bp, bpDetail, bpSerialNumber } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      deleteBusinessBpSerial({
        productId: serialNumber.productId,
        productVersionId: serialNumber.productVersionId,
        bpId: bp.id,
        bpDetailId: bpDetail.id,
        buninessNumber: business.numBusiness,
        productReference: bpSerialNumber.productReference,
        productVersionReference: bpSerialNumber.productVersionReference,
        numBP: bpSerialNumber.numBP,
        numSerie: bpSerialNumber.numSerie,
        type: SerialNumberOperationType.STOCK,
        shelfId: bpSerialNumber.shelfId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['product-serial-numbers']._def });
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
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>retirer</span> le numéro de série{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{serialNumber.serialNumber}</span> de l&apos;affaire{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{business.numBusiness}</span> ?
          </h6>
        </div>
        <form onSubmit={onSubmit} onReset={onClose}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va définitivement retirer le numéro de série de l&apos;affaire.</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button type="reset" className="btn btn-primary-light">
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
