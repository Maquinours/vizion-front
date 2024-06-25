import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { useReactFlow } from 'reactflow';
import * as yup from 'yup';
import LoaderModal from '../../../../../../../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import { useEffect } from 'react';

const yupSchema = yup.object().shape({
  monitor: yup.mixed<ProductResponseDto>().required(),
});

type AppViewStudyViewAutomaticViewSidebarComponentMonitorSelectionModalComponentProps = Readonly<{
  onClose: () => void;
}>;
export default function AppViewStudyViewAutomaticViewSidebarComponentMonitorSelectionModalComponent({
  onClose,
}: AppViewStudyViewAutomaticViewSidebarComponentMonitorSelectionModalComponentProps) {
  const { addNodes, deleteElements, getNodes } = useReactFlow();

  const { control, getValues, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      monitor: undefined,
    },
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    ...queries.product.list,
    select: (products) => products.filter((product) => product.category === 'Moniteur'),
    staleTime: Infinity,
  });

  const onSubmit = ({ monitor }: yup.InferType<typeof yupSchema>) => {
    deleteElements({ nodes: getNodes().filter((node) => node.type === 'automatiqueTvNode') });
    addNodes([
      {
        id: monitor.id,
        position: { x: 800, y: 10 },
        type: 'automatiqueTvNode',
        data: {},
      },
    ]);
    onClose();
  };

  if (isLoadingProducts) return <LoaderModal />;

  useEffect(() => {
    if (!!products && !getValues('monitor')) {
      const product = products.find((product) => product.reference === 'MO132');
      if (!!product) setValue('monitor', product);
    }
  }, [isLoadingProducts]);

  return (
    <ReactModal
      isOpen
      className="absolute left-2/4 top-2/4 m-auto h-auto w-auto max-w-[1000px] -translate-x-2/4 -translate-y-2/4 rounded-[5px] p-0 opacity-100"
      overlayClassName="Overlay"
      onRequestClose={onClose}
    >
      <form className="w-full bg-white pb-2" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="flex h-10 items-center justify-center bg-[#16204e] text-white">MONITEURS</h2>
        <Controller
          control={control}
          name="monitor"
          render={({ field: { value, onChange } }) => (
            <div>
              {products?.map((product) => (
                <div className="mt-4 flex items-center justify-center space-x-4 px-4" onClick={() => onChange(product)}>
                  <div className="flex w-[30rem] items-center justify-center rounded-md border border-slate-800 px-2">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-36 overflow-hidden">
                        <img src={`https://bd.vizeo.eu/6-Photos/${product.reference}/${product.reference}.png`} />
                      </div>
                      <p className="first-letter:uppercase">{product.shortDescription}</p>
                    </div>

                    <div className="ml-16 border-l border-l-slate-700 pl-4">
                      <p>{product.reference}</p>
                      <p>Code: {`00${product.publicPrice}`}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-2">
                    <input type={'checkbox'} checked={value?.id === product.id} readOnly />
                  </div>
                </div>
              ))}
            </div>
          )}
        />
        <div className="mt-6 flex items-center justify-center space-x-2">
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
