import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { Link } from '@tanstack/react-router';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import { MdOutlineInventory } from 'react-icons/md';
import ProductVersionShelfStockResponseDto from '../../../../../../../../../../../utils/types/ProductVersionShelfStockResponseDto';
import styles from './ContextMenu.module.scss';

const routePath = '/app/products/$productId/manage';

type AppViewProductViewManageViewStocksComponentTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  stock: ProductVersionShelfStockResponseDto | undefined;
}>;
export default function AppViewProductViewManageViewStocksComponentTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  stock,
}: AppViewProductViewManageViewStocksComponentTableComponentContextMenuComponentProps) {
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
              {stock && (
                <MenuList>
                  <MenuItem>
                    <Link from={routePath} to="stock-history/$stockId" params={{ stockId: stock.id }} search replace resetScroll={false} preload="viewport">
                      <MdOutlineInventory className={styles.icon} width={16} height={16} color="#16204E" />
                      <span className={styles.text}>Historique du stock</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link from={routePath} to="delete-stock/$stockId" params={{ stockId: stock.id }} search replace resetScroll={false} preload="viewport">
                      <FaTrash className={styles.icon} width={16} height={16} color="#16204E" />
                      <span className={styles.text}>Supprimer le stock</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link from={routePath} to="update-stock/$stockId" params={{ stockId: stock.id }} search replace resetScroll={false} preload="viewport">
                      <HiPencilAlt className={styles.icon} width={16} height={16} color="#16204E" />
                      <span className={styles.text}>Modifier le stock</span>
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
