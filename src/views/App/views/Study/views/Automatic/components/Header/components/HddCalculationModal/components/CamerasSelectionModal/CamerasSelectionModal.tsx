import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';
import { queries } from '../../../../../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import LoaderModal from '../../../../../../../../../../../../components/LoaderModal/LoaderModal';

type Model = {
  product: ProductResponseDto;
  quantity: number;
};

const yupSchema = yup.object().shape({
  models: yup.array().of(yup.mixed<Model>().required()).required(),
});

type AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentCamerasSelectionModalComponentProps = Readonly<{
  onClose: () => void;
  onSubmit: ({ models }: { models: Array<Model> }) => void;
  models: Array<Model>;
}>;
export default function AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentCamerasSelectionModalComponent({
  onClose,
  onSubmit,
  models,
}: AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentCamerasSelectionModalComponentProps) {
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    ...queries.product.list,
    select: (products) =>
      products
        .filter(
          (product): product is ProductResponseDto & { category: NonNullable<Pick<ProductResponseDto, 'category'>> } =>
            !!product.category &&
            ['Caméra exterieure', 'Caméra interieure', 'Caméra universelle', 'Autres cameras'].includes(product.category) &&
            (product.specificationProducts?.some((spec) => spec.specification?.name === 'FLUX1') ?? false) &&
            (product.specificationProducts?.some((spec) => spec.specification?.name === 'FLUX2') ?? false),
        )
        .sort((a, b) => {
          const categories = ['Caméra exterieure', 'Caméra interieure', 'Caméra universelle', 'Autres cameras'];
          return categories.indexOf(a.category) - categories.indexOf(b.category);
        }),
    staleTime: Infinity,
  });

  const { control, setValue, getValues, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      models: [],
    },
  });

  useEffect(() => {
    if (!products) return;
    const models = getValues('models');
    setValue(
      'models',
      products.map((product) => {
        const model = models.find((model) => model.product.id === product.id);
        return {
          product,
          quantity: model?.quantity ?? 0,
        };
      }),
    );
  }, [products]);

  useEffect(() => {
    setValue(
      'models',
      getValues('models').map((model) => ({ ...model, quantity: models.find((m) => m.product.id === model.product.id)?.quantity ?? 0 })),
    );
  }, [models]);

  if (isLoadingProducts) return <LoaderModal />;

  return (
    <ReactModal
      isOpen
      onRequestClose={onClose}
      className="absolute left-2/4 top-2/4 z-2005 m-auto h-auto w-[70%] min-w-[70%] max-w-[1000px] -translate-x-2/4 -translate-y-2/4 rounded-[5px] p-0 opacity-100"
      overlayClassName="Overlay"
    >
      <form className="mx-auto flex max-h-[750px] max-w-6xl flex-col space-y-2 overflow-auto rounded-md bg-white pb-4" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="flex h-8 w-full items-center justify-center rounded-t-md bg-[#31385A] text-white">Choix des caméras</h1>
        <Controller
          control={control}
          name="models"
          render={({ field: { value, onChange } }) => (
            <div className="grid grid-cols-5 gap-4 overflow-auto p-4 pl-5 pr-5">
              {value.map((model) => (
                <div key={model.product.id}>
                  <div className="shadow-black-800 flex flex-col rounded-t-md border-b-0 p-4 shadow-lg">
                    <div className="flex items-center justify-center space-x-8 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <img
                          src={`https://bd.vizeo.eu/6-Photos/${model.product.reference}/${model.product.reference}.jpg`}
                          alt={`Produit ${model.product.reference}`}
                          className="h-24 w-32"
                        />
                        <div>
                          <p className="font-bold">{model.product.reference}</p>
                          <p className="text-gray-500">Code: {model.product.reference}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex h-8 w-full items-center justify-center rounded-b-md bg-[#31385A] text-white">
                    <div className="flex items-center justify-center gap-x-1">
                      <button
                        type="button"
                        className="px-2 font-bold text-red-600 disabled:opacity-50"
                        disabled={model.quantity === 0}
                        onClick={() => onChange(value.map((m) => (m.product.id === model.product.id ? { ...m, quantity: m.quantity - 1 } : m)))}
                      >
                        -
                      </button>
                      <p>{model.quantity}</p>
                      <button
                        type="button"
                        className="px-2 font-bold text-red-600"
                        onClick={() => onChange(value.map((m) => (m.product.id === model.product.id ? { ...m, quantity: m.quantity + 1 } : m)))}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        />

        <div className="flex items-center justify-center space-x-4 text-white">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              onClose();
            }}
          >
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            Suivant
          </button>
        </div>
      </form>
    </ReactModal>
  );
}
