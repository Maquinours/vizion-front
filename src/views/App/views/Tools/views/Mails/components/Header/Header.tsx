import { yupResolver } from '@hookform/resolvers/yup';
import { Link, getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import styles from './Header.module.scss';

const routeApi = getRouteApi('/app/tools/mails');

const yupSchema = yup.object().shape({
  search: yup.string().optional(),
});

export default function AppViewToolsViewMailsViewHeaderComponent() {
  const navigate = routeApi.useNavigate();

  const { search } = routeApi.useSearch();

  const { register, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSubmit = ({ search }: yup.InferType<typeof yupSchema>) => {
    navigate({ search: (old) => ({ ...old, page: undefined, search }) });
  };

  const onReset = () => {
    navigate({ search: (old) => ({ ...old, page: undefined, search: undefined }) });
  };

  useEffect(() => {
    setValue('search', search);
  }, [search]);

  return (
    <div className={styles.buttons_container}>
      <div className={styles.search_container}>
        <form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
          <input type="text" {...register('search')} placeholder="Entrer un texte pour rechercher" />
          <button type="submit" className="btn btn-secondary">
            Rechercher
          </button>
          <button type="reset" className="btn btn-primary">
            RAZ
          </button>
        </form>
      </div>
      <Link from={routeApi.id} to="create" search replace resetScroll={false} className="btn btn-secondary">
        Nouveau courrier
      </Link>
    </div>
  );
}
