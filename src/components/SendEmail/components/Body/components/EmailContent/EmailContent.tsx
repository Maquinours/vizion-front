import { Controller } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
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
        render={({ field }) => <Quill {...field} placeholder="Contenu du mail" onChange={(text) => field.onChange(text)} />}
      />
    </div>
  );
}
