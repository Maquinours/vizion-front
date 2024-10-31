import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import ReactModal from 'react-modal';
import { toast } from 'react-toastify';
import { createProductSerialNumbers } from '../../../../../../../../utils/api/productSerialNumber';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import ProductSerialListRequestDto from '../../../../../../../../utils/types/ProductSerialListRequestDto';
import styles from './CreateModal.module.scss';
import AppViewProductsViewSerialNumbersModalViewCreateModalViewFormSectionComponent from './components/FormSection/FormSection';
import AppViewProductsViewSerialNumbersModalViewCreateModalViewTableComponent from './components/Table/Table';

const routeApi = getRouteApi('/app/products/serial-numbers/create');

export default function AppViewProductsViewSerialNumbersModalViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const [requestData, setRequestData] = useState<ProductSerialListRequestDto>();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => createProductSerialNumbers(requestData!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['product-serial-numbers']._def });
      toast.success('Les numéros de série ont été ajoutés avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout des numéros de série");
    },
  });

  return (
    <ReactModal
      isOpen={true}
      overlayClassName="Overlay"
      className={styles.modal}
      shouldCloseOnOverlayClick={!isPending}
      shouldCloseOnEsc={!isPending}
      onRequestClose={onClose}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <AppViewProductsViewSerialNumbersModalViewCreateModalViewFormSectionComponent setRequestData={setRequestData} isPending={isPending} />
          <AppViewProductsViewSerialNumbersModalViewCreateModalViewTableComponent
            requestData={requestData}
            setRequestData={setRequestData}
            isPending={isPending}
            mutate={mutate}
          />
        </div>
      </div>
    </ReactModal>
  );
}
