import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './DeleteDetailModal.module.scss';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { PulseLoader } from 'react-spinners';
import { deleteBusinessQuotationDetail } from '../../../../../../../../utils/api/businessQuotationDetails';
import { toast } from 'react-toastify';
import React from 'react';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation/delete-detail/$detailId');

export default function AppViewBusinessViewQuotationViewDeleteDetailModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId, detailId } = routeApi.useParams();

  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));
  const { data: detail } = useSuspenseQuery(queries['business-quotation-details'].detail._ctx.byId(detailId));

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const totalAmountHT = quotation!.totalAmountHT! - detail!.totalPrice!;
      const shippingServicePrice = totalAmountHT < 1200 ? quotation!.shippingServicePrice : 0;

      return deleteBusinessQuotationDetail(detail.id, {
        quoteId: quotation!.id,
        subQuoteId: quotation.subQuotationList!.find((sub) => sub.quotationDetails?.some((d) => d.id === detail.id))!.id,
        totalAmountHT,
        shippingServicePrice,
        totalAmount: (totalAmountHT + shippingServicePrice) * 0.2,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-quotations']._def });
      toast.success('Détail supprimé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du détail');
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
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>supprimer</span> le produit{' '}
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{detail.productReference}</span>{' '}
            {detail.groupName !== 'Default' && (
              <span>
                dans le sous devis{' '}
                <span
                  style={{
                    color: 'var(--secondary-color)',
                    fontWeight: 'bold',
                  }}
                >
                  {detail.groupName}
                </span>
              </span>
            )}{' '}
            ?
          </h6>
        </div>
        <form onSubmit={onSubmit} onReset={onClose}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer le produit définitivement.</p>
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
