import { yupResolver } from '@hookform/resolvers/yup';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import styles from './SearchSection.module.scss';

const Route = getRouteApi('/app/enterprises/$enterpriseId/address-book');

const yupSchema = yup.object({
  search: yup.string(),
});

export default function AppViewEnterpriseViewAddressBookModalViewSearchSectionComponent() {
  const navigate = useNavigate({ from: Route.id });

  const { search } = Route.useSearch();

  const { register, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSubmit = ({ search }: yup.InferType<typeof yupSchema>) => {
    navigate({ search: (old) => ({ ...old, search: search || undefined, page: undefined }), replace: true, resetScroll: false });
  };

  const onReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({ search: (old) => ({ ...old, search: undefined, page: undefined }), replace: true, resetScroll: false });
  };

  useEffect(() => {
    setValue('search', search);
  }, [setValue, search]);

  return (
    <div className={styles.research_container}>
      <form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
        <input type="text" {...register('search')} placeholder="Entrer le texte..." />
        <button type="submit" className="btn btn-secondary">
          Rechercher
        </button>
        <button type="reset" className="btn btn-primary">
          RAZ
        </button>
      </form>
    </div>
  );
}
