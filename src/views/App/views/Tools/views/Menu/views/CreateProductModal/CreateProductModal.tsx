import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import ReactModal from 'react-modal';
import { toast } from 'react-toastify';
import { createProduct } from '../../../../../../../../utils/api/product';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import AppViewToolsViewMenuViewCreateProductModalViewStepOneComponent, { CreateProductStepOneType } from './components/StepOne/StepOne';
import AppViewToolsViewMenuViewCreateProductModalViewStepTwoComponent, { CreateProductStepTwoType } from './components/StepTwo/StepTwo';
import styles from './CreateProductModal.module.scss';

const routeApi = getRouteApi('/app/tools/menu/create-product');

export default function AppViewToolsMenuViewCreateProductModalView() {
  const navigate = routeApi.useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<0 | 1>(0);
  const [stepOneData, setStepOneData] = useState<CreateProductStepOneType>();

  const onStepOneSubmit = (data: CreateProductStepOneType) => {
    setStepOneData(data);
    setStep(1);
  };

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateProductStepTwoType) =>
      createProduct({
        name: stepOneData!.reference,
        reference: stepOneData!.reference,
        shortDescription: stepOneData!.shortDescription,
        description: stepOneData!.longDescription,
        providerId: stepOneData!.provider.id,
        providerName: stepOneData!.provider.name,
        purchasePriceUSD: data.purchasePrice,
        purchasePriceEUR: data.costPrice,
        shippingService: data.shippingService,
        margin: data.margin,
        customsTax: data.tax,
        ecoTaxDEEE: data.ecoTax,
        publicPrice: data.price,
        productCategoryName: stepOneData!.category,
        assistanceTime: data.assistanceHour ? (data.assistanceHour === 'More' ? Number(data.assistanceHourMore) : Number(data.assistanceHour)) : null,
        vizeo: stepOneData!.isVizeo,
        virtualQty: stepOneData!.isVirtual,
        bom: stepOneData!.isNomenclature,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.product._def });
      toast.success('Produit créé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la création du produit');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <AppViewToolsViewMenuViewCreateProductModalViewStepOneComponent show={step === 0} onSubmit={onStepOneSubmit} />
        <AppViewToolsViewMenuViewCreateProductModalViewStepTwoComponent
          show={step === 1}
          goToPreviousStep={() => setStep(0)}
          onSubmit={(data) => mutate(data)}
          isPending={isPending}
        />
      </div>
    </ReactModal>
  );
}
