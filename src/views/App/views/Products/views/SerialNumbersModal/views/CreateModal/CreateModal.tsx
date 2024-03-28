import { useState } from 'react';
import AppViewProductsViewSerialNumbersModalViewCreateModalViewFormSectionComponent from './components/FormSection/FormSection';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProductSerialNumbers } from '../../../../../../../../utils/api/productSerialNumber';
import ProductSerialListRequestDto from '../../../../../../../../utils/types/ProductSerialListRequestDto';
import AppViewProductsViewSerialNumbersModalViewCreateModalViewTableComponent from './components/Table/Table';
import styles from './CreateModal.module.scss';
import ReactModal from 'react-modal';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { toast } from 'react-toastify';
import { productSerialNumberQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productSerialNumber';

const routeApi = getRouteApi('/app/products/serial-numbers/create');

export default function AppViewProductsViewSerialNumbersModalViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [requestData, setRequestData] = useState<ProductSerialListRequestDto>();

  const onClose = () => {
    navigate({ from: routeApi.id, to: '..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => createProductSerialNumbers(requestData!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productSerialNumberQueryKeys.all });
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
