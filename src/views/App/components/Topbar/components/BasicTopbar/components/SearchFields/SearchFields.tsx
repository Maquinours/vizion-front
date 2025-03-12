import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from '@tanstack/react-router';
import { useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';

const yupSchema = yup.object().shape({
  product: yup
    .string()
    .transform((val) => val || undefined)
    .trim(),
  businessNumber: yup
    .string()
    .transform((val) => val || undefined)
    .trim(),
  serialNumber: yup
    .string()
    .transform((val) => val || undefined)
    .trim(),
  enterpriseName: yup
    .string()
    .transform((val) => val || undefined)
    .trim(),
  contact: yup
    .string()
    .transform((val) => val || undefined)
    .trim(),
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
    else if (data.contact) navigate({ to: '/app/enterprises', search: { contact: data.contact } });
  };

  return (
    <div className="flex flex-row gap-x-2">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row gap-x-2">
        <input
          type="text"
          placeholder="Produit"
          {...register('product')}
          disabled={Boolean(watch.businessNumber || watch.serialNumber || watch.enterpriseName || watch.contact)}
          className="max-w-32 rounded-md bg-white p-1 text-sm disabled:bg-gray-200"
        />
        <input
          type="text"
          placeholder="Numéro d'affaire"
          {...register('businessNumber')}
          disabled={Boolean(watch.product || watch.serialNumber || watch.enterpriseName || watch.contact)}
          className="max-w-32 rounded-md bg-white p-1 text-sm disabled:bg-gray-200"
        />
        <input
          type="text"
          placeholder="Numéro de série"
          {...register('serialNumber')}
          disabled={Boolean(watch.product || watch.businessNumber || watch.enterpriseName || watch.contact)}
          className="max-w-32 rounded-md bg-white p-1 text-sm disabled:bg-gray-200"
        />
        <input
          type="text"
          placeholder="Nom de l'entreprise"
          {...register('enterpriseName')}
          disabled={Boolean(watch.product || watch.businessNumber || watch.serialNumber || watch.contact)}
          className="max-w-32 rounded-md bg-white p-1 text-sm disabled:bg-gray-200"
        />
        <input
          type="text"
          placeholder="Contact/Agence"
          {...register('contact')}
          disabled={Boolean(watch.product || watch.businessNumber || watch.serialNumber || watch.enterpriseName)}
          className="max-w-32 rounded-md bg-white p-1 text-sm disabled:bg-gray-200"
        />
        <button type="submit" className="btn btn-secondary">
          Rechercher
        </button>
      </form>
    </div>
  );
}
