import { Button, Fade, Menu, MenuItem } from '@mui/material';
import { useContext, useState } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import ExpertStudyContext, { ExpertStudyModalType } from '../../../../utils/context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import useStore, { RFState } from '../../../Flow/utils/store';
import { useShallow } from 'zustand/react/shallow';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import { synopticBusinessQueryKeys } from '../../../../../../../../../../utils/constants/queryKeys/synoptic';
import { toast } from 'react-toastify';
import { saveSynopticBusiness } from '../../../../../../../../../../utils/api/synoptic';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/study/expert');

const selector = (state: RFState) => ({
  getPages: state.getPages,
  getStudyName: state.getStudyName,
  getInstallerName: state.getInstallerName,
});

export default function AppViewStudyViewExpertViewHeaderComponentExportMenuComponent() {
  const queryClient = useQueryClient();

  const { getPages, getStudyName, getInstallerName } = useStore(useShallow(selector));
  const { setModal } = useContext(ExpertStudyContext)!;

  const { businessId } = routeApi.useParams();

  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const { mutate: saveSynopticBusinessMutate } = useMutation({
    mutationFn: async () => {
      const pages = getPages();
      const business = await queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId));

      return saveSynopticBusiness({
        name: 'SYNOPTIQUE',
        businessPticId: business.id,
        businessNumber: business.numBusiness,
        vizeo: true,
        vizeoptik: true,
        updateSynoptic: false,
        synopticList: {
          version: 2,
          studyName: getStudyName(),
          installerName: getInstallerName(),
          pages: pages,
        },
        enterpriseId: business.enterpriseId,
        enterpriseName: business.enterpriseName,
        profileId: business.profileId,
        profileName: business.profileName,
        profileEmail: business.profileEmail,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: synopticBusinessQueryKeys._def });
      toast.success('Le synoptique a été sauvegardé avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la sauvegarde du synoptique');
    },
  });

  const onExportPdf = () => {
    handleClose();
    saveSynopticBusinessMutate();
    setModal({ type: ExpertStudyModalType.PDF, data: { step: 'IMAGE_GENERATION' } });
  };

  return (
    <>
      <Button
        id="export-button"
        aria-controls={open ? 'export-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className="btn btn-primary flex gap-1"
      >
        <span className="normal-case">Exporter</span>
        <RiArrowDownSLine size={15} />
      </Button>
      <Menu
        id="export-menu"
        MenuListProps={{
          'aria-labelledby': 'export-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={onExportPdf}>
          <span className="w-full text-left text-sm text-gray-700">Sauvegarder et éditer PDF</span>
        </MenuItem>
      </Menu>
    </>
  );
}
