import classNames from 'classnames';
import LogoIdentification from '../../../../../../../../../../../../assets/images/identification.svg?react';
import LogoLecturePlaque from '../../../../../../../../../../../../assets/images/lecture_plaque.svg?react';
import LogoReconnaissance from '../../../../../../../../../../../../assets/images/reconnaissance.svg?react';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';

type Model = {
  product: ProductResponseDto;
  selected: boolean;
  data: { bestSeller: boolean; identification: number; plaque: number; reconnaissance: number; pir: number | undefined };
};

type AppViewStudyViewExpertViewModalProviderComponentTableComponentProps = Readonly<{
  models: Array<Model>;
  setModels: (models: Array<Model>) => void;
}>;
export default function AppViewStudyViewExpertViewModalProviderComponentTableComponent({
  models,
  setModels,
}: AppViewStudyViewExpertViewModalProviderComponentTableComponentProps) {
  const onSelectionChange = (model: Model) => {
    setModels(models.map((m) => (m.product.id === model.product.id ? { ...m, selected: !m.selected } : m)));
  };

  return (
    <div className="mt-10 flex w-fit min-w-[660px] flex-1 flex-col items-center justify-start rounded-md border-2 border-[#31385A] lg:w-full">
      <div className="w-full pl-6 pr-6 pt-6">
        <div className="flex">
          <div className="flex-[3_3_0%]"></div>
        </div>
        <table className="mt-1.5 w-full">
          <tbody>
            <tr className="flex h-full w-full">
              <th className="flex-[2_2_0%]"></th>
              {models.map((model, index) => (
                <th
                  key={model.product.id}
                  className={`flex-1 bg-[#31385A] text-center text-white ${classNames({ 'rounded-tr-md': index === models.length - 1 })}`}
                >
                  <p>{model.product.reference}</p>
                  <p className="text-xs">Code : {`${model.product.publicPrice}`.padStart(5, '0')}</p>
                </th>
              ))}
            </tr>
            <tr className="flex">
              <th className="flex-[2_2_0%] rounded-tl-md border-b-2 border-l-2 border-t-2 border-[#31385A] bg-[#101735] text-white">
                <div className="flex">
                  <div className="flex items-center p-2">
                    <LogoIdentification fill="white" width={36} height={36} />
                  </div>
                  <div className="p-2">
                    <p>Identification</p>
                    <p className="text-xs">min. 250 pixels/m*</p>
                  </div>
                </div>
              </th>
              {models.map((model) => (
                <td key={model.product.id} className={`flex flex-1 items-center justify-center border-b-2 border-r-2 border-[#313751] text-[#16204E]`}>
                  {model.data.identification}m{model.data.pir && model.data.identification > model.data.pir ? '¹' : ''}
                </td>
              ))}
            </tr>
            <tr className="flex">
              <th scope="row" className="flex-[2_2_0%] border-b-2 border-l-2 border-[#31385A] bg-[#6F7592] text-white">
                <div className="flex">
                  <div className="flex items-center p-2">
                    <LogoLecturePlaque fill="white" width={36} height={36} />
                  </div>
                  <div className="p-2">
                    <p>Lecture de plaque</p>
                    <p className="text-xs">min. 150 pixels/m*</p>
                  </div>
                </div>
              </th>
              {models.map((model) => (
                <td key={model.product.id} className={`flex flex-1 items-center justify-center border-b-2 border-r-2 border-[#313751] text-[#16204E]`}>
                  {model.data.plaque}m{model.data.pir && model.data.plaque > model.data.pir ? '¹' : ''}
                </td>
              ))}
            </tr>
            <tr className="flex">
              <th scope="row" className="flex-[2_2_0%] rounded-bl-md border-b-2 border-l-2 border-[#31385A] bg-[#EAEAEF] text-black">
                <div className="flex">
                  <div className="flex items-center p-2">
                    <LogoReconnaissance fill="black" width={36} height={36} />
                  </div>
                  <div className="p-2">
                    <p>Reconnaissance</p>
                    <p className="text-xs">min. 125 pixels/m*</p>
                  </div>
                </div>
              </th>
              {models.map((model) => (
                <td key={model.product.id} className={`flex flex-1 items-center justify-center border-b-2 border-r-2 border-[#313751] text-[#16204E]`}>
                  {model.data.reconnaissance}m{model.data.pir && model.data.reconnaissance > model.data.pir ? '¹' : ''}
                </td>
              ))}
            </tr>
            <tr className="flex h-2">
              <td className="flex-[2_2_0%] border-l-2 border-transparent"></td>
              <td className="flex-1 border-l-2 border-transparent"></td>
            </tr>
            <tr className="flex w-full rounded-l-md">
              <td className="flex-[1_1_0%] border-l-2 border-transparent"></td>
              <td
                className={`flex-1 rounded-l-md border-y-2 border-l-2 border-[#31385A] bg-[#676A83] ${classNames({ 'border-r-2': models.length < 1 || !models[0].data.bestSeller })} text-[#FBFCFE]`}
              >
                <div className="p-2">Sélection</div>
              </td>
              {models.map((model) => (
                <td
                  key={model.product.id}
                  onClick={() => onSelectionChange(model)}
                  className={`border-x-2" flex flex-1 justify-center border-b-2 border-r-2 border-t-2 border-[#31385A] text-[#16204E] ${
                    model == models[models.length - 1] ? 'rounded-r-md' : ''
                  }`}
                >
                  <div className="flex p-2">
                    <div className="flex flex-1 items-center justify-center">
                      <input className="camselection_input" type={'checkbox'} checked={model.selected} readOnly={true} />
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <div className="flex">
          <p className="flex-[1_1_0%] text-left text-xs font-bold text-[#16204E]">¹ Valeur mode jour</p>
          <div className="flex-1"></div>
          {models.map((model, modelId) => (
            <div key={modelId} className="flex-1 text-center text-xs font-bold text-[#F24C52]">
              {model.data.bestSeller ? 'MEILLEURES VENTES' : ''}
            </div>
          ))}
        </div>
        <div className="mt-2 flex">
          <p className="flex-[2_2_0%] text-left text-xs font-bold text-[#16204E]">*Norme Européenne EN 62676-4</p>
        </div>
      </div>
    </div>
  );
}
