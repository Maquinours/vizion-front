import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import styles from './SearchSection.module.scss';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import React, { useEffect } from 'react';

const routeApi = getRouteApi('/app/products/serial-numbers');

const yupSchema = yup.object({
  searchValue: yup.string(),
});

export default function AppViewProductsViewSerialNumbersModalViewSearchSectionComponent() {
  const navigate = useNavigate();

  const { serialNumbersSearch } = routeApi.useSearch();

  const { register, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSearch = ({ searchValue }: yup.InferType<typeof yupSchema>) => {
    navigate({ from: routeApi.id, search: (old) => ({ ...old, serialNumbersSearch: searchValue, serialNumbersPage: 0 }) });
  };

  const onReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({ from: routeApi.id, search: (old) => ({ ...old, serialNumbersSearch: undefined, serialNumbersPage: 0 }) });
  };

  useEffect(() => {
    setValue('searchValue', serialNumbersSearch);
  }, [serialNumbersSearch]);

  return (
    <div className={styles.search_container}>
      <form onSubmit={handleSubmit(onSearch)} onReset={onReset}>
        <div className={styles.form_group}>
          <label htmlFor="searchValue">Nr de série ou Référence</label>
          <input {...register('searchValue')} name="searchValue" id="searchValue" />
        </div>
        <div className={styles.search_button}>
          <button className="btn btn-primary" type="submit">
            Rechercher
          </button>
          <button className="btn btn-secondary" type="reset">
            RAZ
          </button>
        </div>
      </form>
    </div>
  );
}
