import { yupResolver } from '@hookform/resolvers/yup';
import { useReactFlow } from '@xyflow/react';
import { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';
import Quill from '../../../../../../../../../../components/Quill/Quill';
import ExpertStudyContext from '../../../../utils/context';
import { ExpertStudyTextNode } from '../../../Flow/components/TextNode/TextNode';

const quillModules = {
  toolbar: {
    container: [['bold', 'italic', 'underline']],
  },
};

const yupSchema = yup.object().shape({
  text: yup.string().required('Champs requis'),
});

type AppViewStudyViewExpertViewModalProviderComponentEditTextModalComponentProps = Readonly<{
  nodeId: string;
}>;
export default function AppViewStudyViewExpertViewModalProviderComponentEditTextModalComponent({
  nodeId,
}: AppViewStudyViewExpertViewModalProviderComponentEditTextModalComponentProps) {
  const { getNode, updateNodeData } = useReactFlow();
  const { setModal } = useContext(ExpertStudyContext)!;

  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    setModal(undefined);
  };

  const onSubmit = ({ text }: yup.InferType<typeof yupSchema>) => {
    updateNodeData(nodeId, { text });
    onClose();
  };

  useEffect(() => {
    const node = getNode(nodeId);
    if (!node || node.type !== 'text') return;
    const textNode = node as ExpertStudyTextNode;
    setValue('text', textNode.data.text);
  }, [nodeId]);

  return (
    <ReactModal
      isOpen
      className="absolute left-2/4 top-2/4 m-auto h-auto w-2/6 min-w-72 -translate-x-2/4 -translate-y-2/4 rounded-md opacity-100"
      overlayClassName="Overlay"
      onRequestClose={onClose}
    >
      <h2 className="flex h-10 items-center justify-center rounded-t-md bg-[var(--primary-color)] text-white">Modifier un texte</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4 rounded-md bg-white p-4">
        <div>
          <Controller
            control={control}
            name="text"
            render={({ field: { value, onChange } }) => <Quill value={value} onChange={onChange} modules={quillModules} />}
          />
          <p className="text-center text-sm text-[var(--secondary-color)]">{errors.text?.message}</p>
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
