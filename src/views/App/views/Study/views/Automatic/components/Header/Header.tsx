import { useState } from 'react';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import { ReactFlowState, useStore } from '@xyflow/react';
import AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponent from './components/HddCalculationModal/HddCalculationModal';
import { Switch } from '@mui/material';
import { MatchRoute, getRouteApi } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { queries } from '../../../../../../../../utils/constants/queryKeys';

enum Modals {
  HDD_CALCULATION,
}

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/study/automatic');

const getNumberOfProducts = (state: ReactFlowState) =>
  Array.from(state.nodeLookup.values()).reduce((acc, node) => {
    let value = 1;
    const options = node.data.options;
    if (!!options && Array.isArray(options)) {
      value += options.reduce((acc, option) => {
        if ('qty' in option && typeof option.qty === 'number') return (acc += option.qty);
        return acc;
      }, 0);
    }
    return acc + value;
  }, 0);

export default function AppViewStudyViewAutomaticViewHeaderComponent() {
  const queryClient = useQueryClient();

  const numberOfProducts = useStore(getNumberOfProducts);

  const navigate = routeApi.useNavigate();

  const [modal, setModal] = useState<Modals>();

  const onSwitchChange = async () => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (!user.profile.expert) toast.warning("Fonctionnalité réservée aux experts, veuillez vous rapprocher de VIZEO pour plus d'informations.");
    else navigate({ to: '../expert', replace: true });
  };

  return (
    <>
      <div className="flex h-12 items-center justify-between px-6">
        <div className="flex items-center justify-center space-x-2">
          <MatchRoute to="/app/businesses-rma/business/$businessId/study/expert" pending>
            {(match) => <Switch checked={!!match} onChange={onSwitchChange} />}
          </MatchRoute>
          <span>Mode automatique</span>
        </div>
        <div className="flex h-full w-fit items-center justify-center space-x-3">
          <button
            className="flex items-center justify-center space-x-2 rounded-md bg-[#31385A] px-2 py-2 text-sm text-white"
            onClick={() => setModal(Modals.HDD_CALCULATION)}
          >
            <span> Outils de calcul de disque</span>
            <BsFillCameraVideoFill />
          </button>
          <span className="rounded-md border border-[#1a192b] px-2 py-2 text-sm text-[#1a192b]">
            Étude {numberOfProducts} {numberOfProducts < 2 ? 'produit' : 'produits'}
          </span>
        </div>
      </div>
      {modal === Modals.HDD_CALCULATION && <AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponent onClose={() => setModal(undefined)} />}
    </>
  );
}
