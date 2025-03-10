import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import React from 'react';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteBusinessSubQuotation } from '../../../../../../../../utils/api/businessSubQuotations';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './DeleteSubquotationModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/quotation/delete-subquotation/$subquotationId');

export default function AppViewBusinessViewQuotationViewDeleteSubquotationModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { businessId, subquotationId } = routeApi.useParams();

  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: subQuotation } = useSuspenseQuery(queries['business-sub-quotations'].detail._ctx.byId(subquotationId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const totalAmountHT =
        quotation.subQuotationList
          ?.filter((sub) => sub.id !== subQuotation!.id)
          .reduce((acc, sub) => acc + (sub.quotationDetails?.reduce((acc, detail) => acc + (detail.totalPrice ?? 0), 0) ?? 0), 0) ?? 0;
      const shippingServicePrice = totalAmountHT < 1200 ? quotation.shippingServicePrice : 0;
      const total = totalAmountHT + shippingServicePrice;
      const vat = business.exportTva ? total * 0.2 : 0;
      const totalAmount = total + vat;
      return deleteBusinessSubQuotation(subQuotation.id, {
        totalAmountHT,
        shippingServicePrice,
        totalAmount,
        quoteId: quotation.id,
        subQuoteId: subQuotation!.id,
        vat,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-quotations']._def });
      toast.success('Sous devis supprimé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la suppression du sous devis');
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
            Êtes-vous certain.e de vouloir <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>supprimer</span> le sous devis ?
          </h6>
        </div>
        <form onSubmit={onSubmit} onReset={onClose}>
          <div className={styles.modal_content}>
            <p>Cette action irréversible va supprimer le sous devis définitivement.</p>
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" type="reset">
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
