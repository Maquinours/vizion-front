import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import CardComponent from '../../../../../../../../../../components/Card/Card';
import CustomSelect from '../../../../../../../../../../components/CustomSelect/CustomSelect';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import ProductSerialListRequestDto from '../../../../../../../../../../utils/types/ProductSerialListRequestDto';
import ProductShelfResponseDto from '../../../../../../../../../../utils/types/ProductShelfResponseDto';
import ProductVersionResponseDto from '../../../../../../../../../../utils/types/ProductVersionResponseDto';
import styles from './FormSection.module.scss';

enum DataType {
  LIST = 'LISTE',
  UNIQUE = 'UNIQUE',
}

const yupSchema = yup.object({
  dataType: yup.mixed<DataType>().required('Champs requis'),
  productVersion: yup.mixed<ProductVersionResponseDto>().required('Champs requis'),
  numberRangeStart: yup
    .string()
    .nullable()
    .when('dataType', {
      is: DataType.LIST,
      then: () => yup.string().required('Champs requis !'),
    }),
  numberRangeEnd: yup
    .string()
    .nullable()
    .when('dataType', {
      is: DataType.LIST,
      then: () => yup.string().required('Champs requis !'),
    }),
  serialNumber: yup
    .string()
    .nullable()
    .when('dataType', {
      is: DataType.UNIQUE,
      then: () =>
        yup
          .string()
          .required('Champs requis !')
          .transform((value) => value.toUpperCase()),
    }),
  shelf: yup
    .mixed<ProductShelfResponseDto>()
    .nullable()
    .when('dataType', {
      is: DataType.UNIQUE,
      then: () => yup.object().required('Champs requis !'),
    }),
});

export type CreateSerialNumberFormValues = yup.InferType<typeof yupSchema>;

type AppViewProductsViewSerialNumbersModalViewCreateModalViewFormSectionComponentProps = Readonly<{
  isPending: boolean;
  setRequestData: React.Dispatch<React.SetStateAction<ProductSerialListRequestDto | undefined>>;
}>;
export default function AppViewProductsViewSerialNumbersModalViewCreateModalViewFormSectionComponent({
  isPending,
  setRequestData,
}: AppViewProductsViewSerialNumbersModalViewCreateModalViewFormSectionComponentProps) {
  const { data: products, isLoading: isLoadingProducts } = useQuery(queries['product-versions'].list._ctx.all);

  const { data: shelves, isLoading: isLoadingShelves } = useQuery(queries['product-shelves'].list);

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      dataType: DataType.LIST,
    },
  });

  const dataType = useWatch({ control, name: 'dataType' });

  const onSubmit = (data: yup.InferType<typeof yupSchema>) => {
    if (dataType === DataType.LIST) {
      const { prefix, startNumber, endNumber } = (() => {
        let prefix = '';
        let i = 0;
        for (i = 0; i < data.numberRangeStart!.length; i++) {
          if (data.numberRangeStart!.at(i) !== data.numberRangeEnd!.at(i)) break;
          prefix += data.numberRangeStart!.at(i);
        }
        return { prefix, startNumber: Number(data.numberRangeStart!.slice(i)), endNumber: Number(data.numberRangeEnd!.slice(i)) };
      })();

      const list: Array<string> = [];

      for (let i = startNumber; i <= endNumber; i++) list.push(prefix + '0'.repeat(endNumber.toString().length - startNumber.toString().length) + i.toString());
      setRequestData({
        productId: data.productVersion.product!.id,
        productRef: data.productVersion.product!.reference,
        productVersionRef: data.productVersion.reference,
        serialNumberDtoList: list.map((serialNumber) => ({
          serialNumber,
          productVersionId: data.productVersion.id,
          productVersionRef: data.productVersion.reference,
        })),
      });
    } else if (dataType === DataType.UNIQUE) {
      setRequestData({
        productId: data.productVersion.product!.id,
        productRef: data.productVersion.product!.reference,
        productVersionRef: data.productVersion.reference,
        serialNumberDtoList: [
          {
            serialNumber: data.serialNumber,
            productVersionId: data.productVersion.id,
            productVersionRef: data.productVersion.reference,
          },
        ],
        productShelfNum: data.shelf!.number,
        productShelfId: data.shelf!.id,
      });
    }
  };

  return (
    <div className={styles.card_container}>
      <CardComponent title="Importer un numéro de série">
        <div className={styles.card_content}>
          <form onSubmit={handleSubmit(onSubmit)} onReset={() => reset()}>
            <div className={styles.form_group}>
              <div className={styles.form_group_radio}>
                <div className={styles.form__radio}>
                  <input type="radio" {...register('dataType')} id="liste" value="LISTE" />
                  <label htmlFor="liste">Liste</label>
                </div>
                <div className={styles.form__radio}>
                  <input type="radio" {...register('dataType')} id="unique" value="UNIQUE" />
                  <label htmlFor="unique">Unique</label>
                </div>
              </div>
            </div>
            <div className={styles.form_group}>
              <label className={styles.label} htmlFor="productReference">
                Référence :
              </label>
              <div className={styles.react_select_custom}>
                <Controller
                  control={control}
                  name="productVersion"
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      options={products}
                      isLoading={isLoadingProducts}
                      getOptionLabel={(opt) => opt.reference ?? ''}
                      getOptionValue={(opt) => opt.id}
                      placeholder="Sélectionnez un produit"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
              <p className={styles.__errors}>{errors.productVersion?.message}</p>
            </div>
            {dataType === DataType.UNIQUE && (
              <div className={styles.form_group}>
                <label className={styles.label} htmlFor="productShelf">
                  Etagère :
                </label>
                <div className={styles.react_select_custom}>
                  <Controller
                    control={control}
                    name="shelf"
                    render={({ field: { onChange, value } }) => (
                      <CustomSelect
                        options={shelves}
                        isLoading={isLoadingShelves}
                        getOptionLabel={(opt) => opt.number ?? ''}
                        getOptionValue={(opt) => opt.id}
                        placeholder="Sélectionnez une étagère"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
                <p className={styles.__errors}>{errors.shelf?.message}</p>
              </div>
            )}
            {dataType === DataType.LIST && (
              <>
                <div className={styles.form_group}>
                  <label className={styles.label} htmlFor="numberRangeBegin">
                    Numéro de série de début :
                  </label>
                  <input placeholder="..." type="text" {...register('numberRangeStart')} />
                  <p className={styles.__errors}>{errors.numberRangeStart?.message}</p>
                </div>
                <div className={styles.form_group}>
                  <label className={styles.label} htmlFor="numberRangeEnd">
                    Numéro de série de fin :
                  </label>
                  <input placeholder="..." type="text" {...register('numberRangeEnd')} />
                  <p className={styles.__errors}>{errors.numberRangeEnd?.message}</p>
                </div>
              </>
            )}
            {dataType === DataType.UNIQUE && (
              <div className={styles.form_group}>
                <label className={styles.label} htmlFor="serialNumber">
                  Numéro de série :
                </label>
                <input placeholder="..." type="text" {...register('serialNumber')} />
                <p className={styles.__errors}>{errors.serialNumber?.message}</p>
              </div>
            )}

            <div className={styles.buttons_container}>
              <button className="btn btn-primary-light" type="reset" disabled={isPending}>
                RAZ
              </button>
              <button type="submit" className="btn btn-secondary" disabled={isPending}>
                Valider
              </button>
            </div>
          </form>
        </div>
      </CardComponent>
    </div>
  );
}
