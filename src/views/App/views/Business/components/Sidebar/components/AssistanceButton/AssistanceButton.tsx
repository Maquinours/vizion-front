import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { toast } from 'react-toastify';
import { createTechnicalSupports } from '../../../../../../../../utils/api/technicalSupports';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import BillType from '../../../../../../../../utils/enums/BillType';
import CategoryBusiness from '../../../../../../../../utils/enums/CategoryBusiness';
import { formatDateWithSlash } from '../../../../../../../../utils/functions/dates';
import BusinessBpSerialResponseDto from '../../../../../../../../utils/types/BusinessBpSerialResponseDto';
import BusinessResponseDto from '../../../../../../../../utils/types/BusinessResponseDto';
import TechnicalSupportRequestDto from '../../../../../../../../utils/types/TechnicalSupportRequestDto';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId');

type AppViewBusinessViewSidebarComponentAssistanceButtonComponentProps = Readonly<{
  business: BusinessResponseDto;
}>;
export default function AppViewBusinessViewSidebarComponentAssistanceButtonComponent({
  business,
}: AppViewBusinessViewSidebarComponentAssistanceButtonComponentProps) {
  const queryClient = useQueryClient();

  const navigate = routeApi.useNavigate();

  const { mutate } = useMutation({
    mutationFn: (data: Array<TechnicalSupportRequestDto>) => createTechnicalSupports(data),
    onSuccess: (technicalSupports) => {
      queryClient.invalidateQueries({ queryKey: queries['technical-supports']._def });
      for (const technicalSupport of technicalSupports)
        queryClient.setQueryData(queries['technical-supports'].detail._ctx.byId(technicalSupport.id).queryKey, technicalSupport);

      if (technicalSupports.length !== 0) toast.success('Les assistances ont été créées avec succès.');
      navigate({ to: location.pathname, search: (old) => ({ ...old, businessModal: 'assistances' }), replace: true, resetScroll: false, ignoreBlocker: true });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la création des assistances.');
    },
  });

  const onClick = async () => {
    const technicalSupports = await queryClient.ensureQueryData(
      queries['technical-supports'].list._ctx.byBusinessOrRmaNumber({ categoryBusiness: CategoryBusiness.AFFAIRE, number: business.numBusiness }),
    );
    if (technicalSupports.length !== 0) {
      mutate([]);
      return;
    }

    const bill = (await queryClient.ensureQueryData(queries['business-bills'].list._ctx.byBusinessId(business.id))).find(
      (bill) => bill.type === BillType.FACTURE,
    );
    const nvrSerialNumbers =
      (await queryClient.ensureQueryData(queries['business-bps'].detail._ctx.byBusinessId(business.id))).bpDetailsList
        ?.flatMap((detail) => detail.bpSerialList) // We use the optional chaining operator cause the API can return 200 with no data if the business has no BP
        .filter((serial): serial is BusinessBpSerialResponseDto => !!serial && serial.numSerie.startsWith('B011')) ?? [];

    const data: Array<TechnicalSupportRequestDto> = nvrSerialNumbers.map((nvrSerialNumber) => {
      const recaps = [];
      if (bill?.createdDate) recaps.push({ name: 'Date de facturation', value: formatDateWithSlash(bill.createdDate) });
      recaps.push({ name: 'S2C', value: nvrSerialNumber.numSerie });

      return {
        name: nvrSerialNumber.numSerie,
        enterpriseId: business.enterpriseId,
        enterpriseName: business.enterpriseName,
        businessNum: business.numBusiness,
        predefinedTime: '00:00:00',
        cumulatedTime: '00:00:00',
        noBilledTime: '00:00:00',
        recaps: recaps,
      };
    });

    mutate(data);
  };

  return (
    <button className="btn btn-primary" onClick={onClick}>
      Assistance
    </button>
  );
}
