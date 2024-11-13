import { Controller, useWatch } from 'react-hook-form';
import { ReactMultiEmail } from 'react-multi-email';
import styles from './Inputs.module.scss';
import 'react-multi-email/dist/style.css';
import { useContext } from 'react';
import { SendEmailFormContext } from '../../../../utils/contexts/sendEmail';

const getEmailLabel = (email: string, index: number, removeEmail: (index: number, isDisabled?: boolean) => void) => (
  <div data-tag key={index}>
    <div data-tag-item>{email}</div>
    <button type="button" data-tag-handle onClick={() => removeEmail(index)}>
      ×
    </button>
  </div>
);

export default function SendEmailComponentHeaderComponentInputsComponent() {
  const { control, register, errors } = useContext(SendEmailFormContext)!;

  const recipient = useWatch({ control, name: 'recipient' });
  const cc = useWatch({ control, name: 'cc' });
  const bcc = useWatch({ control, name: 'bcc' });

  return (
    <div className={styles.input_container}>
      <div className={styles.form_group}>
        <Controller
          control={control}
          name={'recipient'}
          render={({ field: { onChange, onBlur } }) => (
            <ReactMultiEmail
              emails={recipient}
              className={styles.multi_email}
              placeholder="Destinataires"
              autoComplete="email"
              onChange={onChange}
              onBlur={onBlur}
              getLabel={getEmailLabel}
            />
          )}
        />
        <p className={styles.__errors}>{errors.recipient?.message}</p>
      </div>
      <div className={styles.form_group}>
        <Controller
          control={control}
          name={'cc'}
          render={({ field: { onChange, onBlur } }) => (
            <ReactMultiEmail
              emails={cc}
              className={styles.multi_email}
              placeholder="CC"
              autoComplete="email"
              onChange={onChange}
              onBlur={onBlur}
              getLabel={getEmailLabel}
            />
          )}
        />
        <p className={styles.__errors}>{errors.cc?.message}</p>
      </div>
      <div className={styles.form_group}>
        <Controller
          control={control}
          name={'bcc'}
          render={({ field: { onChange, onBlur } }) => (
            <ReactMultiEmail
              emails={bcc}
              className={styles.multi_email}
              placeholder="CCI"
              autoComplete="email"
              onChange={onChange}
              onBlur={onBlur}
              getLabel={getEmailLabel}
            />
          )}
        />
        <p className={styles.__errors}>{errors.bcc?.message}</p>
      </div>
      <div className={`${styles.form_group} ${styles.object_field}`}>
        <input className={styles.input} type="text" placeholder="Objet" {...register('subject')} />
        <p className={styles.__errors}>{errors.subject?.message}</p>
      </div>
    </div>
  );
}
