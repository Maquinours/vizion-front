import { yupResolver } from '@hookform/resolvers/yup';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PulseLoader } from 'react-spinners';
import * as yup from 'yup';
import styles from './SearchSections.module.scss';

const routeApi = getRouteApi('/app/tools/credit');

const yupSchema = yup.object({
  serialNumber: yup.string().when(['businessNumber'], {
    is: (businessNumber: string | undefined) => !businessNumber,
    then: () => yup.string().required('Au moins un champ requis'),
  }),
  businessNumber: yup.string(),
});

type AppViewToolsViewCreditsViewSearchSectionComponentProps = Readonly<{
  isLoading: boolean;
}>;
export default function AppViewToolsViewCreditsViewSearchSectionComponent({ isLoading }: AppViewToolsViewCreditsViewSearchSectionComponentProps) {
  const navigate = routeApi.useNavigate();

  const { serialNumber, businessNumber } = routeApi.useSearch();

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSubmit = ({ serialNumber, businessNumber }: yup.InferType<typeof yupSchema>) => {
    navigate({
      search: (old) => ({
        ...old,
        serialNumber: serialNumber || undefined,
        businessNumber: businessNumber ? (businessNumber.startsWith('VZO ') ? businessNumber : `VZO ${businessNumber}`) : undefined,
      }),
      replace: true,
      resetScroll: false,
    });
  };

  const onReset = () => {
    navigate({ search: (old) => ({ ...old, serialNumber: undefined, businessNumber: undefined }), replace: true, resetScroll: false });
  };

  useEffect(() => {
    setValue('serialNumber', serialNumber);
    setValue('businessNumber', businessNumber);
  }, [serialNumber, businessNumber]);

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
