import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import styles from './SearchSections.module.scss';
import { PulseLoader } from 'react-spinners';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

const routeApi = getRouteApi('/app/tools/credit');

const yupSchema = yup.object({
  serialNumber: yup.string().when(['businessNumber', 'orderNumber'], {
    is: (businessNumber: string | undefined, orderNumber: string | undefined) => !businessNumber && !orderNumber,
    then: () => yup.string().required('Au moins un champ requis'),
  }),
  businessNumber: yup.string(),
  orderNumber: yup.string(),
});

type AppViewToolsViewCreditsViewSearchSectionComponentProps = Readonly<{
  isLoading: boolean;
}>;
export default function AppViewToolsViewCreditsViewSearchSectionComponent({ isLoading }: AppViewToolsViewCreditsViewSearchSectionComponentProps) {
  const navigate = useNavigate({ from: routeApi.id });

  const { serialNumber, businessNumber, orderNumber } = routeApi.useSearch();

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSubmit = ({ serialNumber, businessNumber, orderNumber }: yup.InferType<typeof yupSchema>) => {
    navigate({ search: (old) => ({ ...old, serialNumber, businessNumber, orderNumber }) });
  };

  const onReset = () => {
    navigate({ search: (old) => ({ ...old, serialNumber: undefined, businessNumber: undefined, orderNumber: undefined }) });
  };

  useEffect(() => {
    setValue('serialNumber', serialNumber);
    setValue('businessNumber', businessNumber);
    setValue('orderNumber', orderNumber);
  }, [serialNumber, businessNumber, orderNumber]);

  return (
    <div className={styles.research_container}>
      <form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
        <div className={styles.form_group}>
          <label htmlFor="productSerialNumber">Numéro de série :</label>
          <input id="productSerialNumber" {...register('serialNumber')} />
          <p className={styles._errors}>{errors.serialNumber?.message}</p>
        </div>
        <div className={styles.form_group}>
          <label htmlFor="numBusiness">{"Numéro d'affaire :"}</label>
          <input id="numBusiness" {...register('businessNumber')} />
          <p className={styles._errors}>{errors.businessNumber?.message}</p>
        </div>
        <div className={styles.form_group}>
          <label htmlFor="numOrder">Numéro de commande :</label>
          <input id="numOrder" {...register('orderNumber')} />
          <p className={styles._errors}>{errors.orderNumber?.message}</p>
        </div>

        <div className={styles.form_loader}>
          <PulseLoader color="#16204E" loading={isLoading} className="" size={10} speedMultiplier={0.8} />
        </div>

        <div className={styles.form_buttons}>
          <button type="reset" className="btn btn-primary">
            Annuler
          </button>
          <button type="submit" className="btn btn-secondary">
            Afficher
          </button>
        </div>
      </form>
    </div>
  );
}
