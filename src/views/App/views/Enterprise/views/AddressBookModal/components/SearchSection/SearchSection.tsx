import { yupResolver } from '@hookform/resolvers/yup';
import { Link, getRouteApi } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import styles from './SearchSection.module.scss';
import { useEffect } from 'react';

const Route = getRouteApi('/app/enterprises/$enterpriseId/address-book');

const yupSchema = yup.object({
  search: yup.string(),
});

export default function AppViewEnterpriseViewAddressBookModalViewSearchSectionComponent() {
  const { search } = Route.useSearch();

  const { register, setValue, watch } = useForm({
    resolver: yupResolver(yupSchema),
  });

  useEffect(() => {
    setValue('search', search);
  }, [setValue, search]);

  return (
    <div className={styles.research_container}>
      <form>
        <input type="string" {...register('search')} placeholder="Entrer le texte..." />
        <Link from={Route.id} search={(old) => ({ ...old, search: watch('search'), page: 0 })} className="btn btn-secondary">
          Rechercher
        </Link>
        <Link from={Route.id} search={(old) => ({ ...old, search: undefined, page: 0 })} className="btn btn-primary">
          RAZ
        </Link>
      </form>
    </div>
  );
}
