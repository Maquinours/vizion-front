import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { updateProduct } from '../../../../../../utils/api/product';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { enterprises } from '../../../../../../utils/constants/queryKeys/enterprise';
import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';
import styles from './UpdateModal.module.scss';
import AppViewProductViewUpdateModalComponentStepOneComponent from './components/StepOne/StepOne';
import AppViewProductViewUpdateModalComponentStepTwoComponent from './components/StepTwo/StepTwo';
import { useNavigate } from '@tanstack/react-router';

const routeApi = getRouteApi('/app/products/$productId');

const stepOneYupSchema = yup.object({
  reference: yup.string().required('La référence est requise.'),
  shortDescription: yup.string().required('La description est requise.'),
  longDescription: yup.string().nullable(),
  provider: yup.mixed<EnterpriseResponseDto>().required('Le fournisseur est requis'),
  category: yup.string().required('La catégorie est requise'),
  isVizeo: yup.mixed<'yes' | 'no'>().required('Champs requis').defined(),
  isVirtual: yup.mixed<'yes' | 'no'>().required('Champs requis').defined(),
  isNomenclature: yup.mixed<'yes' | 'no'>().required('Champs requis').defined(),
});

const stepTwoYupSchema = yup.object({
  purchasePrice: yup.number().nullable(),
  costPrice: yup.number().required('Le prix de reviens est requis.').min(0, 'Min 0'),
  margin: yup.number().min(0, 'Min 0').max(100, 'Max 100').required('La marge est requise'),
  portOrService: yup.number().nullable(),
  tax: yup.number().nullable(),
  price: yup.number().min(1, 'Min 1').required('Le prix est requis.'),
  ecoTax: yup.number().nullable(),
  assistanceHour: yup.number().nullable(),
});

export type UpdateProductStepOneSchema = yup.InferType<typeof stepOneYupSchema>;
export type UpdateProductStepTwoSchema = yup.InferType<typeof stepTwoYupSchema>;

export default function AppViewProductViewUpdateModalComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [step, setStep] = useState<0 | 1>(0);

  const { productId } = routeApi.useParams();

  const { data: product } = useSuspenseQuery(queries.product.detail(productId));

  const {
    register: stepOneRegister,
    control: stepOneControl,
    watch: stepOneWatch,
    formState: { errors: stepOneErrors },
    setValue: stepOneSetValue,
    handleSubmit: stepOneHandleSubmit,
  } = useForm({
    resolver: yupResolver(stepOneYupSchema),
  });

  const {
    formState: { errors: stepTwoErrors },
    watch: stepTwoWatch,
    setValue: stepTwoSetValue,
    getValues: stepTwoGetValues,
    resetField: stepTwoResetField,
    control: stepTwoControl,
    handleSubmit: stepTwoHandleSubmit,
  } = useForm({
    resolver: yupResolver(stepTwoYupSchema),
  });

  const onClose = () => {
    navigate({ to: '.', search: (old) => ({ ...old, productModal: undefined }), replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ stepOneData, stepTwoData }: { stepOneData: UpdateProductStepOneSchema; stepTwoData: UpdateProductStepTwoSchema }) => {
      if (!product) throw new Error('Product is undefined');
      return updateProduct(product.id, {
        name: stepOneData.reference,
        reference: stepOneData.reference,
        shortDescription: stepOneData.shortDescription,
        description: stepOneData.longDescription,
        providerId: stepOneData.provider.id,
        providerName: stepOneData.provider.name,
        purchasePriceUSD: stepTwoData.purchasePrice,
        purchasePriceEUR: stepTwoData.costPrice,
        shippingService: stepTwoData.portOrService,
        margin: stepTwoData.margin,
        customsTax: stepTwoData.tax,
        ecoTaxDEEE: stepTwoData.ecoTax,
        publicPrice: stepTwoData.price,
        productCategoryName: stepOneData.category,
        assistanceTime: Number(stepTwoData.assistanceHour) ?? null,
        vizeo: stepOneData.isVizeo === 'yes',
        virtualQty: stepOneData.isVirtual === 'yes',
        bom: stepOneData.isNomenclature === 'yes',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.product._def });
      toast.success('Produit mis à jour avec succès !');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la mise à jour du produit.');
    },
  });

  const onSubmitStepOne = stepOneHandleSubmit(() => {
    setStep(1);
  });

  const onSubmitStepTwo = stepTwoHandleSubmit((data: UpdateProductStepTwoSchema) => {
    mutate({
      stepOneData: stepOneWatch(),
      stepTwoData: data,
    });
  });

  useEffect(() => {
    if (product.reference) stepOneSetValue('reference', product.reference);
    stepOneSetValue('shortDescription', product.shortDescription);
    stepOneSetValue('longDescription', product.description);
    queryClient.ensureQueryData(enterprises.list._ctx.providers).then((data) => {
      const provider = data.find(({ id }) => product.providerId === id);
      if (provider) stepOneSetValue('provider', provider);
    });
    if (product.category) stepOneSetValue('category', product.category);
    stepOneSetValue('isVizeo', product.vizeo ? 'yes' : 'no');
    stepOneSetValue('isVirtual', product.virtualQty ? 'yes' : 'no');
    stepOneSetValue('isNomenclature', product.bom ? 'yes' : 'no');

    stepTwoSetValue('purchasePrice', product.purchasePriceUSD);
    if (product.purchasePriceEUR) stepTwoSetValue('costPrice', product.purchasePriceEUR);
    if (product.margin) stepTwoSetValue('margin', product.margin);
    stepTwoSetValue('portOrService', product.shippingService);
    stepTwoSetValue('tax', product.customsTax);
    if (product.publicPrice) stepTwoSetValue('price', product.publicPrice);
    stepTwoSetValue('ecoTax', product.ecoTaxDEEE);
    stepTwoSetValue('assistanceHour', product.assistanceTime);
  }, []);

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={onClose}
      className={styles.update_modal}
      overlayClassName="Overlay"
      shouldCloseOnEsc={!isPending}
      shouldCloseOnOverlayClick={!isPending}
    >
      {step === 0 ? (
        <AppViewProductViewUpdateModalComponentStepOneComponent
          product={product}
          register={stepOneRegister}
          control={stepOneControl}
          errors={stepOneErrors}
          onReset={onClose}
          onSubmit={onSubmitStepOne}
        />
      ) : (
        step === 1 && (
          <AppViewProductViewUpdateModalComponentStepTwoComponent
            product={product}
            errors={stepTwoErrors}
            watch={stepTwoWatch}
            setValue={stepTwoSetValue}
            getValues={stepTwoGetValues}
            resetField={stepTwoResetField}
            control={stepTwoControl}
            onReset={() => setStep(0)}
            onSubmit={onSubmitStepTwo}
            isPending={isPending}
          />
        )
      )}
    </ReactModal>
  );
}
