import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { Link } from '@tanstack/react-router';
import { FaTrash } from 'react-icons/fa';
import styles from './ContextMenu.module.scss';
import AllBusinessResponseDto from '../../../../../../utils/types/AllBusinessResponseDto';
const routePath = '/app/enterprises/$enterpriseId';

type AppViewEnterpriseViewAllBusinessTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  selectedItem: AllBusinessResponseDto | undefined;
}>;
export default function AppViewEnterpriseViewAllBusinessTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  selectedItem,
}: AppViewEnterpriseViewAllBusinessTableComponentContextMenuComponentProps) {
  const isOpen = Boolean(anchorElement);

  const onClose = () => {
    setAnchorElement(undefined);
  };
  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start" className={styles.popper}>
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {selectedItem && (
                <MenuList>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="unrelate-business-rma/$businessRmaId"
                      params={{ businessRmaId: selectedItem.id }}
                      search
                      preload="render"
                      resetScroll={false}
                      onClick={onClose}
                    >
                      <FaTrash className={styles.icon} />
                      <span className={styles.text}>Supprimer le lien</span>
                    </Link>
                  </MenuItem>
                </MenuList>
              )}
            </Paper>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
}
