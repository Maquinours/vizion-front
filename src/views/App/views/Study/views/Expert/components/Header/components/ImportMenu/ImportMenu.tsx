import { Button, Fade, Menu, MenuItem } from '@mui/material';
import { useReactFlow } from '@xyflow/react';
import { useState } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import { v4 as uuidv4 } from 'uuid';
import { fileToBase64Image } from '../../../../../../../../../../utils/functions/files';
import { ExpertStudyImageNode } from '../../../Flow/components/ImageNode/ImageNode';

export default function AppViewStudyViewExpertViewHeaderComponentImportMenuComponent() {
  const { addNodes, screenToFlowPosition } = useReactFlow();

  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const onImportImageButtonClick = () => {
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
        Importer
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
        <MenuItem onClick={onImportImageButtonClick}>Objet à partir de ce PC</MenuItem>
      </Menu>
    </>
  );
}
