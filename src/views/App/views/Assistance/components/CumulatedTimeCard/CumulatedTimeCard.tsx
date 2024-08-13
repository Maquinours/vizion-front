import { Link, getRouteApi } from '@tanstack/react-router';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import CardComponent from '../../../../../../components/Card/Card';
import { AssistanceContext } from '../../utils/contexts/context';
import styles from './CumulatedTimeCard.module.scss';
import TechnicalSupportResponseDto from '../../../../../../utils/types/TechnicalSupportResponseDto';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/assistance/$assistanceId');

const amountFormatter = (value: number) => {
  return value.toLocaleString('fr-FR', {
    minimumIntegerDigits: 2,
  });
};

type AppViewAssistanceViewCumulatedTimeCardComponentProps = Readonly<{
  assistance: TechnicalSupportResponseDto;
}>;
export default function AppViewAssistanceViewCumulatedTimeCardComponent({ assistance }: AppViewAssistanceViewCumulatedTimeCardComponentProps) {
  const { control, getValues, setValue, update } = useContext(AssistanceContext)!;
  const [runningIntervalId, setRunningIntervalId] = useState<NodeJS.Timeout>();

  const startTimer = () => {
    setRunningIntervalId(
      setInterval(() => {
        setValue('cumulatedTime', getValues('cumulatedTime') + 1);
      }, 1000),
    );
  };

  const startRunning = () => {
    if (!!runningIntervalId) return;
    startTimer();
    window.sessionStorage.setItem(
      `assistance.${assistance.id}.running_timer.cumulatedTime`,
      JSON.stringify({ start: Date.now(), value: getValues('cumulatedTime') }),
    );
    toast.success('Le chronomètre de paramètrage a bien été démarré.');
  };

  const stopRunning = () => {
    if (runningIntervalId) clearInterval(runningIntervalId);
    setRunningIntervalId(undefined);
    window.sessionStorage.removeItem(`assistance.${assistance.id}.running_timer.cumulatedTime`);
    toast.success('Le chronomètre de paramètrage a bien été arrêté.');
    update();
  };

  useEffect(() => {
    const runningTimer = window.sessionStorage.getItem(`assistance.${assistance.id}.running_timer.cumulatedTime`);
    if (runningTimer) {
      const { start, value } = JSON.parse(runningTimer) as { start: number; value: number };
      const duration = moment.duration(Date.now() - start, 'milliseconds').add(value, 'seconds');
      setValue('cumulatedTime', Math.floor(duration.as('seconds')));
      startTimer();
    } else setValue('cumulatedTime', assistance.cumulatedTime ? moment.duration(assistance.cumulatedTime).as('seconds') : 0);
  }, [assistance.id]);

  useEffect(() => {
    return () => {
      if (runningIntervalId) clearInterval(runningIntervalId);
    };
  }, []);

  return (
    <CardComponent title="Temps passé cumulé de paramètrage" className={styles.card}>
      <div className={styles.container}>
        <Controller
          control={control}
          name="cumulatedTime"
          render={({ field: { value } }) => {
            const duration = moment.duration(value, 'seconds');
            return (
              <div className={styles.text}>
                {(['hours', 'minutes', 'seconds'] as Array<moment.unitOfTime.Base>).map(
                  (unit, index, arr) => amountFormatter(duration.get(unit)) + (index < arr.length - 1 ? ':' : ''),
                )}
              </div>
            );
          }}
        />
        <div className={styles.buttons_container}>
          <Link from={routeApi.id} to="edit-cumulated-time" search replace resetScroll={false} preload="intent">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
              <g id="Groupe_2701" data-name="Groupe 2701" transform="translate(-1396 -249)">
                <g id="Ellipse_148" data-name="Ellipse 148" transform="translate(1396 249)" fill="#fff" stroke="#16204e" strokeWidth="1">
                  <circle cx="15" cy="15" r="15" stroke="none" />
                  <circle cx="15" cy="15" r="14.5" fill="none" />
                </g>
                <g id="edit_black_24dp" transform="translate(1401 254)">
                  <path id="Tracé_1845" data-name="Tracé 1845" d="M0,0H20V20H0Z" fill="none" />
                  <path
                    id="Tracé_1846"
                    data-name="Tracé 1846"
                    d="M3,14.247v2.365A.385.385,0,0,0,3.389,17H5.753a.365.365,0,0,0,.272-.117L14.519,8.4,11.6,5.481,3.117,13.967a.382.382,0,0,0-.117.28Zm13.775-8.1a.775.775,0,0,0,0-1.1l-1.82-1.82a.775.775,0,0,0-1.1,0L12.435,4.648l2.917,2.917,1.423-1.423Z"
                    fill="#16204e"
                  />
                </g>
              </g>
            </svg>
          </Link>
          <button disabled={!runningIntervalId} className={styles.button} onClick={() => stopRunning()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
              <g id="stop-red" transform="translate(-84 -84)">
                <path
                  id="Tracé_1844"
                  data-name="Tracé 1844"
                  d="M99,84a15,15,0,1,0,15,15A15.015,15.015,0,0,0,99,84Zm5.622,19.359a1.268,1.268,0,0,1-1.263,1.263H94.641a1.268,1.268,0,0,1-1.263-1.263V94.641a1.268,1.268,0,0,1,1.263-1.263h8.684a1.268,1.268,0,0,1,1.263,1.263v8.718Z"
                  fill="#f24c52"
                />
              </g>
            </svg>
          </button>
          <button disabled={!!runningIntervalId} className={styles.button} onClick={() => startRunning()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
              <g id="play-blue" transform="translate(-84 -84)">
                <path
                  id="Tracé_1843"
                  data-name="Tracé 1843"
                  d="M99,84a15,15,0,1,0,15,15A15.015,15.015,0,0,0,99,84Zm4.833,15.756-7.071,4.7a.914.914,0,0,1-1.421-.756V94.3a.912.912,0,0,1,1.421-.756l7.071,4.7a.911.911,0,0,1,0,1.511Z"
                  fill="#16204e"
                />
              </g>
            </svg>
          </button>
        </div>
      </div>
    </CardComponent>
  );
}
