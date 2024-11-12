import { yupResolver } from '@hookform/resolvers/yup';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import styles from './SearchSection.module.scss';

const routeApi = getRouteApi('/app/tools/emails');

const yupSchema = yup.object({
  searchText: yup.string(),
});

export default function AppViewToolsViewEmailsViewSearchSectionComponent() {
  const navigate = routeApi.useNavigate();

  const { search } = routeApi.useSearch();

  const { register, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSubmit = ({ searchText }: yup.InferType<typeof yupSchema>) => {
    navigate({ search: (old) => ({ ...old, search: searchText, page: 0 }), replace: true, resetScroll: false });
  };

  const onReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({ search: (old) => ({ ...old, search: undefined, page: 0 }), replace: true, resetScroll: false });
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
