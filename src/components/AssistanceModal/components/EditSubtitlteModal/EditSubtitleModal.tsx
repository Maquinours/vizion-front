import { yupResolver } from '@hookform/resolvers/yup';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';
import { AssistanceContext } from '../../utils/contexts/context';
import styles from './EditSubtitleModal.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/edit-subtitle');

const yupSchema = yup.object().shape({
  name: yup.string().required('Le nom est requis'),
});

type AssistanceModalComponentEditSubtitleModalComponentProps = Readonly<{
  onClose: () => void;
}>;
export default function AssistanceModalComponentEditSubtitleModalComponent({ onClose }: AssistanceModalComponentEditSubtitleModalComponentProps) {
  // const navigate = routeApi.useNavigate();

  const { getValues, setValue, update } = useContext(AssistanceContext)!;

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      name: getValues('name'),
    },
  });

  // const onClose = () => {
  //   navigate({ to: '..', search: true, replace: true, resetScroll: false });
  // };

  const onSubmit = ({ name }: yup.InferType<typeof yupSchema>) => {
    setValue('name', name);
    update();
    onClose();
  };

  return (
    <ReactModal isOpen={true} overlayClassName="Overlay" onRequestClose={onClose} className={styles.modal}>
      <div className={styles.modal_container}>
        <div className={styles.title_container}>
          <p>{"Modification du sous nom de l'affaire"}</p>
        </div>
        <div className={styles.input_container}>
          <input type={'text'} {...register('name')} />
        </div>
        <div className={styles.buttons_container}>
          <button className="btn btn-primary-light" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn-secondary" onClick={handleSubmit(onSubmit)}>
            Modifier
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
