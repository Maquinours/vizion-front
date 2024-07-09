import { yupResolver } from '@hookform/resolvers/yup';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { Node, ReactFlowState, useStore } from 'reactflow';
import * as yup from 'yup';
import { useShallow } from 'zustand/react/shallow';
import AmountFormat from '../../../../../../../../../../components/AmountFormat/AmountFormat';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import ExpertStudyContext from '../../../../utils/context';
import { AppViewStudyViewExpertViewFlowComponentRecorderNodeComponentData } from '../../../Flow/components/RecorderNode/RecorderNode';
import { AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponentData } from '../../../Flow/components/SynopticCameraNode/SynopticCameraNode';

const yupSchema = yup.object().shape({
  hoursPerDay: yup.number().required().min(1).max(24),
});

const getData = (state: ReactFlowState, products: Array<ProductResponseDto>) => {
  const nodes = Array.from(state.nodeInternals.values());
  const flux = nodes
    .filter((node): node is Node<AppViewStudyViewExpertViewFlowComponentSynopticCameraNodeComponentData, 'synopticCamera'> => node.type === 'synopticCamera')
    .reduce((acc, node) => {
      const product = products.find((product) => product.id === node.data.productId);
      if (!product) return acc;
      const flux1 = product.specificationProducts?.find((spec) => spec.specification?.name === 'FLUX1')?.value;
      const flux2 = product.specificationProducts?.find((spec) => spec.specification?.name === 'FLUX2')?.value;

      if (!flux1 || !flux2) return acc;

      return acc + (flux1 + flux2);
    }, 0);

  const hddSpace = nodes
    .filter((node): node is Node<AppViewStudyViewExpertViewFlowComponentRecorderNodeComponentData, 'recorder'> => node.type === 'recorder')
    .reduce((acc, node) => {
      const capacity = products
        .find((product) => product.id === node.data.productId)
        ?.specificationProducts?.find((spec) => spec.specification?.name === 'CAPACITE')?.value;
      if (!capacity) return acc;

      const optionsCapacity = node.data.options.reduce((acc, option) => {
        const capacity = products
          .find((product) => product.id === option.id)
          ?.specificationProducts?.find((spec) => spec.specification?.name === 'CAPACITE')?.value;
        if (!capacity) return acc;

        return acc + capacity * option.quantity;
      }, 0);

      return acc + capacity + optionsCapacity;
    }, 0);

  return { flux, hddSpace };
};
export default function AppViewStudyViewExpertViewModalProviderComponentHddCalculationModalComponent() {
  const { setModal } = useContext(ExpertStudyContext)!;

  const { data: products } = useSuspenseQuery(queries.product.list);

  const { flux, hddSpace } = useStore(useShallow((state) => getData(state, products)));

  const { control, watch, getValues } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      hoursPerDay: 24,
    },
  });

  const days = useMemo(() => {
    const hoursPerDay = getValues('hoursPerDay');
    if (flux === 0 || hddSpace === 0) return 0;

    return (
      (1024 * hddSpace) /
      (((flux / // Kbps
        8) * // KBps
        3600) / // KB per hour
        1024 / // MB per hour
        1024) / // GB per hour
      hoursPerDay
    );
  }, [watch('hoursPerDay'), flux, hddSpace]);

  const onClose = () => {
    setModal(undefined);
  };

  return (
    <ReactModal
      isOpen
      onRequestClose={onClose}
      className="absolute left-2/4 top-2/4 z-[2005] m-auto h-auto w-auto min-w-[70%] max-w-[1000px] -translate-x-2/4 -translate-y-2/4 rounded-[5px] p-0 opacity-100"
      overlayClassName="Overlay"
    >
      <div className="mx-auto flex max-h-[750px] flex-col space-y-2 overflow-auto rounded-md bg-white pb-4">
        <h1 className="flex h-8 w-full items-center justify-center rounded-t-md bg-[#16204e] text-white">Paramétrage</h1>

        <div className="grid grid-rows-1 gap-4 p-4 pl-5 pr-5">
          <div className="grid-row-3 grid">
            <div className="flex items-center">
              <span className="pr-4 text-sm font-bold text-[#16204E]">Paramétrage personnalisé</span>
              <div className="h-px flex-grow bg-gray-400"></div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="default-range" className="text-center font-bold text-[#16204E]">
                {"Temps d'enregistrement par jour"}
              </label>
              <Controller
                control={control}
                name="hoursPerDay"
                render={({ field: { value, onChange } }) => (
                  <div className="w-full p-3 ">
                    <ul className="mb-4 flex w-full justify-between px-[10px]">
                      <li className="relative flex justify-center">
                        <span className="absolute">1H</span>
                      </li>
                      <li className="relative flex justify-center">
                        <span className="absolute">{value}H</span>
                      </li>
                      <li className="relative flex justify-center">
                        <span className="absolute">24H</span>
                      </li>
                    </ul>
                    <input
                      id="default-range"
                      type="range"
                      min={1}
                      max={24}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="h-2 w-full cursor-pointer rounded-lg bg-red-600 dark:bg-gray-700"
                    />
                  </div>
                )}
              />
            </div>
          </div>
          <div className="grid-row-3 grid">
            <div className="flex items-center">
              <span className="pr-4 text-sm font-bold text-[#16204E]">{"Données d'enregistrement"}</span>
              <div className="h-px flex-grow bg-gray-400"></div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-center p-2">
                <div className="flex flex-col items-center justify-center">
                  <div className="flex w-fit">
                    <AmountFormat
                      className="w-24 p-1 text-center font-bold text-[#16204E]"
                      displayType="text"
                      decimalScale={2}
                      suffix={days < 2 ? ' jour' : ' jours'}
                      value={days}
                    />
                  </div>
                  <span className="font-bold text-[#16204E]">{"Durée de l'enregistrement"}</span>
                </div>
              </div>
              <hr />
              <div className="flex justify-center p-2">
                <div className="flex flex-col items-center justify-center">
                  <div className="flex w-fit">
                    <AmountFormat
                      className="w-24 p-1 text-center font-bold text-[#16204E]"
                      displayType="text"
                      fixedDecimalScale
                      decimalScale={2}
                      suffix=" To"
                      value={hddSpace}
                    />
                  </div>
                  <span className="font-bold text-[#16204E]">Votre espace disque dur</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 text-white">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
