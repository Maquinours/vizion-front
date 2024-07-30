import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import synopticPicture from '../../../../../../../../assets/images/synoptic.webp';
import densityPicture from '../../../../../../../../assets/images/density.webp';
import useStore, { RFState } from '../Flow/utils/store';
import { useShallow } from 'zustand/react/shallow';
import { useMutation, useQuery } from '@tanstack/react-query';
import { synopticBusinessQueryKeys } from '../../../../../../../../utils/constants/queryKeys/synoptic';
import { getRouteApi } from '@tanstack/react-router';
import { parseStudy } from '../../utils/functions/parse';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/study/expert');

const yupSchema = yup.object().shape({
  selection: yup.mixed<'synoptic' | 'density'>().required(),
});

const selector = (state: RFState) => ({
  addPage: state.addPage,
  importStudy: state.importStudy,
});

export default function AppViewStudyViewExpertViewFirstPageTypeSelectionComponent() {
  const { addPage, importStudy } = useStore(useShallow(selector));

  const { businessId } = routeApi.useParams();

  const { data: synoptic, isLoading: isLoadingSynoptic } = useQuery(synopticBusinessQueryKeys.detail._ctx.byBusinessId(businessId));

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      selection: 'synoptic' as 'synoptic',
    },
  });

  const onSubmit = ({ selection }: yup.InferType<typeof yupSchema>) => {
    addPage(selection);
  };

  const { mutate: importStudyMutate, isPending: isImportingStudy } = useMutation({
    mutationFn: async () => {
      if (!synoptic?.synopticList) return;
      const study = await parseStudy(synoptic.synopticList);
      importStudy(study);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'importation du synoptique");
    },
  });

  return (
    <div className="flex flex-col gap-y-3">
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
      <div className="flex flex-col items-center justify-center gap-y-2">
        <button onClick={handleSubmit(onSubmit)} className="btn btn-primary">
          Appliquer
        </button>
        <button disabled={!synoptic?.synopticList || isImportingStudy} onClick={() => importStudyMutate()} className="btn btn-secondary">
          {isLoadingSynoptic ? 'Chargement...' : isImportingStudy ? 'Importation en cours...' : "Importer synoptique de l'affaire"}
        </button>
      </div>
    </div>
  );
}
