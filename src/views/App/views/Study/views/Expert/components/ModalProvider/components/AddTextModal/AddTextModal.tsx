import { yupResolver } from '@hookform/resolvers/yup';
import { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { XYPosition, useReactFlow } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import Quill from '../../../../../../../../../../components/Quill/Quill';
import ExpertStudyContext from '../../../../utils/context';

const quillModules = {
  toolbar: {
    container: [['bold', 'italic', 'underline']],
  },
};

const yupSchema = yup.object().shape({
  text: yup.string().required('Champs requis'),
});

type AppViewStudyViewExpertViewModalProviderComponentAddTextModalComponentProps = Readonly<{
  nodePosition: XYPosition;
}>;
export default function AppViewStudyViewExpertViewModalProviderComponentAddTextModalComponent({
  nodePosition,
}: AppViewStudyViewExpertViewModalProviderComponentAddTextModalComponentProps) {
  const { addNodes } = useReactFlow();
  const { setModal, setPaneClickFunction } = useContext(ExpertStudyContext)!;

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    setModal(undefined);
  };

  const onSubmit = ({ text }: yup.InferType<typeof yupSchema>) => {
    addNodes({ id: uuidv4(), type: 'text', position: nodePosition, data: { text } });
    setPaneClickFunction(undefined);
    onClose();
  };

  return (
    <ReactModal
      isOpen
      className="absolute left-2/4 top-2/4 m-auto h-auto w-2/6 min-w-72 -translate-x-2/4 -translate-y-2/4 rounded-md opacity-100"
      overlayClassName="Overlay"
      onRequestClose={onClose}
    >
      <h2 className="flex h-10 items-center justify-center rounded-t-md bg-(--primary-color) text-white">Ajouter du texte</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4 rounded-md bg-white p-4">
        <div>
          <Controller
            control={control}
            name="text"
            render={({ field: { value, onChange } }) => <Quill value={value} onChange={onChange} modules={quillModules} />}
          />
          <p className="text-center text-sm text-(--secondary-color)">{errors.text?.message}</p>
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            Valider
          </button>
        </div>
      </form>
    </ReactModal>
  );
}
