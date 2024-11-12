import ReactModal from 'react-modal';
import styles from './ValidateQuantitiesModal.module.scss';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import React, { useContext } from 'react';
import { ProductInventoryContext } from '../../utils/context/context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateShelvesInventory } from '../../../../../../../../utils/api/productShelf';
import { toast } from 'react-toastify';
import _ from 'lodash';
import StockOperationType from '../../../../../../../../utils/enums/StockOperationType';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { PulseLoader } from 'react-spinners';

const routeApi = getRouteApi('/app/tools/product-inventory/validate-quantities');

export default function AppViewToolsViewProductInventoryViewValidateQuantitiesModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { data } = useContext(ProductInventoryContext)!;

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateShelvesInventory({
        dtoList: Object.values(_.groupBy(data, (d) => d.stock.productVersionShelf?.id)).map((element) => ({
          number: element[0].stock.productVersionShelf?.number,
          updateNumber: element[0].stock.productVersionShelf?.number,
          note: element[0].stock.productVersionShelf?.note,
          versionShelfStockDtoList: element.map((item) => ({
            productVersionId: item.stock.productVersionId,
            productVersionShelfId: item.stock.productVersionShelf?.id,
            productId: item.stock.productId,
            providerId: item.stock.providerId,
            providerName: item.stock.providerName,
            reference: item.stock.reference,
            versionReference: item.stock.versionReference,
            shortDescription: item.stock.shortDescription,
            category: item.stock.category,
            publicPrice: item.stock.publicPrice,
            currentStock: item.comptedStock,
            productVersionShelfStockEntryDto: {
              currentStock: item.comptedStock,
              operationType: StockOperationType.INVENTAIRE,
            },
          })),
        })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['product-shelves']._def });
      queryClient.invalidateQueries({ queryKey: queries['product-version-shelf-stocks']._def });
      toast.success('Les quantités ont été mises à jour avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la mise à jour des étagères');
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
          <h6>Inventaire</h6>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.form_content}>
            <p>Vous êtes sur le point de valider les quantités comptées actuelles.</p>
            <p>Voulez-vous continuer ?</p>
          </div>

          <div className={styles.loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.buttons_container}>
            <button className="btn btn-primary-light" disabled={isPending} onClick={onClose}>
              Annuler
            </button>
            <button type="submit" disabled={isPending} className="btn btn-secondary">
              Mise à jour
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
