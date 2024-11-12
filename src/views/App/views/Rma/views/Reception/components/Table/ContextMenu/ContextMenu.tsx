import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { Link } from '@tanstack/react-router';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import AssistanceReceptionDetailResponseDto from '../../../../../../../../../utils/types/AssistanceReceptionDetailResponseDto';
import styles from './ContextMenu.module.scss';

const routeId = '/app/businesses-rma/rma/$rmaId/reception';

type AppViewRmaViewReceptionViewTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  item: AssistanceReceptionDetailResponseDto | undefined;
}>;
export default function AppViewRmaViewReceptionViewTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  item,
}: AppViewRmaViewReceptionViewTableComponentContextMenuComponentProps) {
  const isOpen = !!anchorElement;

  const onClose = () => {
    setAnchorElement(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {item && (
                <MenuList>
                  <MenuItem>
                    <Link from={routeId} to="update-detail/$detailId" params={{ detailId: item.id }} search replace resetScroll={false} preload="render">
                      <HiPencilAlt className={styles.icon} />
                      <span className={styles.text}>Modifier la ligne</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link from={routeId} to="delete-detail/$detailId" params={{ detailId: item.id }} search replace resetScroll={false} preload="render">
                      <FaTrash className={styles.icon} />
                      <span className={styles.text}>Supprimer la ligne</span>
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
