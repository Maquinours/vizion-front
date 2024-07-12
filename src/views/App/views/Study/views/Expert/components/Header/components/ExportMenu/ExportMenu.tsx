import { Button, Fade, Menu, MenuItem } from '@mui/material';
import { useContext, useState } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import ExpertStudyContext, { ExpertStudyModalType } from '../../../../utils/context';

export default function AppViewStudyViewExpertViewHeaderComponentExportMenuComponent() {
  const { setModal } = useContext(ExpertStudyContext)!;

  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const onExportPdf = () => {
    handleClose();
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
