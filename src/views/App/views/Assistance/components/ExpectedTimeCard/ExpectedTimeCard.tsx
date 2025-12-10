import { useContext, useEffect, useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import CardComponent from '../../../../../../components/Card/Card';
import { AssistanceContext } from '../../utils/contexts/context';
import styles from './ExpectedTimeCard.module.scss';
import TechnicalSupportResponseDto from '../../../../../../utils/types/TechnicalSupportResponseDto';

const amountFormatter = (value: number) => {
  return value.toLocaleString('fr-FR', {
    minimumIntegerDigits: 2,
  });
};

type AppViewAssistanceViewExpectedTimeCardComponentProps = Readonly<{
  assistance: TechnicalSupportResponseDto;
}>;
export default function AppViewAssistanceViewExpectedTimeCardComponent({ assistance }: AppViewAssistanceViewExpectedTimeCardComponentProps) {
  const { control, getValues, update } = useContext(AssistanceContext)!;

  const predefinedTime = useWatch({ control, name: 'predefinedTime' });

  const [updateTimeoutId, setUpdateTimeoutId] = useState<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (updateTimeoutId) clearTimeout(updateTimeoutId);
    setUpdateTimeoutId(
      setTimeout(() => {
        if (`${amountFormatter(getValues('predefinedTime'))}:00:00` !== assistance.predefinedTime) update();
      }, 1000),
    );
  }, [predefinedTime]);

  return (
    <CardComponent title="Temps prévu" className={styles.card}>
      <Controller
        control={control}
        name="predefinedTime"
        render={({ field: { value, onChange } }) => (
          <div className={styles.container}>
            <div className={styles.text}>{value}h</div>
            <div className={styles.buttons_container}>
              <button onClick={() => onChange(value ?? 0 + 1)}>
                <svg width={'11'} height={'9'}>
                  <polygon strokeWidth={'0'} points="0,9 11,9 5.5,0" />
                </svg>
              </button>
              <button onClick={() => onChange(Math.max(0, value ?? 0 - 1))}>
                <svg width={'11'} height={'9'}>
                  <polygon strokeWidth="0" points="0,0 11,0 5.5,9" />
                </svg>
              </button>
            </div>
          </div>
        )}
      />
    </CardComponent>
  );
}
