import { useQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import ProductVersionResponseDto from '../../../../../../../../utils/types/ProductVersionResponseDto';
import ProductShelfResponseDto from '../../../../../../../../utils/types/ProductShelfResponseDto';
import styles from './SearchSection.module.scss';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import React, { useEffect } from 'react';

const routeApi = getRouteApi('/app/tools/product-inventory');

const yupSchema = yup.object().shape({
  shelf: yup.mixed<ProductShelfResponseDto>().nullable(),
  version: yup.mixed<ProductVersionResponseDto>().nullable(),
});

export default function AppViewToolsViewProductInventoryViewSearchSectionComponent() {
  const navigate = useNavigate({ from: routeApi.id });

  const { shelfId, versionId } = routeApi.useSearch();

  const { data: productVersions, isLoading: isLoadingProductVersions } = useQuery(queries['product-versions'].list._ctx.all);
  const { data: productShelves, isLoading: isLoadingProductShelves } = useQuery(queries['product-shelves'].list);

  const { control, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSearch = ({ shelf, version }: yup.InferType<typeof yupSchema>) => {
    navigate({ search: (old) => ({ ...old, shelfId: shelf?.id, versionId: version?.id, page: 0 }) });
  };

  const onReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({ search: (old) => ({ ...old, shelfId: undefined, versionId: undefined, page: 0 }) });
  };

  useEffect(() => {
    setValue('shelf', productShelves?.find((shelf) => shelf.id === shelfId) ?? undefined);
  }, [shelfId, isLoadingProductShelves]);

  useEffect(() => {
    setValue('version', productVersions?.find((version) => version.id === versionId) ?? undefined);
  }, [versionId, isLoadingProductVersions]);

  return (
    <form className={styles.search_content} onSubmit={handleSubmit(onSearch)} onReset={onReset}>
      <Controller
        control={control}
        name="version"
        render={({ field: { value, onChange } }) => (
          <CustomSelect
            options={productVersions}
            getOptionLabel={(opt) => opt.reference ?? ''}
            getOptionValue={(opt) => opt.id}
            placeholder="Référence"
            value={value}
            onChange={onChange}
            isLoading={isLoadingProductVersions}
          />
        )}
      />
      <Controller
        control={control}
        name="shelf"
        render={({ field: { value, onChange } }) => (
          <CustomSelect
            options={productShelves}
            getOptionLabel={(opt) => opt.number ?? ''}
            getOptionValue={(opt) => opt.id}
            placeholder="Étagère"
            value={value}
            onChange={onChange}
            isLoading={isLoadingProductShelves}
          />
        )}
      />
      <div className={styles.search_buttons}>
        <button type="submit" className="btn btn-secondary">
          Afficher
        </button>
        <button type="reset" className="btn btn-primary">
          RAZ
        </button>
      </div>
    </form>
  );
}
