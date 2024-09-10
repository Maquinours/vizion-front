import { yupResolver } from '@hookform/resolvers/yup';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import styles from './SearchSection.module.scss';

const routeApi = getRouteApi('/app/products');

const yupSchema = yup.object({
  designation: yup.string(),
  ref: yup.string(),
});

export default function AppViewProductsViewSearchSectionComponent() {
  const navigate = useNavigate();

  const { ref, designation } = routeApi.useSearch();

  const { register, setValue, handleSubmit, reset } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSubmit = ({ ref, designation }: yup.InferType<typeof yupSchema>) => {
    navigate({
      from: routeApi.id,
      search: (old) => ({ ...old, ref: ref?.trim() || undefined, designation: designation?.trim() || undefined, page: undefined }),
      replace: true,
      resetScroll: false,
    });
  };

  const onReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    reset();
    navigate({ from: routeApi.id, search: (old) => ({ ...old, ref: undefined, designation: undefined, page: undefined }), replace: true, resetScroll: false });
  };

  useEffect(() => {
    setValue('ref', ref);
    setValue('designation', designation);
  }, [ref, designation]);

  return (
    <div className={styles.filter_container}>
      <div className={styles.title}>Filtres</div>
      <form onSubmit={handleSubmit(onSubmit)} onReset={(e) => onReset(e)}>
        <div className={styles.filter_content}>
          <div className={styles.input_containers}>
            <input placeholder="Référence" id="productRef" {...register('ref')} />
            <input placeholder="Désignation" id="productDesignation" {...register('designation')} />
          </div>
          <div className={styles.buttons_actions}>
            <button className="btn btn-secondary" type="submit">
              Rechercher
            </button>
            <button className="btn btn-primary" type="reset">
              Réinitialiser
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
