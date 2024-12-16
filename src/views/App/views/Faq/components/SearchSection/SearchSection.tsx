import { yupResolver } from '@hookform/resolvers/yup';
import { getRouteApi } from '@tanstack/react-router';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import styles from './SearchSection.module.scss';

const routeApi = getRouteApi('/app/faq');

const yupSchema = yup.object({
  searchText: yup.string().trim(),
  fuzzy: yup.boolean(),
});

export default function AppViewFaqViewSearchSectionComponent() {
  const navigate = routeApi.useNavigate();

  const { search, fuzzy } = routeApi.useSearch();

  const { control, register, reset, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSubmit = ({ searchText, fuzzy }: yup.InferType<typeof yupSchema>) => {
    navigate({ search: (old) => ({ ...old, search: searchText || undefined, fuzzy, page: 0 }), replace: true, resetScroll: false });
  };

  const onReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({ search: (old) => ({ ...old, search: undefined, fuzzy: undefined, page: 0 }), replace: true, resetScroll: false });
  };

  useEffect(() => {
    reset({ searchText: search ?? '', fuzzy });
  }, [search, fuzzy]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={onReset} className={styles.search_add}>
      <div className="flex flex-row items-center gap-2">
        <input placeholder="Rechercher dans les mots clés ou le titre" {...register('searchText')} className={styles.searchtext_input} />
        <Controller
          control={control}
          name="fuzzy"
          render={({ field: { value, onChange } }) => (
            <div className="flex items-center gap-1">
              <label htmlFor="fuzzy" className="font-['DIN2014'] text-base text-[color:var(--primary-color)]">
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
