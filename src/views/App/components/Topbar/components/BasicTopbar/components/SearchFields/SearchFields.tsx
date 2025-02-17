import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from '@tanstack/react-router';
import { useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';

const yupSchema = yup.object().shape({
  product: yup.string().transform((val) => val || undefined),
  businessNumber: yup.string().transform((val) => val || undefined),
  serialNumber: yup.string().transform((val) => val || undefined),
  enterpriseName: yup.string().transform((val) => val || undefined),
});

export default function AppLayoutTopbarComponentBasicTopbarComponentSearchFieldsComponent() {
  const navigate = useNavigate();

  const { control, register, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const watch = useWatch({ control });

  const onSubmit = (data: yup.InferType<typeof yupSchema>) => {
    if (data.product) navigate({ to: '/app/products', search: { ref: data.product } });
    else if (data.businessNumber) navigate({ to: '/app/businesses-rma', search: { number: data.businessNumber } });
    else if (data.serialNumber) navigate({ to: '/app/products/serial-numbers', search: { serialNumbersSearch: data.serialNumber } });
    else if (data.enterpriseName) navigate({ to: '/app/enterprises', search: { enterprise: data.enterpriseName } });
  };

  return (
    <div className="flex flex-row gap-x-2">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row gap-x-2">
        <input
          type="text"
          placeholder="Produit"
          {...register('product')}
          disabled={Boolean(watch.businessNumber || watch.serialNumber || watch.enterpriseName)}
          className="rounded-md bg-white p-1 text-sm disabled:bg-gray-200"
        />
        <input
          type="text"
          placeholder="Numéro d'affaire"
          {...register('businessNumber')}
          disabled={Boolean(watch.product || watch.serialNumber || watch.enterpriseName)}
          className="rounded-md bg-white p-1 text-sm disabled:bg-gray-200"
        />
        <input
          type="text"
          placeholder="Numéro de série"
          {...register('serialNumber')}
          disabled={Boolean(watch.product || watch.businessNumber || watch.enterpriseName)}
          className="rounded-md bg-white p-1 text-sm disabled:bg-gray-200"
        />
        <input
          type="text"
          placeholder="Nom de l'entreprise"
          {...register('enterpriseName')}
          disabled={Boolean(watch.product || watch.businessNumber || watch.serialNumber)}
          className="rounded-md bg-white p-1 text-sm disabled:bg-gray-200"
        />
        <button type="submit" className="btn btn-secondary">
          Rechercher
        </button>
      </form>
      <Link to="/app/businesses-rma" hash="all-business-total-container" className="btn btn-primary-light">
        CA mois en cours
      </Link>
    </div>
  );
}
