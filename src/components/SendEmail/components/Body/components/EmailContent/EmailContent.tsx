import { Controller } from 'react-hook-form';
import styles from './EmailContent.module.scss';
import { useContext } from 'react';
import { SendEmailFormContext } from '../../../../utils/contexts/sendEmail';
import Quill from '../../../../../Quill/Quill';

export default function SendEmailComponentBodyComponentEmailContentComponent() {
  const { control } = useContext(SendEmailFormContext)!;
  return (
    <div className={styles.editor_container}>
      <Controller
        control={control}
        name="content"
        render={({ field: { value, onChange, onBlur } }) => <Quill value={value} placeholder="Contenu du mail" onChange={onChange} onBlur={onBlur} />}
      />
    </div>
  );
}
