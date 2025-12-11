import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import CustomSelect from '../../../../../../components/CustomSelect/CustomSelect';
import { queries } from '../../../../../../utils/constants/queryKeys';
import FaqAccessLevel from '../../../../../../utils/enums/FaqAccessLevel';
import ProductResponseDto from '../../../../../../utils/types/ProductResponseDto';
import styles from './SearchSection.module.scss';

const routeApi = getRouteApi('/app/faq');

const yupSchema = yup.object({
  searchText: yup.string().trim(),
  product: yup.mixed<ProductResponseDto>(),
  accessLevel: yup.mixed<FaqAccessLevel>(),
  fuzzy: yup.boolean(),
  titleOnly: yup.boolean(),
});

const faqAccessLevelOptions: Array<{ label: string; value: FaqAccessLevel }> = [
  {
    label: 'A valider',
    value: FaqAccessLevel.ATTENTE,
  },
  {
    label: 'Interne VIZEO',
    value: FaqAccessLevel.INTERNE,
  },
  {
    label: 'Externe publique',
    value: FaqAccessLevel.PUBLIC,
  },
  {
    label: 'VIZIA Comportement',
    value: FaqAccessLevel.VIZIA_COMPORTEMENT,
  },
];

export default function AppViewFaqViewSearchSectionComponent() {
  const navigate = routeApi.useNavigate();

  const { search, productId, accessLevel, fuzzy, titleOnly } = routeApi.useSearch();

  const { data: products, isLoading: isLoadingProducts } = useQuery(queries.product.list);

  const { control, register, reset, resetField, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSubmit = ({ searchText, product, accessLevel, fuzzy, titleOnly }: yup.InferType<typeof yupSchema>) => {
    navigate({
      search: (old) => ({ ...old, search: searchText || undefined, productId: product?.id, accessLevel: accessLevel || undefined, fuzzy, titleOnly, page: 0 }),
      replace: true,
      resetScroll: false,
    });
  };

  const onReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({
      search: (old) => ({ ...old, search: undefined, productId: undefined, accessLevel: undefined, fuzzy: undefined, titleOnly: undefined, page: 0 }),
      replace: true,
      resetScroll: false,
    });
  };

  // const accessLevelWatch = useWatch({ name: 'accessLevel', control });
  // const fuzzyWatch = useWatch({ name: 'fuzzy', control });
  // const productIdWatch = useWatch({ name: 'product', control });

  // console.log({ accessLevelWatch, fuzzyWatch, productIdWatch });

  // useEffect(() => {
  //   handleSubmit(onSubmit)();
  // }, [accessLevelWatch, fuzzyWatch, productIdWatch]);

  useEffect(() => {
    const product = products?.find((item) => item.id === productId);

    reset({ searchText: search ?? '', accessLevel, fuzzy, product, titleOnly });
    // resetField('searchText', { defaultValue: search ?? '' });
    // resetField('accessLevel', { defaultValue: accessLevel });
    // resetField('fuzzy', { defaultValue: fuzzy });
    // reset({ searchText: search ?? '', accessLevel, fuzzy });
  }, [search, accessLevel, productId, fuzzy, titleOnly]);

  useEffect(() => {
    const product = products?.find((item) => item.id === productId);
    console.log({ product, productId });
    resetField('product', { defaultValue: product });
  }, [products]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={onReset} className={styles.search_add}>
      <div className="flex flex-row items-center gap-2">
        <input placeholder="Rechercher dans les mots clés ou le titre" {...register('searchText')} className={styles.searchtext_input} />
        <Controller
          control={control}
          name="product"
          render={({ field: { value, onChange } }) => (
            <CustomSelect
              options={products}
              isLoading={isLoadingProducts}
              getOptionLabel={(opt) => opt.reference ?? ''}
              getOptionValue={(opt) => opt.id}
              value={value ?? null}
              onChange={(e) => {
                onChange(e ?? undefined);
                handleSubmit(onSubmit)();
              }}
              isClearable
              placeholder="Sélectionner un produit"
            />
          )}
        />
        <Controller
          control={control}
          name="accessLevel"
          render={({ field: { value, onChange } }) => (
            <CustomSelect
              options={faqAccessLevelOptions}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              value={faqAccessLevelOptions.find((opt) => opt.value === value) ?? null}
              onChange={(e) => {
                onChange(e?.value);
                handleSubmit(onSubmit)();
              }}
              isClearable
              placeholder="Sélectionner un niveau"
            />
          )}
        />
        <Controller
          control={control}
          name="fuzzy"
          render={({ field: { value, onChange } }) => (
            <div className="flex items-center gap-1">
              <label htmlFor="fuzzy" className="font-['DIN2014'] text-base text-(--primary-color)">
                Recherche floue
              </label>
              <input
                type="checkbox"
                id="fuzzy"
                checked={!!value}
                onChange={(e) => {
                  onChange(e);
                  handleSubmit(onSubmit)();
                }}
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="titleOnly"
          render={({ field: { value, onChange } }) => (
            <div className="flex items-center gap-1">
              <label htmlFor="titleOnly" className="font-['DIN2014'] text-base text-(--primary-color)">
                Recherche dans le titre uniquement
              </label>
              <input
                type="checkbox"
                id="titleOnly"
                checked={!!value}
                onChange={(e) => {
                  onChange(e);
                  handleSubmit(onSubmit)();
                }}
              />
            </div>
          )}
        />
      </div>
      <div className="flex flex-row items-center gap-2">
        <button type="reset" className="btn btn-primary">
          RAZ
        </button>
        <button type="submit" className="btn btn-secondary">
          Rechercher
        </button>
      </div>
    </form>
  );
}
