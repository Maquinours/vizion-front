import { Controller, useForm } from 'react-hook-form';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import styles from './AddLineSection.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomSelect from '../../../../../../../../../../../../components/CustomSelect/CustomSelect';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../../../utils/constants/queryKeys';
import { createBusinessQuotationDetail } from '../../../../../../../../../../../../utils/api/businessQuotationDetails';
import { getRouteApi } from '@tanstack/react-router';
import { createBusinessSubQuotation } from '../../../../../../../../../../../../utils/api/businessSubQuotations';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/quotation');

enum DataType {
  SUBQUOTATION = 'SUBQUOTATION',
  DETAIL = 'DETAIL',
}

const yupSchema = yup.object({
  dataType: yup.mixed<DataType>().required('Le type de donnée est requis'),
  detailProduct: yup
    .mixed<ProductResponseDto>()
    .nullable()
    .defined()
    .when('dataType', {
      is: DataType.DETAIL,
      then: () => yup.mixed<ProductResponseDto>().required('Champs requis !!'),
    }),
  subQuotationName: yup.string().when('dataType', {
    is: DataType.SUBQUOTATION,
    then: () => yup.string().required('Requis !'),
  }),
  detailQuantity: yup
    .number()
    .nullable()
    .when('dataType', {
      is: DataType.DETAIL,
      then: () => yup.number().typeError('Invalide').required('Requis !'),
    }),
});

export default function AppViewBusinessViewQuotationViewHeaderComponentSectionThreeComponentAddLineSectionComponent() {
  const queryClient = useQueryClient();

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));

  const { data: products, isLoading: isLoadingProducts } = useQuery(queries.product.list);

  const {
    register,
    control,
    formState: { errors },
    watch,
    reset,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      dataType: DataType.DETAIL,
      detailQuantity: 1,
      detailProduct: null,
    },
  });

  const dataType = watch('dataType');

  const { mutate } = useMutation({
    mutationFn: async ({ dataType, detailProduct, subQuotationName, detailQuantity }: yup.InferType<typeof yupSchema>) => {
      switch (dataType) {
        case DataType.DETAIL: {
          const unitPrice = detailProduct!.publicPrice ? detailProduct!.publicPrice * (1 - (business.reduction ?? 0) / 100) : 0;
          const totalPrice = detailQuantity! * unitPrice;
          const totalAmountHT = (quotation!.totalAmountHT ?? 0) + totalPrice;
          const shippingServicePrice = totalAmountHT < 1200 ? quotation!.shippingServicePrice : 0;

          let lastElement = quotation!.subQuotationList?.at(-1);
          if (!lastElement)
            lastElement = await createBusinessSubQuotation({
              name: 'Default',
              quotationId: quotation!.id,
            });

          return createBusinessQuotationDetail({
            groupName: lastElement.name,
            subQuoteId: lastElement.id,
            quoteId: quotation!.id,
            numDetails: quotation!.number,
            productId: detailProduct!.id,
            productReference: detailProduct!.reference ?? '',
            quantity: detailQuantity!,
            productDesignation: detailProduct!.shortDescription,
            productDescription: detailProduct!.description ?? detailProduct!.shortDescription,
            productName: detailProduct!.reference,
            publicUnitPrice: detailProduct!.publicPrice ?? 0,
            virtualQty: detailProduct!.virtualQty,
            bom: detailProduct!.bom,
            unitPrice,
            reduction: business.reduction,
            totalPrice,
            taxDEEE: 0,
            totalAmountHT,
            totalAmount: (totalAmountHT + shippingServicePrice) * 1.2,
            shippingServicePrice,
          });
        }
        case DataType.SUBQUOTATION: {
          return createBusinessSubQuotation({ name: subQuotationName, quotationId: quotation!.id });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-quotations']._def });
      reset();
      toast.success('Ligne ajoutée au devis avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout de la ligne au devis");
    },
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit((data) => mutate(data))} autoComplete="off">
      <div className={styles.form_group}>
        <div className={styles.form_group_radio}>
          <div className={styles.form__radio}>
            <input type="radio" {...register('dataType')} id="reference" value={DataType.DETAIL} />
            <label htmlFor="reference">Référence</label>
          </div>
          <div className={styles.form__radio}>
            <input type="radio" {...register('dataType')} id="texte" value={DataType.SUBQUOTATION} />
            <label className="label" htmlFor="texte">
              Texte
            </label>
          </div>
        </div>
        {dataType === DataType.SUBQUOTATION ? (
          <>
            <input id="subQuoteDefaultText" {...register('subQuotationName')} />
            <p className={styles.__errors}>{errors.subQuotationName?.message}</p>
          </>
        ) : (
          dataType === DataType.DETAIL && (
            <>
              <Controller
                control={control}
                name="detailProduct"
                render={({ field: { value, onChange } }) => (
                  <CustomSelect
                    value={value}
                    onChange={onChange}
                    placeholder="Sélectionnez un produit"
                    options={products}
                    isLoading={isLoadingProducts}
                    getOptionLabel={(product) => product.reference ?? ''}
                    getOptionValue={(product) => product.id}
                  />
                )}
              />
              <p className={styles.__errors}>{errors.detailProduct?.message}</p>
            </>
          )
        )}
      </div>
      <div className={styles.form_group}>
        <label htmlFor="productQuantity">Quantité</label>
        <input id="productQuantity" type="number" disabled={dataType !== DataType.DETAIL} {...register('detailQuantity')} />
        <p className={styles.__errors}>{errors.detailQuantity?.message}</p>
      </div>
      <button className="btn btn-primary" type="submit">
        Valider
      </button>
    </form>
  );
}
