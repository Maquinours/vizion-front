import { yupResolver } from '@hookform/resolvers/yup';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import styles from './SearchSection.module.scss';

const routeApi = getRouteApi('/app/faq');

const yupSchema = yup.object({
  searchText: yup.string(),
});

export default function AppViewFaqViewSearchSectionComponent() {
  const navigate = useNavigate();

  const { search } = routeApi.useSearch();

  const { register, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSubmit = ({ searchText }: yup.InferType<typeof yupSchema>) => {
    navigate({ from: routeApi.id, search: (old) => ({ ...old, search: searchText, page: 0 }) });
  };

  const onReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({ from: routeApi.id, search: (old) => ({ ...old, search: undefined, page: 0 }) });
  };

  useEffect(() => {
    setValue('searchText', search);
  }, [search]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={onReset} className={styles.search_add}>
      <input placeholder="Rechercher dans les mots clés ou le titre" id="searchText" {...register('searchText')} />
      <button type="reset" className="btn btn-primary">
        RAZ
      </button>
      <button type="submit" className="btn btn-secondary">
        Rechercher
      </button>
    </form>
  );
}
