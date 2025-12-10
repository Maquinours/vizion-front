import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';
import AmountFormat from '../../../../../../../../../../../../components/AmountFormat/AmountFormat';
import { useEffect, useMemo } from 'react';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';

type Model = {
  product: ProductResponseDto;
  quantity: number;
};

const yupSchema = yup.object().shape({
  hoursPerDay: yup.number().required().min(1).max(24),
  days: yup.number().required().min(0),
  hddSpace: yup.number().required().min(0),
});

type AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentSettingsModalComponentProps = Readonly<{
  onPrevious: (data: yup.InferType<typeof yupSchema>) => void;
  onClose: () => void;
  onSubmit: (data: yup.InferType<typeof yupSchema>) => void;
  settings: { hoursPerDay: number; days: number; hddSpace: number } | undefined;
  models: Array<Model>;
}>;
export default function AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentSettingsModalComponent({
  onPrevious,
  onClose,
  onSubmit,
  settings,
  models,
}: AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentSettingsModalComponentProps) {
  const { control, getValues, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      hoursPerDay: 24,
      days: 30,
    },
  });

  const flux = useMemo(() => {
    return models.reduce((acc, model) => {
      const flux1 = model.product.specificationProducts!.find((spec) => spec.specification?.name === 'FLUX1')!.value!;
      const flux2 = model.product.specificationProducts!.find((spec) => spec.specification?.name === 'FLUX2')!.value!;

      return acc + (flux1 + flux2) * model.quantity;
    }, 0);
  }, [models]);

  const onDaysHoursPerDayChange = () => {
    const hoursPerDay = getValues('hoursPerDay');
    const days = getValues('days');
    const hddSpace =
      (flux *
        3600 * // bits/s to bits/h
        hoursPerDay * // bits/day depending on number of hours registred per day
        days) / // total bits
      8 / // bits to bytes
      1024 / // bytes to KB
      1024 / // KB to MB
      1024; // MB to GB

    setValue('hddSpace', hddSpace);
  };

  const onHddSpaceChange = () => {
    const hoursPerDay = getValues('hoursPerDay');
    const hddSpace = getValues('hddSpace');
    const days =
      (1024 * hddSpace) /
      (((flux / // Kbps
        8) * // KBps
        3600) / // KB per hour
        1024 / // MB per hour
        1024) / // GB per hour
      hoursPerDay;

    setValue('days', days);
  };

  useEffect(() => {
    if (settings) {
      setValue('hoursPerDay', settings.hoursPerDay);
      setValue('days', settings.days);
      setValue('hddSpace', settings.hddSpace);
    }
  }, [settings]);

  useEffect(() => {
    onDaysHoursPerDayChange();
  }, []);

  return (
    <ReactModal
      isOpen
      onRequestClose={onClose}
      className="absolute top-2/4 left-2/4 z-2005 m-auto h-auto w-auto max-w-[1000px] min-w-[70%] -translate-x-2/4 -translate-y-2/4 rounded-[5px] p-0 opacity-100"
      overlayClassName="Overlay"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex max-h-[750px] flex-col space-y-2 overflow-auto rounded-md bg-white pb-4">
        <h1 className="flex h-8 w-full items-center justify-center rounded-t-md bg-[#16204e] text-white">Paramétrage</h1>

        <div className="grid grid-rows-1 gap-4 p-4 pr-5 pl-5">
          <div className="grid-row-3 grid">
            <div className="flex items-center">
              <span className="pr-4 text-sm font-bold text-[#16204E]">Paramétrage personnalisé</span>
              <div className="h-px grow bg-gray-400"></div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="default-range" className="text-center font-bold text-[#16204E]">
                {"Temps d'enregistrement par jour"}
              </label>
              <Controller
                control={control}
                name="hoursPerDay"
                render={({ field: { value, onChange } }) => (
                  <div className="w-full p-3">
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
                      onChange={(e) => {
                        onChange(e.target.value);
                        onDaysHoursPerDayChange();
                      }}
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
              <div className="h-px grow bg-gray-400"></div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-center p-2">
                <div className="flex flex-col items-center justify-center">
                  <div className="flex w-fit">
                    <Controller
                      control={control}
                      name="days"
                      render={({ field: { value, onChange } }) => (
                        <AmountFormat
                          className="w-24 border border-black p-1 text-center font-bold text-[#16204E]"
                          displayType="input"
                          decimalScale={2}
                          suffix={value !== undefined && value < 2 ? ' jour' : ' jours'}
                          value={value}
                          onValueChange={(v, info) => {
                            if (info.source === 'event') {
                              onChange(v.value);
                              onDaysHoursPerDayChange();
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                  <span className="font-bold text-[#16204E]">{"Durée de l'enregistrement"}</span>
                </div>
              </div>
              <hr />
              <div className="flex justify-center p-2">
                <div className="flex flex-col items-center justify-center">
                  <div className="flex w-fit">
                    <Controller
                      control={control}
                      name="hddSpace"
                      render={({ field: { value, onChange } }) => (
                        <AmountFormat
                          className="w-24 border border-black p-1 text-center font-bold text-[#16204E]"
                          displayType="input"
                          fixedDecimalScale
                          decimalScale={2}
                          suffix=" To"
                          value={value}
                          onValueChange={(v, info) => {
                            if (info.source === 'event') {
                              onChange(v.value);
                              onHddSpaceChange();
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                  <span className="font-bold text-[#16204E]">Votre espace disque dur</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 text-white">
          <button type="button" className="btn btn-secondary" onClick={handleSubmit((data) => onPrevious(data))}>
            Précédent
          </button>
          <button type="submit" className="btn btn-primary">
            Accèder au résultat
          </button>
        </div>
      </form>
    </ReactModal>
  );
}
