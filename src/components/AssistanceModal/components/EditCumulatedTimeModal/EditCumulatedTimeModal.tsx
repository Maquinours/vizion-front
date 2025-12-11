import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import React, { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';
import { AssistanceContext } from '../../utils/contexts/context';
import styles from './EditCumulatedTimeModal.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/edit-cumulated-time');

const formatNumber = (value: number) => {
  return value.toLocaleString('fr-FR', {
    minimumIntegerDigits: 2,
  });
};

const yupSchema = yup.object().shape({
  cumulatedTime: yup.number().required(),
});

type AssistanceModalComponentEditCumulatedTimeModalComponentProps = Readonly<{
  onClose: () => void;
}>;
export default function AssistanceModalComponentEditCumulatedTimeModalComponent({ onClose }: AssistanceModalComponentEditCumulatedTimeModalComponentProps) {
  // const navigate = routeApi.useNavigate();

  const { getValues: getContextValues, setValue: setContextValue, update } = useContext(AssistanceContext)!;

  const { control, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      cumulatedTime: 0,
    },
  });

  // const onClose = () => {
  //   navigate({ to: '..', search: true, replace: true, resetScroll: false });
  // };

  const onSubmit = ({ cumulatedTime }: yup.InferType<typeof yupSchema>) => {
    setContextValue('cumulatedTime', cumulatedTime);
    update();
    onClose();
  };

  useEffect(() => {
    setValue('cumulatedTime', getContextValues('cumulatedTime'));
  }, []);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.title_container}>
          <p>Modifier le temps passé cumulé de paramétrage</p>
        </div>
        <Controller
          control={control}
          name="cumulatedTime"
          render={({ field: { value, onChange } }) => {
            const duration = moment.duration(value, 'seconds');
            return (
              <div className={styles.form}>
                <div className={styles.inc_buttons}>
                  {[2, 1, 0].map((val, index, arr) => (
                    <React.Fragment key={val}>
                      <button onClick={() => onChange(value ?? 0 + Math.pow(60, val))}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                        </svg>
                      </button>
                      {index < arr.length - 1 && <div></div>}
                    </React.Fragment>
                  ))}
                </div>
                <div className={styles.time}>
                  {(['hours', 'minutes', 'seconds'] as Array<moment.unitOfTime.Base>).map((unit, index, arr) => (
                    <React.Fragment key={unit}>
                      <input
                        type="number"
                        value={formatNumber(unit === 'hours' ? Math.floor(duration.asHours()) : duration.get(unit))}
                        onChange={(e) =>
                          onChange(
                            arr.reduce((acc, item, i) => {
                              let value = i === index ? Number(e.target.value) : item === 'hours' ? Math.floor(duration.asHours()) : duration.get(item);
                              if (!value || value < 0) value = 0;
                              if (item === 'hours') {
                                if (value >= 1000) value = Math.floor(duration.asHours());
                              } else if (value >= 60) value = duration.get(item);
                              return acc + value * Math.pow(60, 2 - i);
                            }, 0),
                          )
                        }
                      />
                      {index < arr.length - 1 && <span>:</span>}
                    </React.Fragment>
                  ))}
                </div>
                <div className={styles.decr_buttons}>
                  {[2, 1, 0].map((val, index, arr) => (
                    <React.Fragment key={val}>
                      <button onClick={() => onChange(value ?? 0 - Math.pow(60, val))}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-circle" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                          <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                        </svg>
                      </button>
                      {index < arr.length - 1 && <div></div>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          }}
        />
        <div className={styles.buttons_container}>
          <button className="btn btn-primary-light" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn-secondary" onClick={handleSubmit((data) => onSubmit(data))}>
            Modifier
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
