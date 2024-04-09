import { yupResolver } from '@hookform/resolvers/yup';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import styles from './SearchSection.module.scss';
import { useEffect } from 'react';

const routeApi = getRouteApi('/app/tools/emails');

const yupSchema = yup.object({
  searchText: yup.string(),
});

export default function AppViewToolsViewEmailsViewSearchSectionComponent() {
  const navigate = useNavigate({ from: routeApi.id });

  const { search } = routeApi.useSearch();

  const { register, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSubmit = ({ searchText }: yup.InferType<typeof yupSchema>) => {
    navigate({ search: (old) => ({ ...old, search: searchText, page: 0 }) });
  };

  const onReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({ search: (old) => ({ ...old, search: undefined, page: 0 }) });
  };

  useEffect(() => {
    setValue('searchText', search);
  }, [search]);

  return (
    <div className={styles.search_container}>
      <form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
        <input placeholder="Recherche globale" id="searchText" {...register('searchText')} />
        <button className="btn btn-primary" type="reset">
          RAZ
        </button>
        <button className="btn btn-secondary" type="submit">
          Rechercher
        </button>
      </form>
    </div>
  );
}
