import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { queries } from '../../../../utils/constants/queryKeys';
import styles from './Assistance.module.scss';
import AppViewAssistanceViewButtonsSectionComponent from './components/ButtonsSection/ButtonsSection';
import AppViewAssistanceViewCumulatedTimeCardComponent from './components/CumulatedTimeCard/CumulatedTimeCard';
import AppViewAssistanceViewExpectedTimeCardComponent from './components/ExpectedTimeCard/ExpectedTimeCard';
import AppViewAssistanceViewGedComponent from './components/Ged/Ged';
import AppViewAssistanceViewLifesheetComponent from './components/Lifesheet/Lifesheet';
import AppViewAssistanceViewNoBilledTimeCardComponent from './components/NoBilledTimeCard/NoBilledTimeCard';
import AppViewAssistanceViewSubTitleCard from './components/SubtitleCard/SubtitleCard';
import AppViewAssistanceViewSummaryCardComponent from './components/SummaryCard/SummaryCard';
import AppViewAssistanceViewTitleCardComponent from './components/TitleCard/TitleCard';
import { AssistanceContext } from './utils/contexts/context';
import { updateTechnicalSupport } from '../../../../utils/api/technicalSupports';
import moment from 'moment';
import { toast } from 'react-toastify';
import AppViewAssistanceViewBeforeCloseModalView from './components/BeforeCloseModal/BeforeCloseModal';
import { TiArrowBack } from 'react-icons/ti';

const amountFormatter = (value: number) => {
  return value.toLocaleString('fr-FR', {
    minimumIntegerDigits: 2,
  });
};

const yupSchema = yup.object().shape({
  name: yup.string().required('Le nom est requis'),
  predefinedTime: yup.number().required('Le temps prévu est requis'), // number of hours
  cumulatedTime: yup.number().required('Le temps cumulé est requis'), // number of seconds
  noBilledTime: yup.number().required('Le temps non facturé est requis'),
});

export type AssistanceFormType = yup.InferType<typeof yupSchema>;

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/assistance/$assistanceId');

export default function AppViewAssistanceView() {
  const queryClient = useQueryClient();

  const { assistanceId } = routeApi.useParams();
  const { assistanceModal } = routeApi.useSearch();

  const { data: assistance } = useSuspenseQuery(queries['technical-supports'].detail._ctx.byId(assistanceId));

  const modal = useMemo(() => {
    if (assistanceModal === 'before-close') return <AppViewAssistanceViewBeforeCloseModalView />;
    return null;
  }, [assistanceModal]);

  const { register, control, getValues, setValue, resetField, watch } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      cumulatedTime: 0,
    },
  });

  const { mutate: update } = useMutation({
    mutationFn: () =>
      updateTechnicalSupport(assistance.id, {
        name: getValues('name'),
        businessNum: assistance.businessNumber,
        predefinedTime: `${getValues('predefinedTime')}:00:00`,
        cumulatedTime: (() => {
          const duration = moment.duration(getValues('cumulatedTime'), 'seconds');
          return `${amountFormatter(Math.floor(duration.asHours()))}:${amountFormatter(duration.minutes())}:${amountFormatter(duration.seconds())}`;
        })(),
        noBilledTime: (() => {
          const duration = moment.duration(getValues('noBilledTime'), 'seconds');
          return `${amountFormatter(Math.floor(duration.asHours()))}:${amountFormatter(duration.minutes())}:${amountFormatter(duration.seconds())}`;
        })(),
      }),
    onSuccess: (technicalSupport) => {
      queryClient.setQueryData(queries['technical-supports'].detail._ctx.byId(technicalSupport.id).queryKey, technicalSupport);
      toast.success("L'assistance a bien été mise à jour.");
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de la mise à jour de l'assistance");
    },
  });

  const contextValue = useMemo(() => ({ register, control, getValues, setValue, watch, update }), [register, control, getValues, setValue, watch, update]);

  useEffect(() => {
    setValue('name', assistance.name);
    if (!!assistance.predefinedTime) setValue('predefinedTime', parseInt(assistance.predefinedTime.split(':')[0]));
    else resetField('predefinedTime');
  }, [assistance.id]);

  return (
    <AssistanceContext.Provider value={contextValue}>
      <Link from={routeApi.id} to="/app/businesses-rma/business/$businessId" title="Retourner dans l'affaire" className="btn btn-primary mb-2 flex w-fit">
        <TiArrowBack size={16} />
      </Link>
      <div className={styles.container}>
        <div className={styles.content_grid}>
          <div className={styles.first_grid}>
            <AppViewAssistanceViewTitleCardComponent assistance={assistance} />
            <AppViewAssistanceViewSubTitleCard assistance={assistance} />
            <AppViewAssistanceViewExpectedTimeCardComponent assistance={assistance} />
            <AppViewAssistanceViewCumulatedTimeCardComponent assistance={assistance} />
            <AppViewAssistanceViewLifesheetComponent assistance={assistance} />
            <AppViewAssistanceViewGedComponent assistance={assistance} />
          </div>
          <div className={styles.second_grid}>
            <AppViewAssistanceViewNoBilledTimeCardComponent assistance={assistance} />
            <AppViewAssistanceViewSummaryCardComponent assistance={assistance} />
            <AppViewAssistanceViewButtonsSectionComponent />
            <div className={styles.blank}></div>
          </div>
        </div>
      </div>
      <Outlet />
      {modal}
    </AssistanceContext.Provider>
  );
}
