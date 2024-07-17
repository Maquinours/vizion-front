import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import synopticPicture from '../../../../../../../../assets/images/synoptic.webp';
import densityPicture from '../../../../../../../../assets/images/density.webp';
import useStore, { RFState } from '../Flow/utils/store';
import { useShallow } from 'zustand/react/shallow';

const yupSchema = yup.object().shape({
  selection: yup.mixed<'synoptic' | 'density'>().required(),
});

const selector = (state: RFState) => ({
  addPage: state.addPage,
});

export default function AppViewStudyViewExpertViewFirstPageTypeSelectionComponent() {
  const { addPage } = useStore(useShallow(selector));

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      selection: 'synoptic' as 'synoptic',
    },
  });

  const onSubmit = ({ selection }: yup.InferType<typeof yupSchema>) => {
    addPage(selection);
  };

  return (
    <div id="firstpagemode_selection_div" className="z-[4]">
      <h1 className="pb-5 font-bold text-[#31385A] underline">Sélectionner le type de la première page :</h1>
      <Controller
        control={control}
        name="selection"
        render={({ field: { value, onChange } }) => (
          <div className="flex flex-col gap-y-2">
            <button className="flex cursor-pointer items-center" onClick={() => onChange('synoptic')}>
              <img className="border-2 border-solid border-black" src={synopticPicture} width={224} height={228} />
              <label className="w-24 cursor-pointer text-right font-bold text-[#A60DCA]" htmlFor="firstPageModeSelectionSynoptic">
                Synoptique :
              </label>
              <input
                className="ml-1 cursor-pointer"
                id="firstPageModeSelectionSynoptic"
                type="radio"
                name="firstPageModeSelection"
                checked={value === 'synoptic'}
                readOnly
              />
            </button>
            <button className="flex cursor-pointer items-center" onClick={() => onChange('density')}>
              <img className="border-2 border-solid border-black" src={densityPicture} width={224} height={228} />
              <label className="w-24 cursor-pointer text-right font-bold text-[#0D6AE3]" htmlFor="firstPageModeSelectionDensity">
                Densité :
              </label>
              <input
                className="ml-1 cursor-pointer"
                id="firstPageModeSelectionDensity"
                type="radio"
                name="firstPageModeSelection"
                checked={value === 'density'}
                readOnly
              />
            </button>
          </div>
        )}
      />
      <div className="text-center">
        <div className="pt-3">
          <button id="applyfirstpagemode-button" onClick={handleSubmit(onSubmit)} className="btn btn-primary">
            Appliquer
          </button>
        </div>
        {/* <div className={`pt-1 ${savedSynoptic === null ? 'invisible' : ''}`}>
          <button onClick={onImportSavedSynoptic} className="btn btn-secondary">
            {"Importer synoptique de l'affaire"}
          </button>
        </div> */}
      </div>
    </div>
  );
}
