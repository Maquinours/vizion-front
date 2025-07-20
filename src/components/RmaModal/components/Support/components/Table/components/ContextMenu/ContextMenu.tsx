import { ClickAwayListener, Fade, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import React from 'react';
import AssistanceSupportDetailResponseDto from '../../../../../../../../utils/types/AssistanceSupportDetailResponseDto';
import styles from './ContextMenu.module.scss';

// const routeId = '/app/businesses-rma/rma/$rmaId/support';

type RmaModalComponentSupportComponentTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  item: AssistanceSupportDetailResponseDto | undefined;
}>;
export default function RmaModalComponentSupportComponentTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  item,
}: RmaModalComponentSupportComponentTableComponentContextMenuComponentProps) {
  const isOpen = !!anchorElement;

  const onClose = () => {
    setAnchorElement(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start" className="z-[9999]">
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {item && (
                <MenuList>
                  {/* <MenuItem>
                    <Link
                      from={routeId}
                      to="update-detail/$detailId"
                      params={{ detailId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      onClick={onClose}
                    >
                      <HiPencilAlt className={styles.icon} />
                      <span className={styles.text}>Modifier la ligne</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routeId}
                      to="delete-detail/$detailId"
                      params={{ detailId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      onClick={onClose}
                    >
                      <FaTrash className={styles.icon} />
                      <span className={styles.text}>Supprimer la ligne</span>
                    </Link>
                  </MenuItem> */}
                </MenuList>
              )}
            </Paper>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
}
