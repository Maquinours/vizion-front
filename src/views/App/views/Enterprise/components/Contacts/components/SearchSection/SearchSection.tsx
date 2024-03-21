import { yupResolver } from '@hookform/resolvers/yup';
import { Link, getRouteApi } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { AiOutlineSearch } from 'react-icons/ai';
import * as yup from 'yup';
import styles from './SearchSection.module.scss';
import { useEffect } from 'react';

const Route = getRouteApi('/app/enterprises/$enterpriseId');

const yupSchema = yup.object({
  search: yup.string(),
});

export default function AppViewEnterpriseViewContactsComponentSearchSectionComponent() {
  const { contactsSearch } = Route.useSearch();

  const { register, watch, setValue } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const search = watch('search');

  useEffect(() => {
    setValue('search', contactsSearch);
  }, [contactsSearch, setValue]);

  return (
    <div className={styles.container}>
      <input type="text" {...register('search')} />
      <Link from={Route.id} search={(old) => ({ ...old, contactsSearch: search || undefined })} className="btn btn-primary">
        <AiOutlineSearch />
      </Link>
    </div>
  );
}
