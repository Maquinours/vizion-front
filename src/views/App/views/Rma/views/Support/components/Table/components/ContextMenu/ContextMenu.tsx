import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import React from 'react';
import AssistanceSupportDetailResponseDto from '../../../../../../../../../../utils/types/AssistanceSupportDetailResponseDto';
import { Link } from '@tanstack/react-router';
import { HiPencilAlt } from 'react-icons/hi';
import styles from './ContextMenu.module.scss';
import { FaTrash } from 'react-icons/fa';

const routeId = '/app/businesses-rma/rma/$rmaId/support';

type AppViewRmaViewSupportViewTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  item: AssistanceSupportDetailResponseDto | undefined;
}>;
export default function AppViewRmaViewSupportViewTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  item,
}: AppViewRmaViewSupportViewTableComponentContextMenuComponentProps) {
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
                    <Link from={routeId} to="update-detail/$detailId" params={{ detailId: item.id }} search replace resetScroll={false} preload="viewport">
                      <HiPencilAlt className={styles.icon} />
                      <span className={styles.text}>Modifier la ligne</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link from={routeId} to="delete-detail/$detailId" params={{ detailId: item.id }} search replace resetScroll={false} preload="viewport">
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
