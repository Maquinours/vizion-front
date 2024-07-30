import { Button, Fade, Menu, MenuItem } from '@mui/material';
import { useContext, useState } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import useStore, { ExpertStudyNode, RFState } from '../../../Flow/utils/store';
import { useShallow } from 'zustand/react/shallow';
import { ExpertStudyTextNode } from '../../../Flow/components/TextNode/TextNode';
import { v4 as uuidv4 } from 'uuid';
import { ExpertStudyDensityCameraNode } from '../../../Flow/components/DensityCameraNode/DensityCameraNode';
import { groupBy } from 'lodash';
import { ExpertStudySynopticCameraNode } from '../../../Flow/components/SynopticCameraNode/SynopticCameraNode';
import ExpertStudyContext, { ExpertStudyModalType } from '../../../../utils/context';

const selector = (state: RFState) => ({
  getPages: state.getPages,
  addPage: state.addPage,
});
export default function AppViewStudyViewExpertViewHeaderComponentTransferMenuComponent() {
  const { getPages, addPage } = useStore(useShallow(selector));
  const { setModal } = useContext(ExpertStudyContext)!;

  const [anchorEl, setAnchorEl] = useState<HTMLElement>();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const onTransferSynopticsToQuotation = () => {
    setModal({ type: ExpertStudyModalType.CONFIRM_QUOTATION_TRANSFER });
  };

  const onTransferDensitiesToSynoptic = () => {
    handleClose();

    const pages = getPages();

    const nodes: Array<ExpertStudyNode> = [];
    let nextY = -40;
    pages
      .map((page, index) => ({ ...page, name: page.name?.trim() || `Page ${index + 1}` }))
      .filter((page) => page.type === 'density' && page.nodes.some((node) => node.type === 'densityCamera'))
      .forEach((page) => {
        nextY += 40;
        const pageName = page.name;
        const text: ExpertStudyTextNode = {
          id: uuidv4(),
          type: 'text',
          position: { x: 100, y: nextY },
          data: {
            text: pageName,
          },
        };
        nodes.push(text);
        nextY += 40;
        for (const [productId, densityNodes] of Object.entries(
          groupBy(
            page.nodes.filter((node): node is ExpertStudyDensityCameraNode => node.type === 'densityCamera'),
            'data.productId',
          ),
        )) {
          const node: ExpertStudySynopticCameraNode = {
            id: uuidv4(),
            type: 'synopticCamera',
            position: { x: 100, y: nextY },
            data: {
              productId: productId,
              quantity: densityNodes.length,
              options: [],
              size: { width: 80, height: 80 },
              opacity: 100,
            },
          };
          nodes.push(node);
          nextY += 80;
        }
      });

    const flowRect = (document.querySelector('.react-flow') as HTMLElement).getBoundingClientRect();
    const viewport = { x: 0, y: 0, zoom: flowRect.height / nextY };

    addPage('synoptic', { nodes, viewport });
  };

  return (
    <>
      <Button
        id="transfer-button"
        aria-controls={open ? 'transfer-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className="btn btn-primary flex gap-1"
      >
        <span className="normal-case">Transférer</span>
        <RiArrowDownSLine size={15} />
      </Button>
      <Menu
        id="transfer-menu"
        MenuListProps={{
          'aria-labelledby': 'transfer-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={onTransferSynopticsToQuotation}>
          <span className="w-full text-left text-sm text-gray-700">Synoptiques -&gt; devis</span>
        </MenuItem>
        <MenuItem onClick={onTransferDensitiesToSynoptic}>
          <span className="w-full text-left text-sm text-gray-700">Densités -&gt; synoptique</span>
        </MenuItem>
      </Menu>
    </>
  );
}
