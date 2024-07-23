import { Button, Fade, Menu, MenuItem } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useReactFlow } from '@xyflow/react';
import { useContext, useState } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import { v4 as uuidv4 } from 'uuid';
import { useShallow } from 'zustand/react/shallow';
import { synopticBusinessQueryKeys } from '../../../../../../../../../../utils/constants/queryKeys/synoptic';
import { fileToBase64Image } from '../../../../../../../../../../utils/functions/files';
import ExpertStudyContext, { ExpertStudyModalType } from '../../../../utils/context';
import { getStudy } from '../../../../utils/functions/import';
import { ExpertStudyBackgroundNode } from '../../../Flow/components/BackgroundNode/BackgroundNode';
import { ExpertStudyImageNode } from '../../../Flow/components/ImageNode/ImageNode';
import useStore, { RFState } from '../../../Flow/utils/store';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/study');

const selector = (state: RFState) => ({
  pageType: state.pages[state.currentPage].type,
  importStudy: state.importStudy,
});
export default function AppViewStudyViewExpertViewHeaderComponentImportMenuComponent() {
  const { pageType, importStudy } = useStore(useShallow(selector));

  const { addNodes, screenToFlowPosition, getNodes, deleteElements } = useReactFlow();
  const { setModal } = useContext(ExpertStudyContext)!;

  const { businessId } = routeApi.useParams();

  const { data: synoptic, isLoading: isLoadingSynoptic } = useQuery(synopticBusinessQueryKeys.detail._ctx.byBusinessId(businessId));

  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const onImportImageButtonClick = () => {
    handleClose();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg, image/webp, application/pdf';
    input.onchange = async () => {
      const file = input.files?.item(0);
      if (!file) return;
      const base64 = await fileToBase64Image(file, { compress: true });
      const reactFlowRect = document.querySelector('.react-flow')!.getBoundingClientRect();
      const position = screenToFlowPosition({ x: reactFlowRect.x, y: reactFlowRect.y });

      const node: ExpertStudyImageNode = {
        id: uuidv4(),
        type: 'image',
        position: position,
        data: {
          image: base64,
          size: {
            width: 100,
            height: 100,
          },
          rotation: 0,
        },
      };
      addNodes(node);
      input.remove();
    };
    input.click();
  };

  const onImportGedImageButtonClick = () => {
    handleClose();
    setModal({ type: ExpertStudyModalType.IMPORT_GED_IMAGE, data: { type: 'image' } });
  };

  const onImportBackgroundButtonClick = () => {
    handleClose();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg, image/webp, application/pdf';
    input.onchange = async () => {
      const file = input.files?.item(0);
      if (!file) return;
      const base64 = await fileToBase64Image(file, { compress: true });
      const reactFlowRect = document.querySelector('.react-flow')!.getBoundingClientRect();
      const position = screenToFlowPosition({ x: reactFlowRect.x, y: reactFlowRect.y });
      const endPosition = screenToFlowPosition({ x: reactFlowRect.x + reactFlowRect.width, y: reactFlowRect.y + reactFlowRect.height });
      const { width, height } = { width: endPosition.x - position.x, height: endPosition.y - position.y };

      const node: ExpertStudyBackgroundNode = {
        id: 'background',
        type: 'background',
        position: position,
        data: {
          image: base64,
          width: width,
          height: height,
          scale: 1,
          opacity: 1,
          rotation: 0,
        },
        zIndex: -1,
        draggable: false,
      };
      const backgroundNodes = getNodes().filter((node) => node.type === 'background');
      deleteElements({ nodes: backgroundNodes });
      addNodes(node);
      input.remove();
    };
    input.click();
  };

  const onImportGedBackgroundButtonClick = () => {
    handleClose();
    setModal({ type: ExpertStudyModalType.IMPORT_GED_IMAGE, data: { type: 'background' } });
  };

  const { mutate: importStudyMutate, isPending: isImportingStudy } = useMutation({
    mutationFn: async () => {
      if (!synoptic?.synopticList) return;
      const study = await getStudy(synoptic.synopticList);
      importStudy(study);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'importation du synoptique");
    },
  });

  return (
    <>
      <Button
        id="import-button"
        aria-controls={open ? 'import-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className="btn btn-primary flex gap-1"
      >
        <span className="normal-case">Importer</span>
        <RiArrowDownSLine size={15} />
      </Button>
      <Menu
        id="import-menu"
        MenuListProps={{
          'aria-labelledby': 'import-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {pageType === 'density' && [
          <MenuItem key={0} onClick={onImportBackgroundButtonClick}>
            <span className="w-full text-left text-sm text-gray-700">Plan à partir de ce PC</span>
          </MenuItem>,
          <MenuItem key={1} onClick={onImportGedBackgroundButtonClick}>
            <span className="w-full text-left text-sm text-gray-700">Plan à partir de la GED</span>
          </MenuItem>,
        ]}
        <MenuItem onClick={onImportImageButtonClick}>
          <span className="w-full text-left text-sm text-gray-700">Objet à partir de ce PC</span>
        </MenuItem>
        <MenuItem onClick={onImportGedImageButtonClick}>
          <span className="w-full text-left text-sm text-gray-700">Objet à partir de la GED</span>
        </MenuItem>
        <MenuItem disabled={!synoptic?.synopticList || isImportingStudy} onClick={() => importStudyMutate()}>
          <span className="w-full text-left text-sm text-gray-700">
            {isLoadingSynoptic ? 'Chargement...' : isImportingStudy ? 'Importation en cours...' : "Synoptique de l'affaire"}
          </span>
        </MenuItem>
      </Menu>
    </>
  );
}
