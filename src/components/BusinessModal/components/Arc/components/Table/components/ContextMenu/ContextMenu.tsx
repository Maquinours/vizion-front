import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import React from 'react';
import BusinessArcDetailsResponseDto from '../../../../../../../../utils/types/BusinessArcDetailsResponseDto';
import styles from './ContextMenu.module.scss';
import { HiPencilAlt } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';

// const routePath = '/app/businesses-rma/business/$businessId/arc';

type BusinessModalComponentArcComponentTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  item: BusinessArcDetailsResponseDto | undefined;
  onUpdateDetailClick: (detail: BusinessArcDetailsResponseDto) => void;
  onDeleteDetailClick: (detail: BusinessArcDetailsResponseDto) => void;
}>;
export default function BusinessModalComponentArcComponentTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  item,
  onUpdateDetailClick,
  onDeleteDetailClick,
}: BusinessModalComponentArcComponentTableComponentContextMenuComponentProps) {
  const isOpen = Boolean(anchorElement);

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
                  <MenuItem>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateDetailClick(item);
                        onClose();
                      }}
                    >
                      <HiPencilAlt width={16} height={16} color={'#16204E'} />
                      <span>Modifier le produit</span>
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteDetailClick(item);
                        onClose();
                      }}
                    >
                      <FaTrash width={16} height={16} color={'#16204E'} />
                      <span>Supprimer le produit</span>
                    </button>
                  </MenuItem>
                  {/* <MenuItem>
                    <Link
                      from={routePath}
                      to="update-detail/$detailId"
                      params={{ detailId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      ignoreBlocker
                      onClick={onClose}
                    >
                      <HiPencilAlt width={16} height={16} color={'#16204E'} />
                      <span>Modifier le produit</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="delete-detail/$detailId"
                      params={{ detailId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      ignoreBlocker
                      onClick={onClose}
                    >
                      <FaTrash width={16} height={16} color={'#16204E'} />
                      <span>Supprimer le produit</span>
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
