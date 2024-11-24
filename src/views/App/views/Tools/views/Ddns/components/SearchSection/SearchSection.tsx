import { yupResolver } from '@hookform/resolvers/yup';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import styles from './SearchSection.module.scss';

const routeApi = getRouteApi('/app/tools/ddns');

const yupSchema = yup.object().shape({
  domainName: yup.string(),
  productReference: yup.string(),
  productSerialNumber: yup.string(),
  date: yup.date(),
  email: yup.string().email('Email invalide'),
});

export default function AppViewToolsViewDdnsViewSearchSectionComponent() {
  const navigate = routeApi.useNavigate();

  const { email, domain, serial, ref, date } = routeApi.useSearch();

  const { register, control, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  useEffect(() => {
    setValue('email', email);
    setValue('domainName', domain);
    setValue('productSerialNumber', serial);
    setValue('productReference', ref);
    setValue('date', date);
  }, [email, domain, serial, ref, date]);

  const onReset = () => {
    navigate({
      search: (old) => ({ ...old, email: undefined, domain: undefined, serial: undefined, ref: undefined, date: undefined, page: 0 }),
      replace: true,
    });
  };

  const onSubmit = ({ domainName, productReference, productSerialNumber, date, email }: yup.InferType<typeof yupSchema>) => {
    navigate({
      search: (old) => ({ ...old, email, domain: domainName, serial: productSerialNumber, ref: productReference, date, page: 0 }),
      replace: true,
    });
  };

  return (
    <div className={styles.inputs_container}>
      <form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
        <Controller
          control={control}
          name="date"
          render={({ field: { value, onChange, onBlur } }) => (
            <input
              placeholder="Date"
              type="date"
              value={value?.toISOString().split('T')[0] ?? ''}
              onChange={(e) => onChange(new Date(e.target.value))}
              onBlur={onBlur}
            />
          )}
        />
        <input placeholder="Nom de domaine" id="domainName" {...register('domainName')} />
        <input placeholder="Mail associé" id="email" {...register('email')} />
        <input placeholder="Numéro de série" id="productSerialNumber" {...register('productSerialNumber')} />
        <input placeholder="Référence" id="productReference" {...register('productReference')} />
        <button className="btn btn-primary" type="reset">
          Annuler
        </button>
        <button className="btn btn-secondary" type="submit">
          Rechercher
        </button>
      </form>
    </div>
  );
}
