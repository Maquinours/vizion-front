import { yupResolver } from '@hookform/resolvers/yup';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineSearch } from 'react-icons/ai';
import * as yup from 'yup';
import styles from './SearchSection.module.scss';

const Route = getRouteApi('/app/enterprises/$enterpriseId');

const yupSchema = yup.object({
  search: yup.string(),
});

export default function AppViewEnterpriseViewContactsComponentSearchSectionComponent() {
  const navigate = useNavigate();

  const { contactsSearch } = Route.useSearch();

  const { register, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSubmit = ({ search }: yup.InferType<typeof yupSchema>) => {
    navigate({ from: Route.id, search: (old) => ({ ...old, contactsSearch: search || undefined, page: 0 }), replace: true, resetScroll: false });
  };

  useEffect(() => {
    setValue('search', contactsSearch);
  }, [contactsSearch, setValue]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register('search')} />
        <button type="submit" className="btn btn-primary">
          <AiOutlineSearch />
        </button>
      </form>
    </div>
  );
}
